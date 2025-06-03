import { Test, TestingModule } from '@nestjs/testing';
import { FormController } from './form.controller';
import { FormService } from '../services/form.service';
import { CatsService } from '../services/cats.service';
import { SubmissionResponse } from '../dto/submissionResponse.dto';

const mockFormService = {
  healthCheck: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  partialUpdate: jest.fn(),
};

const mockCatsService = {
  submitToCats: jest.fn(),
};

describe('FormController', () => {
  let controller: FormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [
        { provide: FormService, useValue: mockFormService },
        { provide: CatsService, useValue: mockCatsService },
      ],
    }).compile();

    controller = module.get<FormController>(FormController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return form count on healthCheck', async () => {
    mockFormService.healthCheck.mockResolvedValue(1);
    const result = await controller.healthCheck();
    expect(result).toBe(1);
  });

  it('should throw error if table not found in healthCheck', async () => {
    mockFormService.healthCheck.mockResolvedValue(0);
    await expect(controller.healthCheck()).rejects.toEqual({
      statusCode: 404,
      message: 'Table not found',
    });
  });

  it('should return a form submission', async () => {
    const mockForm = {
      id: '123',
      formId: 'abc',
      formData: { name: 'John' },
      createdDate: new Date(),
      modifiedDate: new Date(),
    };

    mockFormService.findOne.mockResolvedValue(mockForm);
    const result = await controller.getSubmission('abc', '123');

    expect(result).toBeInstanceOf(SubmissionResponse);
    expect(result._id).toBe('123');
  });

  it('should throw error if form submission not found', async () => {
    mockFormService.findOne.mockResolvedValue(null);
    await expect(controller.getSubmission('abc', 'xyz')).rejects.toEqual({
      statusCode: 404,
      message: 'Form data not found',
    });
  });

  it('should save a form submission and call catsService', async () => {
    const formId = 'abc';
    const formData = { name: 'Jane' };
    const content = { data: formData };
    const savedSubmission = {
      id: '123',
      formId: 'abc',
      formData,
      createdDate: new Date(),
      modifiedDate: new Date(),
    };
    const mockRequest = {
      headers: { origin: 'https://example.com' },
    } as unknown as Request;

    mockFormService.create.mockResolvedValue(savedSubmission);
    const result = await controller.save(formId, content, mockRequest);

    expect(mockFormService.create).toHaveBeenCalledWith(formId, formData);
    expect(mockCatsService.submitToCats).toHaveBeenCalledWith(
      formData,
      savedSubmission.id,
      savedSubmission.formId,
    );
    expect(result).toBeInstanceOf(SubmissionResponse);
  });

  it('should update form submission', async () => {
    const response = { success: true };
    mockFormService.update.mockResolvedValue(response);
    const result = await controller.updateSubmission('abc', '123', { data: { test: true } });
    expect(result).toEqual(response);
  });

  it('should partially update form submission', async () => {
    const response = { patched: true };
    mockFormService.partialUpdate.mockResolvedValue(response);
    const result = await controller.partialUpdateSubmission('abc', '123', { data: { patch: true } });
    expect(result).toEqual(response);
  });
});