import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
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
        }}
        ,UsersResolver, UsersService],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return atleast a user', async ()=>{
    const users=  await resolver.findAll();
    console.log(users)
    expect(users.data.length).toBeGreaterThan(0);
  })

  it('should return a user', async ()=>{
    const user=  await resolver.findOne(2);  
    expect(user.name).toEqual("test");
  })

  it('should create and return a user', async ()=>{

    const input: CreateUserInput = {
      name:"test"
    }

    const user=  await resolver.createUser(input);  
    expect(user.name).toEqual("test");
  })



});
