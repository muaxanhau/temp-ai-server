import { Controller, Get, Post, Headers, Req, Query } from '@nestjs/common';
import { NoAuthGuard, NoRoleGuard } from 'src/decorators';
import { HeadersBaseModel } from 'src/models';
import { gemini, PushNotificationService, UsersService } from 'src/services';
import { exceptionUtil, utils } from 'src/utils';
import { SearchPlaceQueryModel } from './models';

@Controller('/search')
export class SearchController {
  constructor() {}

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

  @NoAuthGuard()
  @Get('/places')
  async searchPlace(@Query() query: SearchPlaceQueryModel) {
    const { value } = query;

    const prompt = `
    Find places in the world for travel that start with the characters: ${value}.
    Create data based on the format below: 
    string[]
    Only output the data in JSON format, maximum is 10 places.`;
    const result = await gemini.base.generateContent(prompt);
    const text = result.response.text();
    const places = this.stringToObjectJson<string[]>(text, []);

    /**
     * $0.35 / 1 million tokens => 1 token = 0.00000035
     * $1.05 / 1 million tokens => 1 token = 0.00000105
     * 0.000115/request
     * => 100000 = 11.5 USD
     *
     *
     * autocomplete 100000 = 2.4 USD
     * search 100000 = 14.5 USD
     */
    const token1 = await gemini.base.countTokens(prompt);
    const token2 = await gemini.base.countTokens(text);
    console.log(
      `${token1.totalTokens} tokens + ${token2.totalTokens} tokens = ${token1.totalTokens * 0.00000035 + token2.totalTokens * 0.00000105} USD`,
    );
    return places;
  }
}
