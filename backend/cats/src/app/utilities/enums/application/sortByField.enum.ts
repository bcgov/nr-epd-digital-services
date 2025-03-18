import { registerEnumType } from '@nestjs/graphql';

export enum SortByField {
  ID = 'id',
  SITE_ID = 'siteId',
  SITE_ADDRESS = 'siteAddress',
  APPLICATION_TYPE = 'applicationType',
  LAST_UPDATED = 'lastUpdated',
  STATUS = 'status',
  PRIORITY = 'priority',
}

registerEnumType(SortByField, {
  name: 'ApplicationSortByField',
});
