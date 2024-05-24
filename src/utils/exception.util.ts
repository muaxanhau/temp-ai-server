import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

const unauthorized = () => {
  throw new UnauthorizedException('Unauthorized. Please login!');
};
const role = () => {
  throw new ForbiddenException('Access Denied');
};
const server = () => {
  throw new InternalServerErrorException(
    'Something went wrong. Please get back later.',
  );
};
const notFound = () => {
  throw new NotFoundException('Not found.');
};
const badRequest = () => {
  throw new BadRequestException('Bad request.');
};

export const exceptionUtil = {
  unauthorized,
  role,
  server,
  notFound,
  badRequest,
};
