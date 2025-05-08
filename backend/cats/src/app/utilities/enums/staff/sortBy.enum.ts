import { registerEnumType } from '@nestjs/graphql';

export enum SortBy {
  ID = 'id',
  NAME = 'name',
  ROLE = 'role',
  Assignment = 'applicationType',
}

registerEnumType(SortBy, {
  name: 'StaffSortByField',
});


