import { Controller, Get, Inject, LoggerService } from "@nestjs/common";
import { AppService } from "./app.service";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { RoleGuard, Roles, Scopes, Resource, RoleMatchingMode } from "nest-keycloak-connect";

@Resource('backend')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  @Get()
  //@Roles({ roles: ['offline_access','admin','manage-account'] })
  //@Scopes('profile email')
  @Roles({roles:['adminbackend'],mode: RoleMatchingMode.ANY})
  getHello(): string {
    this.logger.log("Calling getHello()", AppController.name);
    this.logger.log("Calling getHello()", AppController.name);
    this.logger.debug("Calling getHello()", AppController.name);
    this.logger.verbose("Calling getHello()", AppController.name);
    this.logger.warn("Calling getHello()", AppController.name);
    this.logger.log("test", { name: "test", id: 1 });

    return this.appService.getHello();
  }
}
