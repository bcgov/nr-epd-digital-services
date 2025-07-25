// import { Test, TestingModule } from '@nestjs/testing';
// import { InvoiceResolver } from './invoice.resolver';
// import { InvoiceService } from '../../services/invoice/invoice.service';
// import { LoggerService } from '../../logger/logger.service';
// import { InvoiceV2 } from '../../entities/invoiceV2.entity';
// import { InvoiceInputDto, InvoiceStatus } from '../../dto/invoice/invoice.dto';

// describe('InvoiceResolver', () => {
//   let resolver: InvoiceResolver;
//   let invoiceService: InvoiceService;
//   let loggerService: LoggerService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         InvoiceResolver,
//         {
//           provide: InvoiceService,
//           useValue: {
//             getInvoicesByApplicationId: jest.fn(),
//             createInvoice: jest.fn(),
//             updateInvoice: jest.fn(),
//             deleteInvoice: jest.fn(),
//             getInvoiceById: jest.fn(),
//           },
//         },
//         {
//           provide: LoggerService,
//           useValue: {
//             log: jest.fn(),
//             error: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     resolver = module.get<InvoiceResolver>(InvoiceResolver);
//     invoiceService = module.get<InvoiceService>(InvoiceService);
//     loggerService = module.get<LoggerService>(LoggerService);
//   });

//   describe('getInvoicesByApplicationId', () => {
//     it('should return invoices when service succeeds', async () => {
//       const mockInvoices: InvoiceV2[] = [
//         {
//           id: 1,
//           application: null,
//           lineItems: [],
//           attachments: [],
//           subject: 'Invoice 1',
//           issuedDate: new Date(),
//           dueDate: new Date(),
//           status: InvoiceStatus.DRAFT,
//           recipient: null,
//           invoiceId: null,
//           taxExempt: false,
//           pstExempt: false,
//           subtotalInCents: 10000,
//           gstInCents: 0,
//           pstInCents: 0,
//           totalInCents: 10000,
//           notes: 'Test notes for invoice 1',
//           createdBy: 'test-user',
//           updatedBy: 'test-user',
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ];
//       jest
//         .spyOn(invoiceService, 'getInvoicesByApplicationId')
//         .mockResolvedValue(mockInvoices);

//       const applicationId = 123;
//       const result = await resolver.getInvoicesByApplicationId(applicationId);

//       expect(invoiceService.getInvoicesByApplicationId).toHaveBeenCalledWith(
//         applicationId,
//       );
//       expect(result.success).toBe(true);
//       expect(result.httpStatusCode).toBe(200);
//       expect(result.invoices).toEqual(
//         mockInvoices.map((invoice) => ({
//           id: invoice.id,
//           subject: invoice.subject,
//           issuedDate: invoice.issuedDate,
//           dueDate: invoice.dueDate,
//           status: invoice.status,
//           totalInCents: invoice.totalInCents,
//           notes: invoice.notes,
//         })),
//       );
//     });

//     it('should handle errors when service fails', async () => {
//       jest
//         .spyOn(invoiceService, 'getInvoicesByApplicationId')
//         .mockRejectedValue(new Error('Service error'));

//       const applicationId = 123;
//       const result = await resolver.getInvoicesByApplicationId(applicationId);

//       expect(invoiceService.getInvoicesByApplicationId).toHaveBeenCalledWith(
//         applicationId,
//       );
//       expect(loggerService.error).toHaveBeenCalled();
//       expect(result.success).toBe(false);
//       expect(result.httpStatusCode).toBe(500);
//       expect(result.message).toBe('An error occurred while fetching invoices.');
//     });
//   });

//   describe('createInvoice', () => {
//     it('should create an invoice successfully', async () => {
//       const mockCreatedInvoice: InvoiceV2 = {
//         id: 1,
//         application: null,
//         lineItems: [],
//         attachments: [],
//         subject: 'New Invoice',
//         issuedDate: new Date(),
//         dueDate: new Date(),
//         status: InvoiceStatus.DRAFT,
//         recipient: null,
//         invoiceId: null,
//         taxExempt: false,
//         pstExempt: false,
//         subtotalInCents: 15000,
//         gstInCents: 750,
//         pstInCents: 300,
//         totalInCents: 16050,
//         notes: 'Test notes for new invoice',
//         createdBy: 'test-user',
//         updatedBy: 'test-user',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       jest
//         .spyOn(invoiceService, 'createInvoice')
//         .mockResolvedValue(mockCreatedInvoice);

