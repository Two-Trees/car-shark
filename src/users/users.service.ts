import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity';

@Injectable()
export class UsersService {
    // create typeORM repository
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    create(email: string, password: string) {
        // create method creates user instance, save method for db persistence
        const user = this.repo.create({ email, password })
        return this.repo.save(user)
    }

    findOne(id: number){
        if(!id){
            return null;
        }
        return this.repo.findOne(id)
    }

    find(email: string){
        if(!email){
            return null;
        }
        return this.repo.find({ email })
    }   

    async update(id: number, attrs: Partial<User>){
        const user = await this.findOne(id)
        if (!user){
            throw new Error('user not found')
        }
        // Object.assign takes values/props of attrs and copies/overrides into user,
        Object.assign(user, attrs)
        return this.repo.save(user)
    }

    async remove(id: number){
        const user = await this.findOne(id)
        if (!user){
            throw new Error('user not found')
        }
        return this.repo.remove(user)
    }
}