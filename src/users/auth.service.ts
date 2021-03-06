import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async createAccount(email: string, password: string){
        //check if user exists
        const users = await this.usersService.find(email);
        if(users.length){
            throw new BadRequestException("email is already in use");
        }
        // hash password 
        // generate a salt 
        const salt = randomBytes(8).toString('hex');

       // hash salt and password
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        
        // join the hashed result and salt together
        const result = salt + '.' + hash.toString('hex');

        // create a new user and save to db
        const user = await this.usersService.create(email, result);
        // return user
        return user;
    }

     async login(email: string, password: string){
        const [user] = await this.usersService.find(email)
        if(!user){
            throw new NotFoundException('user not found')
        }

        const [salt, storedHash] = user.password.split('.')
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Invaild Password')
        } 
        return user;
    }
}