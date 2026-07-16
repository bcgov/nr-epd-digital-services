import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceService } from './invoice.service';
import { InvoiceV2 } from '../../entities/invoiceV2.entity';
import { InvoiceItem } from '../../entities/invoiceItem.entity';
import { InvoiceAttachment } from '../../entities/invoiceAttachment.entity';
import { LoggerService } from '../../logger/logger.service';
import { ChesEmailService } from '../email/chesEmail.service';
import { InvoiceStatus } from '../../utilities/enums/invoice/invoiceStatus.enum';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let invoiceRepository: Repository<InvoiceV2>;
  let invoiceItemRepo: Repository<InvoiceItem>;
  let invoiceAttachmentRepo: Repository<InvoiceAttachment>;

  const mockInvoiceRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockInvoiceItemRepo = {
    create: jest.fn((item) => item),
  };

  const mockInvoiceAttachmentRepo = {
    create: jest.fn((att) => att),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(InvoiceV2),
          useValue: mockInvoiceRepository,
        },
        {
          provide: getRepositoryToken(InvoiceItem),
          useValue: mockInvoiceItemRepo,
        },
        {
          provide: getRepositoryToken(InvoiceAttachment),
          useValue: mockInvoiceAttachmentRepo,
        },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: ChesEmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    invoiceRepository = module.get<Repository<InvoiceV2>>(
      getRepositoryToken(InvoiceV2),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    it('should create an invoice with emailTo and emailCc recipients', async () => {
      const user = { givenName: 'TestUser' };
      const createInvoiceDto = {
        applicationId: 1,
        personId: '10',
        subject: 'Test Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        invoiceStatus: InvoiceStatus.DRAFT,
        taxExempt: false,
        pstExempt: false,
        subtotalInCents: 10000,
        gstInCents: 500,
        pstInCents: 700,
        totalInCents: 11200,
        invoiceNotes: '',
        emailTo: [
          {
            email: 'john@example.com',
            personId: 10,
            displayName: 'John Smith',
          },
          {
            email: 'custom@test.com',
            personId: null,
            displayName: 'custom@test.com',
          },
        ],
        emailCc: [
          { email: 'manager@example.com', personId: 5, displayName: 'Manager' },
        ],
        invoiceItems: [
          {
            description: 'Service',
            quantity: 1,
            unitPriceInCents: 10000,
            totalInCents: 10000,
            itemType: 'service',
          },
        ],
      } as any;

      const savedInvoice = {
        id: 1,
        ...createInvoiceDto,
        personId: 10,
        whoCreated: 'TestUser',
        whoUpdated: 'TestUser',
        emailTo: createInvoiceDto.emailTo,
        emailCc: createInvoiceDto.emailCc,
        recipient: null,
      };

      mockInvoiceRepository.create.mockReturnValue(savedInvoice);
      mockInvoiceRepository.save.mockResolvedValue(savedInvoice);

      const result = await service.createInvoice(createInvoiceDto, user);

      expect(mockInvoiceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          emailTo: createInvoiceDto.emailTo,
          emailCc: createInvoiceDto.emailCc,
        }),
      );
      expect(mockInvoiceRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error when no invoice items provided', async () => {
      const user = { givenName: 'TestUser' };
      const createInvoiceDto = {
        applicationId: 1,
        personId: '10',
        subject: 'Test Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        invoiceStatus: InvoiceStatus.DRAFT,
        taxExempt: false,
        pstExempt: false,
        subtotalInCents: 0,
        gstInCents: 0,
        pstInCents: 0,
        totalInCents: 0,
        invoiceNotes: '',
        emailTo: [],
        emailCc: [],
        invoiceItems: [],
      } as any;

      await expect(
        service.createInvoice(createInvoiceDto, user),
      ).rejects.toThrow('At least one invoice item is required.');
    });
  });

  describe('getInvoiceById', () => {
    it('should return invoice with emailTo and emailCc fields', async () => {
      const mockInvoice = {
        id: 1,
        applicationId: 1,
        personId: 10,
        subject: 'Test',
        issuedDate: new Date(),
        dueDate: new Date(),
        invoiceStatus: InvoiceStatus.DRAFT,
        taxExempt: false,
        pstExempt: false,
        subtotalInCents: 10000,
        gstInCents: 500,
        pstInCents: 700,
        totalInCents: 11200,
        invoiceNotes: '',
        emailTo: [
          {
            email: 'john@example.com',
            personId: 10,
            displayName: 'John Smith',
          },
        ],
        emailCc: [
          {
            email: 'cc@example.com',
            personId: null,
            displayName: 'cc@example.com',
          },
        ],
        invoiceItems: [],
        invoiceAttachments: [],
        recipient: {
          id: 10,
          firstName: 'John',
          middleName: null,
          lastName: 'Smith',
          email: 'john@example.com',
        },
      };

      mockInvoiceRepository.findOne.mockResolvedValue(mockInvoice);

      const result = await service.getInvoiceById(1);

      expect(mockInvoiceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [
          'invoiceItems',
          'invoiceAttachments',
          'application',
          'recipient',
        ],
      });
      expect(result).toBeDefined();
    });

    it('should return null for invalid invoice id', async () => {
      const result = await service.getInvoiceById(0);
      expect(result).toBeNull();
    });
  });

  describe('createInvoice with serviceTypeId', () => {
    it('should create an invoice item with serviceTypeId', async () => {
      const user = { givenName: 'TestUser' };
      const createInvoiceDto = {
        applicationId: 1,
        personId: '10',
        subject: 'Test Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        invoiceStatus: InvoiceStatus.DRAFT,
        taxExempt: false,
        pstExempt: false,
        subtotalInCents: 10000,
        gstInCents: 500,
        pstInCents: 700,
        totalInCents: 11200,
        invoiceNotes: '',
        emailTo: [],
        emailCc: [],
        invoiceItems: [
          {
            description: 'Flat Fee Service',
            quantity: 1,
            unitPriceInCents: 50000,
            totalInCents: 50000,
            itemType: 'service',
            serviceTypeId: 5,
          },
        ],
      } as any;

      const savedInvoice = {
        id: 1,
        ...createInvoiceDto,
        personId: 10,
        whoCreated: 'TestUser',
        whoUpdated: 'TestUser',
      };

      mockInvoiceRepository.create.mockReturnValue(savedInvoice);
      mockInvoiceRepository.save.mockResolvedValue(savedInvoice);

      const result = await service.createInvoice(createInvoiceDto, user);

      expect(mockInvoiceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          invoiceItems: expect.arrayContaining([
            expect.objectContaining({ serviceTypeId: 5 }),
          ]),
        }),
      );
      expect(result).toBeDefined();
    });

    it('should create an invoice item with null serviceTypeId', async () => {
      const user = { givenName: 'TestUser' };
      const createInvoiceDto = {
        applicationId: 1,
        personId: '10',
        subject: 'Test Invoice',
        issuedDate: new Date(),
        dueDate: new Date(),
        invoiceStatus: InvoiceStatus.DRAFT,
        taxExempt: false,
        pstExempt: false,
        subtotalInCents: 10000,
        gstInCents: 500,
        pstInCents: 700,
        totalInCents: 11200,
        invoiceNotes: '',
        emailTo: [],
        emailCc: [],
        invoiceItems: [
          {
            description: 'Expense item',
            quantity: 1,
            unitPriceInCents: 2000,
            totalInCents: 2000,
            itemType: 'expense',
            serviceTypeId: null,
          },
        ],
      } as any;

      const savedInvoice = {
        id: 2,
        ...createInvoiceDto,
        personId: 10,
        whoCreated: 'TestUser',
        whoUpdated: 'TestUser',
      };

      mockInvoiceRepository.create.mockReturnValue(savedInvoice);
      mockInvoiceRepository.save.mockResolvedValue(savedInvoice);

      const result = await service.createInvoice(createInvoiceDto, user);

      expect(mockInvoiceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          invoiceItems: expect.arrayContaining([
            expect.objectContaining({ serviceTypeId: null }),
          ]),
        }),
      );
      expect(result).toBeDefined();
    });
  });
});
