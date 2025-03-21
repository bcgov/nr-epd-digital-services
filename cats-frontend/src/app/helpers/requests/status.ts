export enum RequestStatus {
  loading = 'loading',
  idle = 'idle',
  success = 'success',
  failed = 'failed',
  pending = 'pending',
}

export enum ResponseCode {
  created = 201,
  success = 200,
  badRequest = 422,
  error = 500,
}
