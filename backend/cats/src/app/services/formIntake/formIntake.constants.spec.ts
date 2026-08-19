import { ConfigService } from '@nestjs/config';
import { getAppTypeAbbrevByChefsFormId } from './formIntake.constants';

describe('getAppTypeAbbrevByChefsFormId', () => {
  const mockConfigService = {
    get: jest.fn(),
  } as unknown as ConfigService;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the appTypeAbbrev when the formId matches a registered form', () => {
    (mockConfigService.get as jest.Mock).mockImplementation((key: string) =>
      key === 'CSSA_FORM_ID' ? 'form-id-123' : undefined,
    );

    expect(
      getAppTypeAbbrevByChefsFormId(mockConfigService, 'form-id-123'),
    ).toBe('CSR');
  });

  it('returns null when the formId does not match any registered form', () => {
    (mockConfigService.get as jest.Mock).mockReturnValue('form-id-123');

    expect(
      getAppTypeAbbrevByChefsFormId(mockConfigService, 'unknown-form-id'),
    ).toBeNull();
  });
});
