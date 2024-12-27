import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse();
      if (typeof responseObj === 'string') {
        errorMessage = responseObj;
      } else if (
        typeof responseObj === 'object' &&
        responseObj.hasOwnProperty('message')
      ) {
        if (Array.isArray(responseObj['message'])) {
          //   errorMessage = responseObj['message'][0];
          errorMessage = this.formatValidationErrors(responseObj['message'][0]);
        } else {
          errorMessage = responseObj['message'];
        }
      }
    } else if ((exception as any).name === 'CastError') {
      status = HttpStatus.BAD_REQUEST;
      errorMessage = 'Invalid ID format';
    } else if ((exception as any).name === 'BSONError') {
      status = HttpStatus.BAD_REQUEST;
      errorMessage = 'Invalid ID format';
    } else if (exception instanceof TypeError) {
      status = HttpStatus.BAD_REQUEST;
      errorMessage = exception.message;
    } else if (exception && typeof exception['message'] === 'string') {
      errorMessage = exception['message'];
    }

    response.status(status).json({
      message: errorMessage,
      statusCode: status,
    });
  }

  private formatValidationErrors(error: string) {
    const formattedMessages = error.split('.').pop();
    return formattedMessages;
  }
}
