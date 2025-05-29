import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { ApplicationServiceTypeSeeder } from './applicationServiceType.seed';
import { PermissionsSeeder } from './permissions.seed';
import { LoggerService } from '../app/logger/logger.service';

export default class GenericSeeder extends Seeder {
  private logger = new LoggerService();
  async run(dataSource: DataSource) {
    const manager = dataSource.createEntityManager();
    const seeders = [
      {
        name: 'ApplicationServiceTypeSeeder',
        execute: () => ApplicationServiceTypeSeeder(manager),
      },
      {
        name: 'PermissionsSeeder',
        execute: () => PermissionsSeeder(manager),
      },
    ];

    for (const seeder of seeders) {
      try {
        this.logger.log(`Running ${seeder.name}...`);
        await seeder.execute();
        this.logger.log(`Completed ${seeder.name}`);
      } catch (error) {
        this.logger.error(`Error in ${seeder.name}:`, error);
      }
    }
    this.logger.log('All seeders finished.');
  }
}
