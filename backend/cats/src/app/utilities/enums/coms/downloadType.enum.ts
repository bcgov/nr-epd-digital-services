import { registerEnumType } from '@nestjs/graphql';

export enum DownloadType {
  URL = 'url',
  PROXY = 'proxy',
}

registerEnumType(DownloadType, {
  name: 'DownloadType',
});
