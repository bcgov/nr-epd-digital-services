import { registerEnumType } from '@nestjs/graphql';

export enum SortByDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortByDirection, {
  name: 'ApplicationSortByDirection',
});
