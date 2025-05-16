import { registerEnumType } from '@nestjs/graphql';

export enum SortBy {
  ID = 'id',
  NAME = 'name',
  ASSIGNMENT = 'assignment',
}

registerEnumType(SortBy, {
  name: 'StaffSortByField',
});


