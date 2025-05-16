import { registerEnumType } from '@nestjs/graphql';

export enum Filter {
  ALL = 'all',
  UNASSIGNED = 'unassigned',
  COMPLETED = 'completed',
  OVERCAPACITY = 'overcapacity',
}

registerEnumType(Filter, {
  name: 'Filter',
});
