import { Query, Resolver } from '@nestjs/graphql';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { FetchOrganizationTypeResponse } from '../dto/reponse/fetchOrganizationType';
import { OrganizationType } from '../entities/organizationType';
import { OrganizationTypeService } from '../services/organizationType.service';

/**
 * GraphQL Resolver for Organization Types
 */
@Resolver(() => OrganizationType)
@Resource('user-service')
export class OrganizationTypeResolver {
  constructor(
    private readonly organizationTypeService: OrganizationTypeService,
  ) {}

  /**
   * Query Method To Find All Orgnization Types
   * @returns All Orgnization Types
   */
  @Roles({ roles: ['user-admin'], mode: RoleMatchingMode.ANY })
  @Query(() => FetchOrganizationTypeResponse, { name: 'organizationTypes' })
  findAll() {
    return this.organizationTypeService.findAll();
  }
}
