import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ {
        provide: getRepositoryToken(User),
        useValue:  {
          find : jest.fn(()=>{
            return Promise.resolve([{name:"test",id:1}])
          })
          ,
          findOneOrFail: jest.fn((id)=>{
            return Promise.resolve({name:"test",id:1})
          })
          ,
          create: jest.fn(()=>{
            return Promise.resolve({name:"test",id:1})
          }),
          save: jest.fn(()=>{
           
          })
        } ,
      }, UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return atleast a user', async ()=>{
    const users=  await service.findAll();
    console.log(users)
    expect(users.length).toBeGreaterThan(0);
  })

  it('should return a user', async ()=>{
    const user=  await service.findOne(2);  
    expect(user.name).toEqual("test");
  })

  it('should create and return a user', async ()=>{

    const input: CreateUserInput = {
      name:"test"
    }

    const user=  await service.create(input);  
    expect(user.name).toEqual("test");
  })


});
