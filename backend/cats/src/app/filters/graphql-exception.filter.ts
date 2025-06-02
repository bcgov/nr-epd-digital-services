import {
  Catch,
  ExceptionFilter,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';

// This filter allows us to actionable authentication erorrs
// istead of messages like "Cannot return null for non-nullable field whatever.data"
@Catch(UnauthorizedException, ForbiddenException)
export class GraphQLAuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException | ForbiddenException) {
    const errorResponse = {
      message: exception.message,
      extensions: {
        code:
          exception instanceof UnauthorizedException
            ? 'UNAUTHORIZED'
            : 'FORBIDDEN',
        exception: {
          name: exception.name,
          stacktrace: exception.stack,
        },
      },
    };
    throw new GraphQLError(errorResponse.message, {
      extensions: {
        ...errorResponse.extensions,
        exception: {
          ...errorResponse.extensions.exception,
          stacktrace: exception.stack ? exception.stack.split('\n') : [],
        },
      },
    });
  }
}
