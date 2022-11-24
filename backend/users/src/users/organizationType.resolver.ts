import { Query, Resolver } from '@nestjs/graphql';
import {
  Resource,
  RoleMatchingMode,
  Roles,
  Unprotected,
} from 'nest-keycloak-connect';
import { FetchOrganizationTypeResponse } from './dto/reponse/fetchOrganizationType';
import { OrganizationType } from './entities/organizationType.entity';
import { OrganizationTypeService } from './organizationType.service';

@Resolver(() => OrganizationType)
@Resource('backend')
//@Unprotected()
export class OrganizationTypeResolver {
  constructor(private readonly serviceLayer: OrganizationTypeService) {}
  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Query(() => FetchOrganizationTypeResponse, { name: 'orgnizationTypes' })
  findAll() {
    return this.serviceLayer.findAll();
  }
}
