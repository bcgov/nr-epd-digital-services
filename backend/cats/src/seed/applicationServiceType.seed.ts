import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { ApplicationServiceType } from '../app/entities/applicationServiceType.entity';
import { ParticipantRole } from '../app/entities/participantRole.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceTypeJSON = require('./applicationServiceType.json');

export default class ApplicationServiceTypeSeeder extends Seeder {
  async run(dataSource: DataSource) {
    try {
      const manager = dataSource.createEntityManager();

      for (const item of serviceTypeJSON) {
        const existing = await manager.findOne(ApplicationServiceType, {
          where: {
            serviceName: item.description,
            serviceType: item.type,
          },
        });

        if (!existing) {
          const serviceType = new ApplicationServiceType();
          serviceType.serviceName = item.description;
          serviceType.serviceType = item.type;
          serviceType.assignmentFactor = item.value;
          await manager.save(serviceType);
        }
      }

      await manager.update(
        ParticipantRole,
        { abbrev: 'CSWKR' },
        { assignmentFactor: 2 },
      );
      await manager.update(
        ParticipantRole,
        { abbrev: 'SDM' },
        { assignmentFactor: 1 },
      );
    } catch (error) {
      console.log('ApplicationServiceTypeSeeder', error);
    }
  }
}
