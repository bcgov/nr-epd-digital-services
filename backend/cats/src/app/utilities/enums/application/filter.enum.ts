import { registerEnumType } from '@nestjs/graphql';

export enum Filter {
  ALL = 'all',
  UNASSIGNED = 'unassigned',
  COMPLETED = 'completed',
}

registerEnumType(Filter, {
  name: 'ApplicationFilter',
});
