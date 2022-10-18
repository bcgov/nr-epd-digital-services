import { Resolver,Query,Mutation , Args} from '@nestjs/graphql';
import { argsToArgsConfig } from 'graphql/type/definition';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver(()=>Users)
@Resource('backend')
export class UsersResolver {

    constructor(private userService: UsersService)
    {}
    
    @Roles({roles:['adminbackend'],mode: RoleMatchingMode.ANY})
    @Query(()=>[Users],{name:"findUsers"})
    findAll()
    {
       
       return   this.userService.findAll().then(x=> {return x});
    }

    @Roles({roles:['admincrud'],mode: RoleMatchingMode.ANY})
    @Mutation(()=>Users,{name:"createUser"})
    createUser(@Args('user') user:CreateUserDto )
    {
        return this.userService.create(user);
    }

}
