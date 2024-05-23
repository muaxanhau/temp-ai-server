import { SetMetadata } from '@nestjs/common';

export const NO_ADMIN_ROLE = 'NO_ADMIN_ROLE';
export const NoRoleGuard = () => SetMetadata(NO_ADMIN_ROLE, true);
