import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const gqlHost = host.switchToHttp();
        const response = exception.getResponse();

        // Extract validation errors
        if (typeof response === 'object' && 'message' in response) {
            const messages = Array.isArray(response.message) ? response.message : [response.message];

            throw new GraphQLError(messages.join(', '), {
                extensions: { code: 'BAD_USER_INPUT', status: 400 },
            });
        }

        throw new GraphQLError('Invalid request', {
            extensions: { code: 'BAD_USER_INPUT', status: 400 },
        });
    }
}
