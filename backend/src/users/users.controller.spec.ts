import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Users } from "./entities/users.entity";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";



describe("UserController", () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[],
      controllers: [UsersController],
      providers: [       
        UsersService,
        {provide:WINSTON_MODULE_NEST_PROVIDER, useValue :{}},
        {
          provide: getRepositoryToken(Users),
          useValue: {},
        },
 
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
