import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FormService } from './form.service';
import { Form } from '../entities/form.entity';

describe('Form Service', () => {
  let service: FormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Form),
          useValue: {
            update: jest.fn(() => {
              return Promise.resolve({ affected: 1 });
            }),
            findOne: jest.fn(() => {
              return Promise.resolve({
                id: 'f06eea74-9a02-453d-9239-4257143afaaf',
                data: '{name:"test"}',
                formId: 'f06eea74-9a02-453d-9239-4257143afaaf',
                createdDate: '16-02-2023',
                modifiedDate: '16-02-2023',
              });
            }),
            save: jest.fn(() => {
              return Promise.resolve({
                id: 'f06eea74-9a02-453d-9239-4257143afaaf',
                data: '{name:"test"}',
                formId: 'f06eea74-9a02-453d-9239-4257143afaaf',
                createdDate: '16-02-2023',
                modifiedDate: '16-02-2023',
              });
            }),
          },
        },
        FormService,
      ],
    }).compile();

    service = module.get<FormService>(FormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create return success', async () => {
    const response = await service.create(
      'f06eea74-9a02-453d-9239-4257143afaaf',
      '',
    );

    expect(response.id).toBe('f06eea74-9a02-453d-9239-4257143afaaf');
  });

  it('update return success', async () => {
    const response = await service.update(
      'f06eea74-9a02-453d-9239-4257143afaaf',
      'f06eea74-9a02-453d-9239-4257143afaaf',
      '',
    );

    expect(response.affected).toBe(1);
  });

  it('get return success', async () => {
    const response = await service.findOne(
      'f06eea74-9a02-453d-9239-4257143afaaf',
      'f06eea74-9a02-453d-9239-4257143afaaf',
    );

    expect(response.id).toBe('f06eea74-9a02-453d-9239-4257143afaaf');
  });
});
