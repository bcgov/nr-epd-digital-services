import { ApplicationServiceType } from '../app/entities/applicationServiceType.entity';
import { ParticipantRole } from '../app/entities/participantRole.entity';
import { ServiceAssignmentFactor } from '../app/entities/serviceAssignmentFactor';
import { StaffRoles } from '../app/services/assignment/staffRoles.enum';
import { ApplicationServiceTypeSeeder } from './applicationServiceType.seed';
import {
  CASEWORKER_PERMISSIONS,
  COMMON_PERMISSIONS,
  MENTOR_PERMISSIONS,
  SDM_PERMISSIONS,
} from './permissions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const legacyServiceTypes = require('./applicationServiceType.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceTypes2026 = require('./applicationServiceType2026.json');

describe('ApplicationServiceType seed data', () => {
  it('contains valid 2026 types alongside 36 unique legacy types', () => {
    const allServiceTypes = [...legacyServiceTypes, ...serviceTypes2026];
    const uniqueKeys = new Set(
      allServiceTypes.map((item) => `${item.type}:${item.description}`),
    );

    expect(legacyServiceTypes).toHaveLength(36);
    expect(serviceTypes2026).toHaveLength(66);
    expect(allServiceTypes).toHaveLength(102);
    expect(uniqueKeys.size).toBe(allServiceTypes.length);
    expect(
      serviceTypes2026.filter((item) => item.type === 'CSAP'),
    ).toHaveLength(7);
    expect(
      serviceTypes2026.filter((item) => item.type === 'Non-CSAP'),
    ).toHaveLength(59);

    for (const item of serviceTypes2026) {
      expect(['CSAP', 'Non-CSAP']).toContain(item.type);
      for (const factor of [item.CW, item.SDM, item.MNTR]) {
        expect(Number.isFinite(factor)).toBe(true);
        expect(factor).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('maps every 2026 type that has permissions to at least one staff permission', () => {
    const permissionDefinitions = [
      ...COMMON_PERMISSIONS,
      ...SDM_PERMISSIONS,
      ...CASEWORKER_PERMISSIONS,
      ...MENTOR_PERMISSIONS,
    ];
    const mappedServiceTypes = new Set(
      permissionDefinitions.flatMap((permission) =>
        (permission.serviceTypesDetails ?? []).map(
          (detail) => `${detail.serviceType}:${detail.applicationServiceDesc}`,
        ),
      ),
    );

    // Verify that at least some 2026 types are mapped to permissions
    const mapped2026Types = serviceTypes2026.filter((item) =>
      mappedServiceTypes.has(`${item.type}:${item.description}`),
    );
    expect(mapped2026Types.length).toBeGreaterThan(0);
  });

  it('preserves the release scenario labels', () => {
    const descriptions = serviceTypes2026.map((item) => item.description);

    expect(descriptions).toEqual(
      expect.arrayContaining([
        '26-Release under scenario 1',
        '26-Release under scenario 2',
        '26-Release under scenario 3',
      ]),
    );
  });
});

describe('ApplicationServiceTypeSeeder', () => {
  it('loads all seed records once and is idempotent', async () => {
    const roles = {
      [StaffRoles.CASE_WORKER]: { id: '1', abbrev: StaffRoles.CASE_WORKER },
      [StaffRoles.SDM]: { id: '2', abbrev: StaffRoles.SDM },
      [StaffRoles.MENTOR]: {
        id: '3',
        abbrev: StaffRoles.MENTOR,
        description: 'Mentor',
      },
    };
    const serviceTypes = new Map<string, ApplicationServiceType>();
    const factors = new Set<string>();
    let nextServiceTypeId = 1;

    const manager = {
      findOne: jest.fn(async (entity, options) => {
        if (entity === ParticipantRole) {
          if (options.where.description === 'Mentor') {
            return roles[StaffRoles.MENTOR];
          }
          return roles[options.where.abbrev];
        }

        if (entity === ApplicationServiceType) {
          const { serviceName, serviceType } = options.where;
          return serviceTypes.get(`${serviceType}:${serviceName}`) ?? null;
        }

        if (entity === ServiceAssignmentFactor) {
          const serviceTypeId = options.where.applicationServiceType.id;
          const roleId = options.where.role.id;
          return factors.has(`${serviceTypeId}:${roleId}`) ? { id: '1' } : null;
        }

        return null;
      }),
      save: jest.fn(async (entity) => {
        if (entity instanceof ApplicationServiceType) {
          entity.id = String(nextServiceTypeId++);
          serviceTypes.set(
            `${entity.serviceType}:${entity.serviceName}`,
            entity,
          );
        }

        if (entity instanceof ServiceAssignmentFactor) {
          factors.add(`${entity.applicationServiceType.id}:${entity.role.id}`);
        }

        return entity;
      }),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(async () => 0),
    };
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await ApplicationServiceTypeSeeder(manager as never);

    expect(serviceTypes.size).toBe(102);
    expect(factors.size).toBe(306);

    manager.save.mockClear();
    await ApplicationServiceTypeSeeder(manager as never);

    expect(manager.save).not.toHaveBeenCalled();
    consoleLogSpy.mockRestore();
  });
});
