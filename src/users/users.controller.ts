import {
    Body,
    Controller,
    Post,
    Get,
    Delete,
    Patch,
    Param,
    Query,
    Session,
    UseGuards,
    NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Serialize } from '../interceptors/serialize.interceptor'
import { UserDto } from './dto/user.dto'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current-user.decorators'
import { User } from './user.entity'
import { AuthGuard } from '../guards/auth.guards';


@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService, 
        private authService: AuthService,

    ) {}
    
    @Post('/create-account')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.createAccount(body.email, body.password);
        session.userId = user.id; 
        return user; 
    }

    @Post('/login')
    async login(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.login(body.email, body.password);
        session.userId = user.id;
        // console.log(userId)
        return user;
    }

    @Post('/logout')
    logout(@Session() session: any) {
        session.userId = null
    }

    @Get('current-user')
    @UseGuards(AuthGuard)
    getUser(@CurrentUser() user: User){
        return user; 
    }


//    @Get('current-user')
//    currentUser(@Session() session: any) {
//        return this.usersService.findOne(session.userId)
//    }

    // @UseInterceptors(new SerializeInterceptor(UserDto)) 
    // same as @Serialize custom interceptor
    @Get('/:id')
    async findUser(@Param('id') id: string){
        // all url params are strings until parsed
        const user = this.usersService.findOne(parseInt(id))
        if (!user ) {
            throw new NotFoundException('user not found')
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        return this.usersService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body)
    }

}

    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any){
    //     session.color = color;
    // }

    // @Get('/colors')
    // getColor(@Session() session: any){
    //     return session.color; 
    // }