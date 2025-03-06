import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { CustomExceptionFilter } from './customExceptionFilters';
import { GenericResponse } from '../dto/reponse/genericResponse';

describe('CustomExceptionFilter', () => {
  let customExceptionFilter: CustomExceptionFilter;

  beforeEach(() => {
    customExceptionFilter = new CustomExceptionFilter();
  });

  it('should format HttpException correctly', () => {
    const exception = new HttpException('User not found', HttpStatus.NOT_FOUND);
    const response = customExceptionFilter.catch(exception);

    expect(response).toBeInstanceOf(GenericResponse);
    expect(response.message).toBe('User not found');
    expect(response.httpStatusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
  });

  it('should format generic error correctly', () => {
    const exception = new Error('Generic error');

    const host = {
      switchToHttp: jest.fn(),
      getType: jest.fn().mockReturnValue('graphql'),
      getArgs: jest.fn().mockReturnValue([]),
    } as unknown as ArgumentsHost;

    const response = customExceptionFilter.catch(exception as any);

    expect(response).toBeInstanceOf(GenericResponse);
    expect(response.message).toBe('Internal server error');
    expect(response.httpStatusCode).toBe(500);
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
  });

  it('should handle custom error response structure', () => {
    const customErrorResponse = {
      message: 'Custom error message',
      code: 'CUSTOM_ERROR_CODE',
    };
    const exception = new HttpException(
      customErrorResponse,
      HttpStatus.BAD_REQUEST,
    );

    const host = {
      switchToHttp: jest.fn(),
      getType: jest.fn().mockReturnValue('graphql'),
      getArgs: jest.fn().mockReturnValue([]),
    } as unknown as ArgumentsHost;

    const response = customExceptionFilter.catch(exception);

    expect(response).toBeInstanceOf(GenericResponse);
    expect(response.message).toBe('Custom error message');
    expect(response.httpStatusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(response.success).toBe(false);
    expect(response.data).toBeNull();
  });
});
