import { registerEnumType } from '@nestjs/graphql';

export enum SortBy {
  ID = 'id',
  NAME = 'name',
  ASSIGNMENT = 'assignment',
  SITE_ADDRESS = 'siteAddress',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  ROLE = 'role',
}

registerEnumType(SortBy, {
  name: 'StaffSortByField',
});
