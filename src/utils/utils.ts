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

export const utils = {
  getBaseUrl,
  countChar,
  mergeUniqueArrays,
};

export type { Prettify };
