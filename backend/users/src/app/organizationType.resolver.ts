import { Query, Resolver } from '@nestjs/graphql';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { FetchOrganizationTypeResponse } from './dto/reponse/fetchOrganizationType';
import { OrganizationTypes } from './entities/organizationTypes';
import { OrganizationTypeService } from './organizationType.service';

@Resolver(() => OrganizationTypes)
@Resource('backend')
export class OrganizationTypeResolver {
  constructor(private readonly serviceLayer: OrganizationTypeService) {}
  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Query(() => FetchOrganizationTypeResponse, { name: 'orgnizationTypes' })
  findAll() {
    return this.serviceLayer.findAll();
  }
}
