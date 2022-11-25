import { Query, Resolver } from '@nestjs/graphql';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { FetchOrganizationTypeResponse } from '../dto/reponse/fetchOrganizationType';
import { OrganizationType } from '../entities/organizationType';
import { OrganizationTypeService } from '../services/organizationType.service';

/**
 * GraphQL Resolver for Organization Types
 */
@Resolver(() => OrganizationType)
@Resource('backend')
export class OrganizationTypeResolver {
  constructor(private readonly serviceLayer: OrganizationTypeService) {}

  /**
   * Query Method To Find All Orgnization Types
   * @returns All Orgnization Types
   */
  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Query(() => FetchOrganizationTypeResponse, { name: 'orgnizationTypes' })
  findAll() {
    return this.serviceLayer.findAll();
  }
}
