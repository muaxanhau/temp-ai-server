import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

const unauthorized = (msg?: string) => {
  throw new UnauthorizedException(msg || 'Unauthorized. Please login!');
};
const role = (msg?: string) => {
  throw new ForbiddenException(msg || 'Access Denied');
};
const server = (msg?: string) => {
  throw new InternalServerErrorException(
    msg || 'Something went wrong. Please get back later.',
  );
};
const notFound = (msg?: string) => {
  throw new NotFoundException(msg || 'Not found.');
};
const badRequest = (msg?: string) => {
  throw new BadRequestException(msg || 'Bad request.');
};

export const exceptionUtil = {
  unauthorized,
  role,
  server,
  notFound,
  badRequest,
};
