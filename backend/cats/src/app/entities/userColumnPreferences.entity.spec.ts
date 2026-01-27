import { UserColumnPreferences } from './userColumnPreferences.entity';
import { ColumnConfigDto } from '../dto/application/columnConfig.dto';

describe('UserColumnPreferences Entity', () => {
  it('should create entity with properties', () => {
    const entity = new UserColumnPreferences();
    entity.userId = 'test-user';
    entity.page = 'applications';
    entity.columnConfig = [{ id: 1, displayName: 'App ID', active: true }];

    expect(entity.userId).toBe('test-user');
    expect(entity.page).toBe('applications');
    expect(entity.columnConfig).toHaveLength(1);
  });
});
