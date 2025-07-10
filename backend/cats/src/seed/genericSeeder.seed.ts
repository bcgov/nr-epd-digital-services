import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { ApplicationServiceTypeSeeder } from './applicationServiceType.seed';
import { PermissionsSeeder } from './permissions.seed';

export default class GenericSeeder extends Seeder {
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
        await seeder.execute();
      } catch (error) {
        console.error(`Error executing ${seeder.name}:`, error);
      }
    }
  }
}
