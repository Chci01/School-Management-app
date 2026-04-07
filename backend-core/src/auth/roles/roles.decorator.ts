import { SetMetadata } from '@nestjs/common';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN_ECOLE = 'ADMIN_ECOLE',
  ENSEIGNANT = 'ENSEIGNANT',
  ELEVE = 'ELEVE',
  PARENT = 'PARENT',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
