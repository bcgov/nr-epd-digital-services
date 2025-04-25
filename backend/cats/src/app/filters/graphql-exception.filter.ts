import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

// This filter allows us to actionable authentication erorrs
// istead of messages like "Cannot return null for non-nullable field whatever.data"
@Catch(UnauthorizedException, ForbiddenException)
export class GraphQLAuthExceptionFilter implements ExceptionFilter {
  catch(
    exception: UnauthorizedException | ForbiddenException,
    host: ArgumentsHost,
  ) {
    const gqlHost = GqlArgumentsHost.create(host);
    throw exception;
  }
}
