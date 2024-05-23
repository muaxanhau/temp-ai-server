import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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

export const exceptionUtils = {
  unauthorized,
  role,
  server,
  notFound,
};
