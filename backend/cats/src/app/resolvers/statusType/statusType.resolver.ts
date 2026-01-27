import { Resolver, Query } from '@nestjs/graphql';
import { StatusTypeService } from '../../services/statusType/statusType.service';
import { StatusType } from '../../entities/statusType.entity';

@Resolver(() => StatusType)
export class StatusTypeResolver {
  constructor(private readonly statusTypeService: StatusTypeService) {}

  @Query(() => [StatusType], { name: 'getAllStatusTypes' })
  async getAllStatusTypes() {
    return this.statusTypeService.getAllStatusTypes();
  }
}
