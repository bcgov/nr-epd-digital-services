import { Test, TestingModule } from '@nestjs/testing';
import { StaffAssignmentResolver } from './staffAssigned.resolver';
import { StaffAssignmentService } from '../../services/assignment/staffAssignment.service';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { ResponseDto } from '../../dto/response/response.dto';
import { HttpStatus } from '@nestjs/common';
import { UpdateStaffAssignedDto } from '../../dto/assignment/updateStaffAssigned.dto';
import { DropdownResponse } from '../../dto/dropdown.dto';

describe('StaffAssignmentResolver', () => {
  let resolver: StaffAssignmentResolver;
  let service: StaffAssignmentService;
  let loggerService: LoggerService;
  let genericResponseProvider: GenericResponseProvider<ResponseDto>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffAssignmentResolver,
        {
          provide: StaffAssignmentService,
          useValue: {
            getStaffByAppId: jest.fn(),
            updateStaffAssigned: jest.fn(),
            getApplicationServiceTypes: jest.fn(),
            getAllAciveStaffMembersWithCurrentCapacity: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: GenericResponseProvider,
          useValue: {
            createResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<StaffAssignmentResolver>(StaffAssignmentResolver);
    service = module.get<StaffAssignmentService>(StaffAssignmentService);
    loggerService = module.get<LoggerService>(LoggerService);
    genericResponseProvider = module.get<GenericResponseProvider<ResponseDto>>(
      GenericResponseProvider,
    );
  });

  it('should return a successful response when service returns a result', async () => {
    const applicationId = 1;
    const user = { id: 1 };
    const staffList = [{ id: 1, name: 'Test' }];
    const result = { assignmentSize: staffList.length, staffList };

    (service.getStaffByAppId as jest.Mock).mockResolvedValue(staffList);

    (genericResponseProvider.createResponse as jest.Mock).mockReturnValue({
      message: 'Participants fetched successfully',
      httpStatusCode: 200,
      success: true,
      data: result,
    });

    const response = await resolver.getStaffAssignedByAppId(
      applicationId,
      user,
    );

    expect(response).toEqual({
      message: 'Participants fetched successfully',
      httpStatusCode: 200,
      success: true,
      data: result,
    });
  });

  it('should return successful response with valid applicationId and user', async () => {
    const applicationId = 1;
    const user = { id: 1 };
    const result = { staffList: [] };
    (service.getStaffByAppId as jest.Mock).mockResolvedValue(result);

    (genericResponseProvider.createResponse as jest.Mock).mockReturnValue({
      message: 'Participants fetched successfully',
      httpStatusCode: 200,
      success: true,
      data: result,
    });

    const response = await resolver.getStaffAssignedByAppId(
      applicationId,
      user,
    );
    expect(response).toEqual({
      message: 'Participants fetched successfully',
      httpStatusCode: HttpStatus.OK,
      success: true,
      data: result,
    });
  });

  it('should return error response when service.getStaffByAppId throws an error', async () => {
    const applicationId = 1;
    const user = { id: 1 };
    const error = new Error('Test error');
    (service.getStaffByAppId as jest.Mock).mockRejectedValue(error);
    try {
      await resolver.getStaffAssignedByAppId(applicationId, user);
      fail('Expected error to be thrown');
    } catch (err) {
      expect(err).toBe(error);
    }
  });

  it('should return error response when applicationId is invalid', async () => {
    const applicationId = null;
    const user = { id: 1 };
    try {
      await resolver.getStaffAssignedByAppId(applicationId, user);
      fail('Expected error to be thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should return error response when user is invalid', async () => {
    const applicationId = 1;
    const user = null;
    try {
      await resolver.getStaffAssignedByAppId(applicationId, user);
      fail('Expected error to be thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should update staff assignment successfully', async () => {
    const staffInput: UpdateStaffAssignedDto[] = [
      {
        id: 1,
        applicationId: 1,
        personId: 1,
        roleId: 1,
        organizationId: null,
        startDate: new Date('2023-05-23'),
        endDate: null,
        action: '',
      },
    ];
    const applicationSize = 1;
    const applicationId = 1;
    const user = { id: 1 };
    (service.updateStaffAssigned as jest.Mock).mockResolvedValue(true);

    (genericResponseProvider.createResponse as jest.Mock).mockReturnValue({
      message: 'updated staff assignment successfully',
      httpStatusCode: HttpStatus.CREATED,
      success: true,
    });

    const result = await resolver.updateStaffAssigned(
      staffInput,
      applicationSize,
      applicationId,
      user,
    );
    expect(result).toEqual({
      message: 'updated staff assignment successfully',
      httpStatusCode: HttpStatus.CREATED,
      success: true,
    });
    expect(loggerService.log).toHaveBeenCalledTimes(1);
    expect(genericResponseProvider.createResponse).toHaveBeenCalledTimes(1);
  });

  it('should return successful response with application service types', async () => {
    const result = [{ id: 1, name: 'Service Type 1' }];
    (service.getApplicationServiceTypes as jest.Mock).mockResolvedValue(result);

    (genericResponseProvider.createResponse as jest.Mock).mockReturnValue({
      message: 'application service types fetched successfully',
      httpStatusCode: 200,
      success: true,
      data: result,
    });

    const response = await resolver.getApplicationServiceTypes({} as any);

    expect(response.data).toEqual(result);
    expect(response.httpStatusCode).toBe(HttpStatus.OK);
    expect(response.success).toBe(true);
    expect(loggerService.log).toHaveBeenCalledTimes(1);
    expect(genericResponseProvider.createResponse).toHaveBeenCalledTimes(1);
  });

  it('should return a successful response when getAllAciveStaffMembersWithCurrentCapacity returns a non-empty array', async () => {
    const result = [{ id: 1, name: 'John Doe' }];
    (
      service.getAllAciveStaffMembersWithCurrentCapacity as jest.Mock
    ).mockResolvedValue(result);

    (genericResponseProvider.createResponse as jest.Mock).mockReturnValue({
      message:
        'getAllAciveStaffMembersWithCurrentCapacity fetched successfully',
      httpStatusCode: 200,
      success: true,
      data: result,
    });

    const response = await resolver.getAllAciveStaffMembers({} as any);
    expect(response).toEqual({
      message:
        'getAllAciveStaffMembersWithCurrentCapacity fetched successfully',
      httpStatusCode: HttpStatus.OK,
      success: true,
      data: result,
    });
    expect(loggerService.log).toHaveBeenCalledTimes(1);
    expect(loggerService.log).toHaveBeenCalledWith(
      'AppParticipantResolver.getAllAciveStaffMembers() RES:200 end',
    );
  });
});
