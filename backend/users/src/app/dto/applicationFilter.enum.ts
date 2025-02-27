import { registerEnumType } from '@nestjs/graphql';

export enum ApplicationFilter {
  ALL = 'all',
  UNASSIGNED = 'unassigned',
  COMPLETED = 'completed',
}

registerEnumType(ApplicationFilter, {
  name: 'ApplicationFilter',
});
