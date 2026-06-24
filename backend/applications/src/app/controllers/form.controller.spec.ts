import { Test, TestingModule } from '@nestjs/testing';
import { FormController } from './form.controller';
import { FormService } from '../services/form.service';
import { CatsService } from '../services/cats.service';
import { IntakeService } from '../services/intake.service';
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
  updateCatsApplication: jest.fn(),
};

const mockIntakeService = {
  submitToIntake: jest.fn(),
  transformResult: jest.fn((saved) => {
    const r = new SubmissionResponse();
    r._id = saved.id;
    r.form = saved.formId;
    r.data = saved.formData;
    r.created = saved.createdDate;
    r.modified = saved.modifiedDate;
    return r;
  }),
};

describe('FormController', () => {
  let controller: FormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [
        { provide: FormService, useValue: mockFormService },
        { provide: CatsService, useValue: mockCatsService },
        { provide: IntakeService, useValue: mockIntakeService },
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

  it('should save a form submission via intake service', async () => {
    const formId = 'abc';
    const formData = { name: 'Jane' };
    const content = { data: formData };
    const submissionResponse = new SubmissionResponse();
    submissionResponse._id = '123';
    submissionResponse.form = formId;

    mockIntakeService.submitToIntake.mockResolvedValue({
      submission: submissionResponse,
      catsApplicationId: 1,
      catsIntegrated: true,
      message: 'ok',
    });

    const result = await controller.save(formId, content);

    expect(mockIntakeService.submitToIntake).toHaveBeenCalledWith(formId, formData);
    expect(result).toBe(submissionResponse);
  });

  it('should update form submission', async () => {
    const response = { success: true };

    const mockRequest = {
      headers: { origin: 'https://example.com' },
    } as unknown as Request;

    mockFormService.update.mockResolvedValue(response);
    const result = await controller.updateSubmission('abc', '123', { data: { test: true } }, mockRequest);
    expect(result).toEqual(response);
  });

  it('should call catsService.updateCatsApplication when partially updating', async () => {
    process.env.CATS_INTEGRATION_ENABLED = 'true';
    const response = { patched: true };
    const formId = 'abc';
    const submissionId = '123';
    const patchData = { patch: true };

    mockFormService.partialUpdate.mockResolvedValue(response);
    mockCatsService.updateCatsApplication = jest.fn().mockResolvedValue(undefined); // Add this method

    const mockRequest = {
      headers: { origin: 'https://example.com' },
    };

    const result = await controller.partialUpdateSubmission(
      formId,
      submissionId,
      { data: patchData },
      mockRequest,
    );

    expect(mockFormService.partialUpdate).toHaveBeenCalledWith(submissionId, formId, patchData);
    expect(mockCatsService.updateCatsApplication).toHaveBeenCalledWith(submissionId, formId, patchData);
    expect(result).toEqual(response);
  });
});