//       const invoiceData: InvoiceInputDto = {
//         applicationId: 123,
//         recipientId: 456,
//         invoiceId: null,
//         subject: 'New Invoice',
//         issuedDate: new Date(),
//         dueDate: new Date(),
//         status: InvoiceStatus.DRAFT,
//         taxExempt: false,
//         pstExempt: false,
//         subtotalInCents: 15000,
//         gstInCents: 750,
//         pstInCents: 300,
//         totalInCents: 16050,
//         notes: 'Test notes for new invoice',
//         lineItems: [],
//       };

//       const user = { id: 'test-user' };
//       const result = await resolver.createInvoice(invoiceData, user);

//       expect(invoiceService.createInvoice).toHaveBeenCalledWith(
//         invoiceData,
//         user,
//       );
//       expect(result.success).toBe(true);
//       expect(result.httpStatusCode).toBe(201);
//       expect(result.invoice).toEqual({
//         id: mockCreatedInvoice.id,
//         applicationId: mockCreatedInvoice.application?.id,
//         recipientId: mockCreatedInvoice.recipient?.id,
//         invoiceId: mockCreatedInvoice.invoiceId,
//         subject: mockCreatedInvoice.subject,
//         issuedDate: mockCreatedInvoice.issuedDate,
//         dueDate: mockCreatedInvoice.dueDate,
//         status: mockCreatedInvoice.status,
//         taxExempt: mockCreatedInvoice.taxExempt,
//         pstExempt: mockCreatedInvoice.pstExempt,
//         subtotalInCents: mockCreatedInvoice.subtotalInCents,
//         gstInCents: mockCreatedInvoice.gstInCents,
//         pstInCents: mockCreatedInvoice.pstInCents,
//         totalInCents: mockCreatedInvoice.totalInCents,
//         notes: mockCreatedInvoice.notes,
//         createdAt: mockCreatedInvoice.createdAt,
//         updatedAt: mockCreatedInvoice.updatedAt,
//         createdBy: mockCreatedInvoice.createdBy,
//         updatedBy: mockCreatedInvoice.updatedBy,
//         lineItems: [],
//       });
//     });

//     it('should handle errors when create fails', async () => {
//       jest
//         .spyOn(invoiceService, 'createInvoice')
//         .mockRejectedValue(new Error('Service error'));

//       const invoiceData: InvoiceInputDto = {
//         applicationId: 123,
//         recipientId: 456,
//         invoiceId: null,
//         subject: 'New Invoice',
//         issuedDate: new Date(),
//         dueDate: new Date(),
//         status: InvoiceStatus.DRAFT,
//         taxExempt: false,
//         pstExempt: false,
//         subtotalInCents: 15000,
//         gstInCents: 750,
//         pstInCents: 300,
//         totalInCents: 16050,
//         notes: 'Test notes for new invoice',
//         lineItems: [],
//       };

//       const user = { id: 'test-user' };
//       const result = await resolver.createInvoice(invoiceData, user);

//       expect(invoiceService.createInvoice).toHaveBeenCalledWith(
//         invoiceData,
//         user,
//       );
//       expect(loggerService.error).toHaveBeenCalled();
//       expect(result.success).toBe(false);
//       expect(result.httpStatusCode).toBe(500);
//       expect(result.message).toBe(
//         'An error occurred while updating the invoice.',
//       );
//     });
//   });

//   describe('updateInvoice', () => {
//     it('should update an invoice successfully', async () => {
//       const mockUpdatedInvoice: InvoiceV2 = {
//         id: 1,
//         application: null,
//         lineItems: [],
//         attachments: [],
//         subject: 'Updated Invoice',
//         issuedDate: new Date(),
//         dueDate: new Date(),
//         status: InvoiceStatus.PAID,
//         recipient: null,
//         invoiceId: null,
//         taxExempt: false,
//         pstExempt: false,
//         subtotalInCents: 20000,
//         gstInCents: 1000,
//         pstInCents: 500,
//         totalInCents: 21500,
//         notes: 'Updated notes for the invoice',
//         createdBy: 'test-user',
//         updatedBy: 'test-user',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       jest
//         .spyOn(invoiceService, 'updateInvoice')
//         .mockResolvedValue(mockUpdatedInvoice);

