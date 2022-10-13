import { Resolver,Query,Mutation , Args} from '@nestjs/graphql';
import { argsToArgsConfig } from 'graphql/type/definition';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver(()=>Users)
export class UsersResolver {

    constructor(private userService: UsersService)
    {}

    @Query(()=>[Users],{name:"findUsers"})
    findAll()
    {
       
       return   this.userService.findAll().then(x=> {return x});
    }

    @Mutation(()=>Users,{name:"createUser"})
    createUser(@Args('user') user:CreateUserDto )
    {
        return this.userService.create(user);
    }

}
