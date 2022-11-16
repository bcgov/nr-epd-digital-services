import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { NAME_LENGTH_MAX} from '../../test/constants'
import {validate} from 'class-validator'
import { plainToInstance } from 'class-transformer';


describe('UsersService', () => {
  let service: UsersService;

  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ {
        provide: getRepositoryToken(User),
        //useClass: Repository,
        useValue:  {
          find : jest.fn(()=>{
            return Promise.resolve([{name:"test",id:1}])
          })
          ,
          findOneOrFail: jest.fn((id)=>{
            return Promise.resolve({name:"test",id:1})
          })
          ,
          create: jest.fn(async (user)=>{
            const errors =  await validate(user)
            if(errors.length>0){
              return Promise.resolve(errors)
            }
            return Promise.resolve(user)
          }),
          save: jest.fn(()=>{
          }),
          delete: jest.fn((id)=>{
            //return service.remove(id)
            return Promise.resolve(true)
          }),
          update: jest.fn((id,userUpdate) =>{
            return Promise.resolve(userUpdate)
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
    expect(users.data.length).toBeGreaterThan(0);
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

  it('Should delete a user', async ()=>{
    const removeUser = await service.remove(1)
    expect(removeUser)
  })

  it('Should update a user', async () =>{
    const updateUser = {name:"Test1",id:2}
    const result = await service.update(updateUser.id,updateUser)
    expect(result).toEqual(updateUser)
  })

  it('Should not allow for a user name longer than 256 chars', async () =>{

    const input: CreateUserInput = {
      name: NAME_LENGTH_MAX
    }
    const createUser = plainToInstance(CreateUserInput,input)
    const error = await service.create(createUser);  
    expect(error[0]).toHaveProperty("constraints.isLength")

  })

  it('Should not allow for an empty user name', async () =>{

    const input: CreateUserInput = {
      name: ""
    }
    const createUser = plainToInstance(CreateUserInput,input)
    const error = await service.create(createUser);
    console.log(error)  
    expect(error[0]).toHaveProperty("constraints.isLength")

  })

});
