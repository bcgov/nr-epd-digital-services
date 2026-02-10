import { Body, Controller, HttpStatus, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Resource } from 'nest-keycloak-connect';
import { LoggerService } from '../logger/logger.service';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { InvoiceEmail } from '../dto/invoice/invoiceEmail/invoiceEmail.dto';
import { InvoiceService } from '../services/invoice/invoice.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('cats')
@ApiBearerAuth('JWT-auth')
@Controller('cats')
@Resource('cats-service')
export class EmailController {
    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly loggerService: LoggerService,
    ) { }

    @Post('/sendEmail')
    @UseInterceptors(FileInterceptor('file'))
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
    }))
    @ApiOperation({
        summary: 'Send invoice email',
        description: 'Sends an invoice email with optional PDF attachment. The PDF can be uploaded as a file.'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Optional PDF file attachment for the invoice',
                },
                invoiceId: {
                    type: 'number',
                    description: 'The ID of the invoice',
                    example: 12345,
                },
                to: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of recipient email addresses',
                    example: ['recipient@example.com'],
                },
                subject: {
                    type: 'string',
                    description: 'Email subject',
                    example: 'Invoice #12345',
                },
                body: {
                    type: 'string',
                    description: 'Email body content',
                    example: 'Please find attached your invoice.',
                },
            },
            required: ['invoiceId', 'to', 'subject', 'body'],
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Email sent successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Email sent successfully with attachments' },
                statusCode: { type: 'number', example: 200 },
                success: { type: 'boolean', example: true }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Failed to send email',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Failed to send email' },
                statusCode: { type: 'number', example: 500 },
                success: { type: 'boolean', example: false }
            }
        }
    })
    async sendEmail(@UploadedFile() file: Express.Multer.File, @Body() invoiceEmail: InvoiceEmail) {
        try {
            let attachments = null;
            this.loggerService.log('Email controller: sendEmail() start');
            this.loggerService.log('Email controller: sendEmail() generateInvoicePdf start');
            if (file) {
                // Handle the uploaded file directly
                this.loggerService.log('Email controller: using uploaded file as attachment');
                attachments = [
                    {
                        filename: `Invoice-${invoiceEmail.invoiceId}.pdf`,
                        content: file.buffer.toString('base64'),
                        encoding: 'base64',
                    }
                ];
            }
            this.loggerService.log('Email controller: sendEmail() generateInvoicePdf end');

            if (!attachments) {
                this.loggerService.log('Email controller: sendEmail() chesEmailService.sendEmail() no attachments start');
                await this.invoiceService.sendInvoice(invoiceEmail);
                this.loggerService.log('Email controller: sendEmail() chesEmailService.sendEmail() no attachments end');
                this.loggerService.log('Email controller: sendEmail() end');
                return {
                    message: 'Email sent successfully without attachments',
                    statusCode: HttpStatus.OK,
                    success: true
                };
            }
            else {
                this.loggerService.log('Email controller: sendEmail() chesEmailService.sendEmail() with attachments start');
                await this.invoiceService.sendInvoice(invoiceEmail, attachments);
                this.loggerService.log('Email controller: sendEmail() chesEmailService.sendEmail() with attachments end');
                this.loggerService.log('Email controller: sendEmail() end');
                return {
                    message: 'Email sent successfully with attachments',
                    statusCode: HttpStatus.OK,
                    success: true
                };
            }
        }
        catch (error) {
            this.loggerService.error('Email controller: sendEmail() error', error);
            return {
                message: 'Failed to send email',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false
            }
        }
    }
}