//       const updateData: InvoiceInputDto = {
//         applicationId: null,
//         recipientId: null,
//         invoiceId: null,
//         subject: 'Updated Invoice',
//         issuedDate: new Date(),
//         dueDate: new Date(),
//         status: InvoiceStatus.PAID,
//         taxExempt: false,
//         pstExempt: false,
//         subtotalInCents: 20000,
//         gstInCents: 1000,
//         pstInCents: 500,
//         totalInCents: 21500,
//         notes: 'Updated notes for the invoice',
//         lineItems: [],
//       };

//       const user = { id: 'test-user' };
//       const result = await resolver.updateInvoice(1, updateData, user);

//       expect(invoiceService.updateInvoice).toHaveBeenCalledWith(
//         1,
//         updateData,
//         user,
//       );
//       expect(result.success).toBe(true);
//       expect(result.httpStatusCode).toBe(200);
//       expect(result.invoice).toEqual({
//         id: mockUpdatedInvoice.id,
//         applicationId: mockUpdatedInvoice.application?.id,
//         recipientId: mockUpdatedInvoice.recipient?.id,
//         invoiceId: mockUpdatedInvoice.invoiceId,
//         subject: mockUpdatedInvoice.subject,
//         issuedDate: mockUpdatedInvoice.issuedDate,
//         dueDate: mockUpdatedInvoice.dueDate,
//         status: mockUpdatedInvoice.status,
//         taxExempt: mockUpdatedInvoice.taxExempt,
//         pstExempt: mockUpdatedInvoice.pstExempt,
//         subtotalInCents: mockUpdatedInvoice.subtotalInCents,
//         gstInCents: mockUpdatedInvoice.gstInCents,
//         pstInCents: mockUpdatedInvoice.pstInCents,
//         totalInCents: mockUpdatedInvoice.totalInCents,
//         notes: mockUpdatedInvoice.notes,
//         createdAt: mockUpdatedInvoice.createdAt,
//         updatedAt: mockUpdatedInvoice.updatedAt,
//         createdBy: mockUpdatedInvoice.createdBy,
//         updatedBy: mockUpdatedInvoice.updatedBy,
//         lineItems: [],
//       });
//     });

//     it('should handle errors when update fails', async () => {
//       jest
//         .spyOn(invoiceService, 'updateInvoice')
//         .mockRejectedValue(new Error('Service error'));

//       const updateData: InvoiceInputDto = {
//         applicationId: null,
//         recipientId: null,
//         invoiceId: null,
//         subject: 'Updated Invoice',
//         issuedDate: new Date(),
//         dueDate: new Date(),
//         status: InvoiceStatus.PAID,
//         taxExempt: false,
//         pstExempt: false,
//         subtotalInCents: 20000,
//         gstInCents: 1000,
//         pstInCents: 500,
//         totalInCents: 21500,
//         notes: 'Updated notes for the invoice',
//         lineItems: [],
//       };

//       const user = { id: 'test-user' };
//       const result = await resolver.updateInvoice(1, updateData, user);

//       expect(invoiceService.updateInvoice).toHaveBeenCalledWith(
//         1,
//         updateData,
//         user,
//       );
//       expect(loggerService.error).toHaveBeenCalled();
//       expect(result.success).toBe(false);
//       expect(result.httpStatusCode).toBe(500);
//       expect(result.message).toBe(
//         'An error occurred while updating the invoice.',
//       );
//     });
//   });

//   describe('deleteInvoice', () => {
//     it('should delete an invoice successfully', async () => {
//       jest.spyOn(invoiceService, 'deleteInvoice').mockResolvedValue(undefined);

//       const invoiceId = 1;
//       const result = await resolver.deleteInvoice(invoiceId);

