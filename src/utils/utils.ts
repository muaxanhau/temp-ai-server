import { config } from 'src/config';

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

const getBaseUrl = (request: Request) => {
  const host = request.headers['host'] as string;
  let baseUrl = `${host}${config.prefix}`;
  if (!baseUrl.includes('http')) {
    baseUrl = `http://${baseUrl}`;
  }
  return baseUrl;
};

const countChar = (str: string, char: string) => {
  return str
    .split('')
    .reduce((count, c) => (c === char ? count + 1 : count), 0);
};

const mergeUniqueArrays = <T>(...arrays: T[][]): T[] => {
  const mergedArray = arrays.flat();
  const mergedSet = new Set<T>(mergedArray);
  return Array.from(mergedSet);
};

const isCompletedJson = (jsonString: string) => {
  const result =
    utils.countChar(jsonString, '{') === utils.countChar(jsonString, '}') &&
    utils.countChar(jsonString, '[') === utils.countChar(jsonString, ']');
  return result;
};
const stringToObjectJson = <T>(rawStr: string, defaultValue: T) => {
  const str = rawStr
    .replaceAll(/json/gi, '')
    .replaceAll('`', '')
    .replaceAll('\n', '')
    .replaceAll('\t', '')
    .replace(/\s{2,}/g, '')
    .trim();

  const isCompletedJsonString = isCompletedJson(str);
  const completedJsonString = isCompletedJsonString
    ? str
    : cutUncompletedJsonString(str);

  let object: T = defaultValue;
  try {
    object = new Function('return ' + completedJsonString)() as T;
  } catch (e) {
    console.log(e);
  }

  return object;
};
const cutUncompletedJsonString = (jsonString: string) => {
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
};

export const utils = {
  getBaseUrl,
  countChar,
  mergeUniqueArrays,
  stringToObjectJson,
};

export type { Prettify };
