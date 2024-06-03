import { Injectable } from '@nestjs/common';
import {
  accommodationsCollection,
  chatsCollection,
  itinerariesCollection,
  locationsCollection,
} from './firebase';
import { Timestamp } from 'firebase-admin/firestore';
import {
  AccommodationModel,
  AITypeEnum,
  ChatIdModel,
  ChatModel,
  ChatRole,
  FirestoreBaseModel,
  LocationModel,
} from 'src/models';
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
      day: number;
      locations: {
        locationName: string;
        coords: [number, number];
        time: string;
        note: string;
      }[];
    }[];
    With the 'day' field representing which day of the trip this is;
    'locationName' represents the name of the place to visit;
    'coords' represents the specific coordinates of the place to visit;
    'note' is a suggestion, advice on what to do, what to see at that location, please provide as detailed and specific advice as possible;
    'time' is the time point when visiting that tourist location (dawn, morning, afternoon, evening, night...).
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
    }[] 
    With the 'accommodationName' field representing name of the accommodation;
    'coords' represents the specific coordinates;
    'description' represents the detail.
    Only output the data in JSON format, do not add any other content.`;
    const response = await this.withBare(prompt, []);

    return response;
  }
  private async generateRawFrom({
    userId,
    references,
  }: {
    userId?: string;
    references?: References;
  }) {
    const responseSchedule = await (userId
      ? this.promptScheduleBaseOnChat(userId)
      : references
        ? this.promptScheduleBaseOnPreference(references)
        : '');

    console.log(JSON.stringify(responseSchedule));

    const scheduleArr = utils.stringToObjectJson<Schedule>(
      responseSchedule,
      [],
    );

    const locationNameArr = scheduleArr.reduce<string[]>((prev, curr) => {
      const allLocationNameByDay = curr.locations.map(
        (location) => location.locationName,
      );
      prev.push(...allLocationNameByDay);
      return prev;
    }, []);
    const listLocationsString = JSON.stringify(locationNameArr);
    const responseAccommodation =
      await this.promptAccommodation(listLocationsString);
    const accommodationArr = utils.stringToObjectJson<Accommodation[]>(
      responseAccommodation,
      [],
    );

    return {
      schedule: scheduleArr,
      accommodations: accommodationArr,
    };
  }

  private async storeItinerary(
    schedule: Schedule,
    accommodations: Accommodation[],
  ) {
    const { id: itineraryId } = await itinerariesCollection.add({
      createdAt: Timestamp.fromDate(new Date()),
      userId: '',
    });
    await Promise.all([
      Promise.all(
        schedule.map(({ day, locations }) =>
          Promise.all(
            locations.map((location) =>
              locationsCollection.add({
                itineraryId,
                day,
                ...location,
              }),
            ),
          ),
        ),
      ),
      Promise.all(
        accommodations.map((accommodation) =>
          accommodationsCollection.add({
            itineraryId,
            ...accommodation,
          }),
        ),
      ),
    ]);

    return itineraryId;
  }
  private groupByDayItinerary(locations: FirestoreBaseModel<LocationModel>[]) {
    const groupedByDay = locations.reduce<{
      [day: number]: ({ id: string } & Location)[];
    }>((acc, current) => {
      if (!acc[current.day]) {
        acc[current.day] = [];
      }
      const { day, itineraryId, ...location } = current;
      acc[current.day].push(location);
      return acc;
    }, {});
    const result = Object.entries(groupedByDay).map(([day, locations]) => ({
      day: Number(day),
      locations: locations,
    }));

    return result;
  }

  //#endregion

  // =====================================================================================
  // =====================================================================================
  // =====================================================================================

  async generateBaseOnChat(userId: string) {
    const { schedule, accommodations } = await this.generateRawFrom({ userId });
    const id = await this.storeItinerary(schedule, accommodations);
    const itinerary = await this.getItinerary(id);

    return itinerary;
  }

  async generateBaseOnReference(references: References) {
    const { schedule, accommodations } = await this.generateRawFrom({
      references,
    });
    const id = await this.storeItinerary(schedule, accommodations);
    const itinerary = await this.getItinerary(id);

    return itinerary;
  }

  async getItinerary(itineraryId: string) {
    const itinerary = await itinerariesCollection.get(itineraryId);
    const rawLocations = await locationsCollection.getBy({ itineraryId });
    const schedule = this.groupByDayItinerary(rawLocations);

    const rawAccommodations = await accommodationsCollection.getBy({
      itineraryId,
    });
    const accommodations = rawAccommodations.map(
      ({ itineraryId, ...accommodation }) => accommodation,
    );
    itinerary?.createdAt;
    return {
      itineraryId: itinerary?.id || '',
      createdAt: itinerary?.createdAt.toDate() || '',
      schedule,
      accommodations,
    };
  }
  async getItineraryByUserId(userId: string) {
    const itineraries = await itinerariesCollection.getBy({ userId });
    const result = await Promise.all(
      itineraries.map(({ id }) => this.getItinerary(id)),
    );
    return result;
  }

  async storeItineraryWithUserId(userId: string, itineraryId: string) {
    const itinerary = await itinerariesCollection.edit(itineraryId, { userId });
    return {
      id: itinerary?.id || '',
      userId: itinerary?.userId || '',
      createdAt: itinerary?.createdAt.toDate() || '',
    };
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

type Location = Omit<LocationModel, 'itineraryId' | 'day'>;
type Accommodation = Omit<AccommodationModel, 'itineraryId'>;
type Schedule = {
  day: number;
  locations: Location[];
}[];