//       expect(invoiceService.deleteInvoice).toHaveBeenCalledWith(invoiceId);
//       expect(result.success).toBe(true);
//       expect(result.httpStatusCode).toBe(200);
//       expect(result.message).toBe('Invoice deleted successfully.');
//     });

//     it('should handle errors when delete fails', async () => {
//       jest
//         .spyOn(invoiceService, 'deleteInvoice')
//         .mockRejectedValue(new Error('Service error'));

//       const invoiceId = 1;
//       const user = { id: 'test-user' };
//       const result = await resolver.deleteInvoice(invoiceId);

//       expect(invoiceService.deleteInvoice).toHaveBeenCalledWith(invoiceId);
//       expect(loggerService.error).toHaveBeenCalled();
//       expect(result.success).toBe(false);
//       expect(result.httpStatusCode).toBe(500);
//       expect(result.message).toBe(
//         'An error occurred while deleting the invoice.',
//       );
//     });
//   });
//   describe('getInvoiceById', () => {
//     it('should return invoice when service succeeds', async () => {
//       const mockInvoice: InvoiceV2 = {
//         id: 1,
//         application: null,
//         lineItems: [],
//         attachments: [],
//         subject: 'Invoice 1',
//         issuedDate: new Date(),
//         dueDate: new Date(),
//         status: InvoiceStatus.DRAFT,
//         recipient: null,
//         invoiceId: null,
//         taxExempt: false,
//         pstExempt: false,
//         subtotalInCents: 10000,
//         gstInCents: 0,
//         pstInCents: 0,
//         totalInCents: 10000,
//         notes: 'Test notes for invoice',
//         createdBy: 'test-user',
//         updatedBy: 'test-user',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       jest
//         .spyOn(invoiceService, 'getInvoiceById')
//         .mockResolvedValue(mockInvoice);

//       const invoiceId = 1;
//       const result = await resolver.getInvoiceById(invoiceId);

//       expect(invoiceService.getInvoiceById).toHaveBeenCalledWith(invoiceId);
//       expect(result.success).toBe(true);
//       expect(result.httpStatusCode).toBe(200);
//       expect(result.invoice).toEqual({
//         id: mockInvoice.id,
//         applicationId: mockInvoice.application?.id,
//         recipientId: mockInvoice.recipient?.id,
//         invoiceId: mockInvoice.invoiceId,
//         subject: mockInvoice.subject,
//         issuedDate: mockInvoice.issuedDate,
//         dueDate: mockInvoice.dueDate,
//         status: mockInvoice.status,
//         taxExempt: mockInvoice.taxExempt,
//         pstExempt: mockInvoice.pstExempt,
//         subtotalInCents: mockInvoice.subtotalInCents,
//         gstInCents: mockInvoice.gstInCents,
//         pstInCents: mockInvoice.pstInCents,
//         notes: mockInvoice.notes,
//         createdAt: mockInvoice.createdAt,
//         updatedAt: mockInvoice.updatedAt,
//         createdBy: mockInvoice.createdBy,
//         updatedBy: mockInvoice.updatedBy,
//         totalInCents: mockInvoice.totalInCents,
//         lineItems: mockInvoice.lineItems.map((lineItem) => ({
//           id: lineItem.id,
//           type: lineItem.type,
//           description: lineItem.description,
//           quantity: lineItem.quantity,
//           unitPriceInCents: lineItem.unitPriceInCents,
//           totalInCents: lineItem.totalInCents,
//           createdAt: lineItem.createdAt,
//           updatedAt: lineItem.updatedAt,
//           createdBy: lineItem.createdBy,
//           updatedBy: lineItem.updatedBy,
//         })),
//       });
//     });

//     it('should handle errors when service fails', async () => {
//       jest
//         .spyOn(invoiceService, 'getInvoiceById')
//         .mockRejectedValue(new Error('Service error'));

//       const invoiceId = 1;
//       const result = await resolver.getInvoiceById(invoiceId);

//       expect(invoiceService.getInvoiceById).toHaveBeenCalledWith(invoiceId);
//       expect(loggerService.error).toHaveBeenCalled();
//       expect(result.success).toBe(false);
//       expect(result.httpStatusCode).toBe(500);
//       expect(result.message).toBe(
//         'An error occurred while fetching the invoice.',
//       );
//     });
//   });
// });
