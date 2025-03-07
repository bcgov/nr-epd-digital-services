import { registerEnumType } from '@nestjs/graphql';

export enum AppParticipantFilter {
  ALL = 'ALL',
  MAIN = 'MAIN',
}

registerEnumType(AppParticipantFilter, {
  name: 'AppParticipantFilter',
});
