import { EntityManager } from 'typeorm';
import { ApplicationServiceType } from '../app/entities/applicationServiceType.entity';
import { ParticipantRole } from '../app/entities/participantRole.entity';
import { ServiceAssignmentFactor } from '../app/entities/serviceAssignmentFactor';
import { PermissionServiceType } from '../app/entities/permissionServiceType';
import { StaffRoles } from '../app/services/assignment/staffRoles.enum';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const legacyServiceTypes = require('./applicationServiceType.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceTypes2026 = require('./applicationServiceType2026.json');
const serviceTypes = [...legacyServiceTypes, ...serviceTypes2026];

export const ApplicationServiceTypeSeeder = async (manager: EntityManager) => {
  console.log('ApplicationServiceTypeSeeder start');
  try {
    const mentorResult = await manager.findOne(ParticipantRole, {
      where: { description: 'Mentor' },
    });

    if (!mentorResult || Object.keys(mentorResult).length === 0) {
      const participantRole = new ParticipantRole();
      participantRole.abbrev = StaffRoles.MENTOR;
      participantRole.description = 'Mentor';
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
    } else {
      await manager.update(
        ParticipantRole,
        { description: 'Mentor' },
        { roleType: 'STAFF', abbrev: StaffRoles.MENTOR },
      );
    }

    const caseWorkerRole = await manager.findOne(ParticipantRole, {
      where: { abbrev: StaffRoles.CASE_WORKER },
    });

    const sdmRole = await manager.findOne(ParticipantRole, {
      where: { abbrev: StaffRoles.SDM },
    });

    const mentorRole = await manager.findOne(ParticipantRole, {
      where: { abbrev: StaffRoles.MENTOR },
    });

    console.log('roles found', caseWorkerRole, sdmRole, mentorRole);

    // One-time deletions.
    const serviceTypeDeletions: { type: string; name: string }[] = [
      { type: 'Non-CSAP', name: '26-Annual Update - AiP Reporting' },
      { type: 'Non-CSAP', name: '26-Annual Update - CoC Reporting' },
    ];

    for (const deletion of serviceTypeDeletions) {
      const existing = await manager.findOne(ApplicationServiceType, {
        where: { serviceName: deletion.name, serviceType: deletion.type },
      });
      if (existing) {
        await manager.delete(ServiceAssignmentFactor, {
          applicationServiceType: { id: existing.id },
        });
        await manager.delete(PermissionServiceType, {
          serviceTypeId: Number(existing.id),
        });
        await manager.delete(ApplicationServiceType, { id: existing.id });
        console.log(
          `Deleted service type: ${deletion.type} - ${deletion.name}`,
        );
      }
    }

    // One-time description renames.
    const descriptionRenames: {
      type: string;
      oldName: string;
      newName: string;
    }[] = [
      {
        type: 'CSAP',
        oldName: '26-CSAP - AP Statement or Report',
        newName: '26-CSAP - AP Statement or report - no ministry fee',
      },
      {
        type: 'Non-CSAP',
        oldName: '26-Determination of a Contaminated Site - Final',
        newName:
          '26-Determination of a contaminated site - Final - no ministry fees',
      },
      {
        type: 'Non-CSAP',
        oldName: '26-Risk Assessment Not Included in a Remediation Plan',
        newName:
          '26-Risk Assessment (Human health or Environmental risk assessment)',
      },
      {
        type: 'Non-CSAP',
        oldName:
          '26-Person Requests a Notice from a Director Stating the Director Does Not Require Site Investigation (Release under Scenario 1)',
        newName: '26-Release under scenario 1',
      },
      {
        type: 'Non-CSAP',
        oldName:
          '26-Person Requests a Notice from a Director Stating That the Site Would Not Present a Significant Threat or Risk If the Application Were Approved (Release under Scenario 2)',
        newName: '26-Release under scenario 2',
      },
      {
        type: 'Non-CSAP',
        oldName:
          '26-Person Requests a Notice from a Director Stating the Director Has Received a Remediation Plan Supporting Independent Remediation of the Site (Release under Scenario 3)',
        newName: '26-Release under scenario 3',
      },
      {
        type: 'Non-CSAP',
        oldName: '26-Annual Update - Site ID',
        newName: '26-Annual Update - Site ID  (Table 2.16)',
      },
      {
        type: 'CSAP',
        oldName: 'Approval in Principle with or without additional services',
        newName: 'Approval in Principle',
      },
      {
        type: 'CSAP',
        oldName:
          'Certificate of Compliance - detailed risk assessment with or without other reports',
        newName: 'Certificate of Compliance - detailed risk assessment',
      },
      {
        type: 'CSAP',
        oldName:
          'Certificate of Compliance - numerical withor without other reports',
        newName: 'Certificate of Compliance - numerical',
      },
      {
        type: 'CSAP',
        oldName:
          'Preliminary Determination under CSR 15(3), with other reports',
        newName: 'Preliminary Determination under CSR 15(3)',
      },
      {
        type: 'CSAP',
        oldName: 'Reporting',
        newName: 'CSAP - AP Statement or report',
      },
      {
        type: 'Non-CSAP',
        oldName:
          'Detailed site investigation, Risk assessment with other services',
        newName: 'Detailed site investigation',
      },
    ];

    for (const rename of descriptionRenames) {
      await manager.update(
        ApplicationServiceType,
        { serviceName: rename.oldName, serviceType: rename.type },
        { serviceName: rename.newName },
      );
    }

    if (caseWorkerRole && sdmRole && mentorRole) {
      console.log(`Processing ${serviceTypes.length} service types`);
      for (const item of serviceTypes) {
        console.log(
          `Processing: ${item.type} - ${item.description} (fee: ${item.fee})`,
        );

        let serviceTypeItem = await manager.findOne(ApplicationServiceType, {
          where: {
            serviceName: item.description,
            serviceType: item.type,
          },
        });

        if (!serviceTypeItem) {
          console.log(`  -> INSERTING new record`);
          const serviceTypeCW = new ApplicationServiceType();
          serviceTypeCW.serviceName = item.description;
          serviceTypeCW.serviceType = item.type;
          serviceTypeCW.serviceFeeInCents =
            item.fee != null ? Math.round(item.fee * 100) : null;
          serviceTypeCW.serviceFeeInCents =
            item.fee != null ? Math.round(item.fee * 100) : null;
          await manager.save(serviceTypeCW);
        } else if (
          item.fee != null &&
          serviceTypeItem.serviceFeeInCents !== Math.round(item.fee * 100)
        ) {
          console.log(
            `  -> UPDATING fee: ${
              serviceTypeItem.serviceFeeInCents
            } -> ${Math.round(item.fee * 100)}`,
          );
          await manager.update(
            ApplicationServiceType,
            { id: serviceTypeItem.id },
            { serviceFeeInCents: Math.round(item.fee * 100) },
          );
        } else {
          console.log(`  -> SKIPPED (already exists, fee matches)`);
        }

        serviceTypeItem = await manager.findOne(ApplicationServiceType, {
          where: {
            serviceName: item.description,
            serviceType: item.type,
          },
        });

        const sdmRoleServiceTypeItem = await manager.findOne(
          ServiceAssignmentFactor,
          {
            where: {
              applicationServiceType: { id: serviceTypeItem.id },
              role: { id: sdmRole.id },
            },
          },
        );

        const mentorRoleServiceTypeItem = await manager.findOne(
          ServiceAssignmentFactor,
          {
            where: {
              applicationServiceType: { id: serviceTypeItem.id },
              role: { id: mentorRole.id },
            },
          },
        );

        const caseWorkerRoleServiceTypeItem = await manager.findOne(
          ServiceAssignmentFactor,
          {
            where: {
              applicationServiceType: { id: serviceTypeItem.id },
              role: { id: caseWorkerRole.id },
            },
          },
        );

        if (!sdmRoleServiceTypeItem) {
          const sdmRoleServiceType = new ServiceAssignmentFactor();
          sdmRoleServiceType.applicationServiceType = serviceTypeItem;
          sdmRoleServiceType.role = sdmRole;
          sdmRoleServiceType.assignmentFactor = item.SDM;
          await manager.save(sdmRoleServiceType);
        }

        if (!mentorRoleServiceTypeItem) {
          const mentorRoleServiceType = new ServiceAssignmentFactor();
          mentorRoleServiceType.applicationServiceType = serviceTypeItem;
          mentorRoleServiceType.role = mentorRole;
          mentorRoleServiceType.assignmentFactor = item.MNTR;
          await manager.save(mentorRoleServiceType);
        }

        if (!caseWorkerRoleServiceTypeItem) {
          const caseWorkerRoleServiceType = new ServiceAssignmentFactor();
          caseWorkerRoleServiceType.applicationServiceType = serviceTypeItem;
          caseWorkerRoleServiceType.role = caseWorkerRole;
          caseWorkerRoleServiceType.assignmentFactor = item.CW;
          await manager.save(caseWorkerRoleServiceType);
        }
      }
    }
  } catch (error) {
    console.log('ApplicationServiceTypeSeeder', error);
  }
};
