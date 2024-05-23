import { SetMetadata } from '@nestjs/common';

export const NO_AUTH = 'NO_AUTH';
export const NoAuthGuard = () => SetMetadata(NO_AUTH, true);
