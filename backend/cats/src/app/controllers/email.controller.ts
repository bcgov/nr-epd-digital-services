import { Body, Controller, HttpStatus, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Resource} from 'nest-keycloak-connect';
import { LoggerService } from '../logger/logger.service';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { InvoiceEmail } from '../dto/invoice/invoiceEmail/invoiceEmail.dto';
import { InvoiceService } from '../services/invoice/invoice.service';

@Controller('cats')
@Resource('cats-service')
export class EmailController {
    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly loggerService: LoggerService,
    ) {}

    @Post('/sendEmail')
    @UseInterceptors(FileInterceptor('file'))
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
    }))
    async sendEmail( @UploadedFile() file: Express.Multer.File, @Body() invoiceEmail: InvoiceEmail) {
        try {
            let attachments = null;
            this.loggerService.log('Email controller: sendEmail() start');
            this.loggerService.log('Email controller: sendEmail() generateInvoicePdf start');
            if (file) {
                // Handle the uploaded file directly
                this.loggerService.log('Email controller: using uploaded file as attachment');
                attachments =[ 
                    {
                        filename: `Invoice-${invoiceEmail.invoiceId}.pdf`,
                        content: file.buffer.toString('base64'),
                        encoding: 'base64',
                    }
                ];
            }
            this.loggerService.log('Email controller: sendEmail() generateInvoicePdf end');
            
            if(!attachments) {
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
        }
    }
}
