import { EntityManager } from 'typeorm';
import { ApplicationServiceType } from '../app/entities/applicationServiceType.entity';
import { ParticipantRole } from '../app/entities/participantRole.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceTypeJSON = require('./applicationServiceType.json');

export const ApplicationServiceTypeSeeder = async (manager: EntityManager) => {
  try{
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

      // await manager.update(
      //   ParticipantRole,
      //   { abbrev: 'CSWKR' },
      //   { assignmentFactor: 2, roleType: 'STAFF' },
      // );
      
      // await manager.update(
      //   ParticipantRole,
      //   { abbrev: 'SDM' },
      //   { assignmentFactor: 1, roleType: 'STAFF' },
      // );

      // const mentorResult = await manager.findOne(ParticipantRole, {
      //   where: { abbrev: 'MENTOR' },
      // });

      // if (!mentorResult) {
      //   const participantRole = new ParticipantRole();
      //   participantRole.abbrev = 'MENTOR';
      //   participantRole.description = 'Mentor';
      //   participantRole.assignmentFactor = 1;
      //   participantRole.isMinistry = true;
      //   participantRole.isActive = true;
      //   participantRole.displayOrder = 7;
      //   participantRole.rowVersionCount = 0;
      //   participantRole.createdBy = 'sysadmin';
      //   participantRole.createdDateTime = new Date();
      //   participantRole.updatedBy = 'sysadmin';
      //   participantRole.updatedDateTime = new Date();
      //   participantRole.ts = Buffer.from('');
      //   participantRole.roleType = 'STAFF';
      //   await manager.save(participantRole);
      // }
      // else
      // {
      //   await manager.update(
      //     ParticipantRole,
      //     { abbrev: 'MENTOR' },
      //     { assignmentFactor: 1, roleType: 'STAFF' },
      //   );
      // }
    } catch (error) {
      console.log('ApplicationServiceTypeSeeder', error);
    }
};
