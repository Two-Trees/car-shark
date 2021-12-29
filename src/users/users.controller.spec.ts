import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './user.entity'

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersSerivce: Partial<UsersService>
  let fakeAuthService: Partial <AuthService>

  beforeEach(async () => {
    fakeUsersSerivce = {
      findOne: (id: number) => {
        return Promise.resolve({id, email: 'asd@asd.com', password: 'asd'} as User)
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: 'asd'} as User])
      }
      // remove: () => {}
      // update: () => {}
    }

    fakeAuthService = {
      // createAccount: () => {},
      login: (email: string, password: string) => {
        return Promise.resolve({id: 1, email, password} as User)
      },  
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService, 
          useValue: fakeUsersSerivce
        }, 
        {
          provide: AuthService, 
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with a given email', async () => {
    const users = await controller.findAllUsers('matt@mit.edu')
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual('matt@mit.edu')
  })

  it('findUser returns user from id', async () => {
    const users = await controller.findUser('5')
    expect(users).toBeDefined
  })

  it('login updates session object and returns user', async ()=> {
    const session = {userId: 10}
    const user = await controller.login({email: 'asdf@asdf.com', password: 'asdf'}, 
    session
    ); 
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1)
  })
});



