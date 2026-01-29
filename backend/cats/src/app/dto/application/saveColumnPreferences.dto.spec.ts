import { validate } from 'class-validator';
import { SaveColumnPreferencesDto } from './saveColumnPreferences.dto';
import { ColumnConfigDto } from './columnConfig.dto';

describe('SaveColumnPreferencesDto', () => {
  it('should pass validation with valid data', async () => {
    const columnConfig = new ColumnConfigDto();
    columnConfig.id = 1;
    columnConfig.displayName = 'Application ID';
    columnConfig.active = true;
    columnConfig.sortOrder = 1;

    const dto = new SaveColumnPreferencesDto();
    dto.page = 'applications';
    dto.columns = [columnConfig];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when required fields are missing', async () => {
    const dto = new SaveColumnPreferencesDto();

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should pass validation with empty columns array', async () => {
    const dto = new SaveColumnPreferencesDto();
    dto.page = 'applications';
    dto.columns = [];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
