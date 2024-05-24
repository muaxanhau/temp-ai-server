import * as dayjs from 'dayjs';

const defaultFormatter = {
  day: 'DD-MM-YYYY',
  time: 'HH:mm:ss',
  dayTime: 'DD-MM-YYYY HH:mm:ss',
};

type DataType = Date | string | number;

const now = () => new Date(Date.now());

/**
 * convert Date to string with formatter
 * @param date Date
 * @param formatter Ex: 'DD-MM-YYYY'
 * @returns date string
 */
const getDay = (date: DataType, formatter = defaultFormatter.day) =>
  dayjs(date).format(formatter);

/**
 * convert Date to string with formatter
 * @param date Date
 * @param formatter Ex: 'HH:mm:ss'
 * @returns time string
 */
const getTime = (date: DataType, formatter = defaultFormatter.time) =>
  dayjs(date).format(formatter);

/**
 * convert Date to string with formatter
 * @param date Date
 * @param formatter Ex: 'DD-MM-YYYY HH:mm:ss'
 * @returns day with time string
 */
const getDayTime = (date: DataType, formatter = defaultFormatter.dayTime) =>
  dayjs(date).format(formatter);

const calculateDaysDifference = (
  date1: Date | string,
  date2: Date | string,
) => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);

  const differenceInDays = d2.diff(d1, 'day');
  return differenceInDays;
};

export const dateUtil = {
  now,
  getDay,
  getTime,
  getDayTime,
  calculateDaysDifference,
};
