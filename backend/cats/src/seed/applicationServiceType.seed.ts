import { EntityManager } from 'typeorm';
import { ApplicationServiceType } from '../app/entities/applicationServiceType.entity';
import { ParticipantRole } from '../app/entities/participantRole.entity';
import { ApplicationServiceTypeAssignmentFactor } from '../app/entities/applicationServiceTypeAssignmentFactor';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceTypeJSON = require('./applicationServiceType.json');

export const ApplicationServiceTypeSeeder = async (manager: EntityManager) => {
  try{

      const mentorResult = await manager.findOne(ParticipantRole, {
        where: { abbrev: 'MENTOR' },
      });

      if (!mentorResult) {
        const participantRole = new ParticipantRole();
        participantRole.abbrev = 'MENTOR';
        participantRole.description = 'Mentor';
        participantRole.assignmentFactor = 1;
        participantRole.isMinistry = true;
        participantRole.isActive = true;
        participantRole.displayOrder = 7;
        participantRole.rowVersionCount = 0;
        participantRole.createdBy = 'sysadmin';
        participantRole.createdDateTime = new Date();
        participantRole.updatedBy = 'sysadmin';
        participantRole.updatedDateTime = new Date();
        participantRole.ts = Buffer.from('');
        participantRole.roleType = 'STAFF';
        await manager.save(participantRole);
      }

      const caseWorkerRole = await manager.findOne(ParticipantRole, {
        where: { abbrev: 'CSWKR' },
      });

      const sdmRole = await manager.findOne(ParticipantRole, {
        where: { abbrev: 'SDM' },
      });

      const mentorRole = await manager.findOne(ParticipantRole, {
        where: { abbrev: 'MENTOR' },
      });

      if (caseWorkerRole && sdmRole && mentorRole) {
        for (const item of serviceTypeJSON) {
          let serviceTypeItem = await manager.findOne(ApplicationServiceType, {
            where: {
              serviceName: item.description,
              serviceType: item.type,
            },
          });

          if (!serviceTypeItem) {
            const serviceTypeCW = new ApplicationServiceType();
            serviceTypeCW.serviceName = item.description;
            serviceTypeCW.serviceType = item.type;
            await manager.save(serviceTypeCW);
          }

          serviceTypeItem = await manager.findOne(ApplicationServiceType, {
            where: {
              serviceName: item.description,
              serviceType: item.type,
            },
          });

          const sdmRoleServiceTypeItem = await manager.findOne(
            ApplicationServiceTypeAssignmentFactor,
            {
              where: {
                applicationServiceType: { id: serviceTypeItem.id },
                role: { id: sdmRole.id },
              },
            },
          );

          const mentorRoleServiceTypeItem = await manager.findOne(
            ApplicationServiceTypeAssignmentFactor,
            {
              where: {
                applicationServiceType: { id: serviceTypeItem.id },
                role: { id: mentorRole.id },
              },
            },
          );

          const caseWorkerRoleServiceTypeItem = await manager.findOne(
            ApplicationServiceTypeAssignmentFactor,
            {
              where: {
                applicationServiceType: { id: serviceTypeItem.id },
                role: { id: caseWorkerRole.id },
              },
            },
          );

          if (!sdmRoleServiceTypeItem) {
            const sdmRoleServiceType =
              new ApplicationServiceTypeAssignmentFactor();
            sdmRoleServiceType.applicationServiceType = serviceTypeItem;
            sdmRoleServiceType.role = sdmRole;
            sdmRoleServiceType.assignmentFactor = item.SDM;
            await manager.save(sdmRoleServiceType);
          }

          if (!mentorRoleServiceTypeItem) {
            const mentorRoleServiceType =
              new ApplicationServiceTypeAssignmentFactor();
            mentorRoleServiceType.applicationServiceType = serviceTypeItem;
            mentorRoleServiceType.role = mentorRole;
            mentorRoleServiceType.assignmentFactor = item.MNTR;
            await manager.save(mentorRoleServiceType);
          }

          if (!caseWorkerRoleServiceTypeItem) {
            const caseWorkerRoleServiceType =
              new ApplicationServiceTypeAssignmentFactor();
            caseWorkerRoleServiceType.applicationServiceType = serviceTypeItem;
            caseWorkerRoleServiceType.role = caseWorkerRole;
            caseWorkerRoleServiceType.assignmentFactor = item.CW;
            await manager.save(caseWorkerRoleServiceType);
          }
        }
      } else {
        throw new Error('Failed to create roles');
      }
    } catch (error) {
      console.log('ApplicationServiceTypeSeeder', error);
    }
};
