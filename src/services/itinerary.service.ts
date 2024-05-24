import { Injectable } from '@nestjs/common';
import { chatsCollection } from './firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { AITypeEnum, ChatIdModel, ChatModel, ChatRole } from 'src/models';
import { gemini } from './ai';
import { Content } from '@google/generative-ai';
import { dateUtil, utils } from 'src/utils';

@Injectable()
export class ItineraryService {
  //#region private func
  private async withBare(prompt: string, his: ChatIdModel[]) {
    const cxt: Content[] = [
      {
        role: 'user',
        parts: [
          {
            text: `Act as a travel consultant, please advise me on travel issues.
            Answer the question in a fun way, don't be too mechanical or stiff.`,
          },
        ],
      },
      {
        role: 'model',
        parts: [{ text: 'Sure, what can I help you with?' }],
      },
    ];
    const history: Content[] = [
      ...cxt,
      ...his.map((h) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
    ];
    const result = await gemini.base.startChat({ history }).sendMessage(prompt);
    const textGemini = result.response.text();
    return textGemini;
  }

  private async getHistoryChat(userId: string) {
    const chats = await chatsCollection.getBy(
      { userId },
      { orderBy: 'createdAt', direction: 'asc' },
    );

    return chats;
  }

  private async promptScheduleBaseOnChat(userId: string) {
    const history = await this.getHistoryChat(userId);
    const prompt = `
    Based on the above conversation, and the locations discussed, 
    please create a suitable and convenient itinerary for each day of the trip.
    Create data based on the format below: 
    {
      locationName: string
      coords: [number, number]
      day: number
      time: string
      note: string
    }[] 
    With the 'day' field representing which day of the trip this is;
    'locationName' represents the name of the place to visit;
    'coords' represents the specific coordinates of the place to visit;
    'note' is a suggestion, advice on what to do, what to see at that location, please provide as detailed and specific advice as possible;
    'time' is the time point when visiting that tourist location, specify the exact hour.
    Only output the data in JSON format, do not add any other content.`;
    const response = await this.withBare(prompt, history);
    return response;
  }
  private async promptScheduleBaseOnPreference(references: References) {
    const { destination, startDate, endDate, member, styles, activities } =
      references;
    /**
     * 
     * Please help me create a travel plan based on the following criteria:

      Destination: Japan
      Style: Luxury, adventurous
      Start date: May 20, 2025
      End date: June 3, 2025
      Number of members: solo
      Activities aimed at: mountain climbing, exploration
     * 
     * please create a suitable and convenient itinerary for each day of the trip.
     * 
     */
    const duration = dateUtil.calculateDaysDifference(startDate, endDate) + 1;
    const prompt = `Please help me create a travel plan based on the following criteria:
    - Destination: ${destination}; 
    - Style: ${styles.join(', ')};
    - Start date: ${dateUtil.getDay(startDate)};
    - End date: ${dateUtil.getDay(endDate)};
    - Duration: ${duration} days;
    - Number of members: ${member};
    - Activities aimed at: ${activities.join(', ')};
    Create data based on the format below: 
    {
      locationName: string
      coords: [number, number]
      day: number
      time: string
      note: string
    }[] 
    With the 'day' field representing which day of the trip this is;
    'locationName' represents the name of the place to visit;
    'coords' represents the specific coordinates of the place to visit;
    'note' is a suggestion, advice on what to do, what to see at that location, please provide as detailed and specific advice as possible;
    'time' is the time point when visiting that tourist location, specify the exact hour.
    Only output the data in JSON format, do not add any other content.`;
    const response = await this.withBare(prompt, []);
    return response;
  }
  private async promptAccommodation(listLocationsString: string) {
    const prompt = `
    ${listLocationsString}, these are all the places I will visit.
    Based on the array of places, 
    find suitable/nearby guesthouses/hotels;
    each location should have at least one accommodation found,
    if there are none, then skip it.
    Create data based on the format below: 
    {
      accommodationName: string;
      coords: [number, number];
      description: string;
      link: string;
    }[] 
    With the 'accommodationName' field representing name of the accommodation;
    'coords' represents the specific coordinates;
    'description' represents the detail;
    'link' of accommodation is the URL leading to the link https://www.booking.com/.
    Only output the data in JSON format, do not add any other content.`;
    const response = await this.withBare(prompt, []);

    return response;
  }
  private async generateFrom({
    userId,
    references,
  }: {
    userId?: string;
    references?: References;
  }) {
    console.log('=======================================================');
    console.log('create a plan');

    const responseSchedule = await (userId
      ? this.promptScheduleBaseOnChat(userId)
      : references
        ? this.promptScheduleBaseOnPreference(references)
        : '');

    const scheduleObject = this.stringToObjectJson<Schedule[]>(
      responseSchedule,
      [],
    );
    const scheduleObjectWithLink = scheduleObject.map<Schedule>((j) => ({
      ...j,
      link: `https://www.viator.com/searchResults/all?text=${j.locationName.replaceAll(' ', '%20')}`,
    }));

    const listLocationsString = JSON.stringify(
      scheduleObject.map((j) => j.locationName),
    );
    const responseAccommodation =
      await this.promptAccommodation(listLocationsString);
    const accommodationObject = this.stringToObjectJson<Accommodation[]>(
      responseAccommodation,
      [],
    );

    return {
      schedule: scheduleObjectWithLink,
      accommodations: accommodationObject,
    };
  }

  private isCompletedJson(jsonString: string) {
    const result =
      utils.countChar(jsonString, '{') === utils.countChar(jsonString, '}') &&
      utils.countChar(jsonString, '[') === utils.countChar(jsonString, ']');
    return result;
  }
  private stringToObjectJson<T>(rawStr: string, defaultValue: T) {
    const str = rawStr
      .replaceAll(/json/gi, '')
      .replaceAll('`', '')
      .replaceAll('\n', '')
      .replaceAll('\t', '')
      .replace(/\s{2,}/g, '')
      .trim();

    const isCompletedJsonString = this.isCompletedJson(str);
    const completedJsonString = isCompletedJsonString
      ? str
      : this.cutUncompletedJsonString(str);

    let object: T = defaultValue;
    try {
      object = new Function('return ' + completedJsonString)() as T;
    } catch (e) {
      console.log(e);
    }

    return object;
  }
  private cutUncompletedJsonString(jsonString: string) {
    if (!jsonString.length) return '';

    const firstChar = jsonString[0];
    const lastChar = firstChar === '{' ? '}' : ']';

    let count = 0; // count for  both { } and [ ]
    let currPosition = 0;
    for (let i = 1; i < jsonString.length; i++) {
      const char = jsonString.charAt(i);

      if (!['{', '}', '[', ']'].includes(char)) continue;

      ['{', '['].includes(char) ? count++ : count--;

      if (count === 0) {
        currPosition = i + 1;
      }
    }

    const result = jsonString.substring(0, currPosition) + lastChar;
    return result;
  }

  //#endregion

  // =====================================================================================
  // =====================================================================================
  // =====================================================================================

  async generateBaseOnChat(userId: string) {
    const result = await this.generateFrom({ userId });
    return result;
  }

  async generateBaseOnReference(references: References) {
    const result = await this.generateFrom({ references });
    return result;
  }
}

type References = {
  destination: string;
  startDate: Date;
  endDate: Date;
  styles: string[];
  member: string;
  activities: string[];
};

type Schedule = {
  locationName: string;
  coords: [number, number];
  day: number;
  time: string;
  note: string;
  link: string;
};
type Accommodation = {
  accommodationName: string;
  coords: [number, number];
  description: string;
  link: string;
};
