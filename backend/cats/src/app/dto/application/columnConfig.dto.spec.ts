import { validate } from 'class-validator';
import { ColumnConfigDto } from './columnConfig.dto';

describe('ColumnConfigDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new ColumnConfigDto();
    dto.id = 1;
    dto.displayName = 'Application ID';
    dto.active = true;
    dto.sortOrder = 1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when required fields are missing', async () => {
    const dto = new ColumnConfigDto();

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should pass validation without optional sortOrder', async () => {
    const dto = new ColumnConfigDto();
    dto.id = 1;
    dto.displayName = 'Application ID';
    dto.active = true;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
