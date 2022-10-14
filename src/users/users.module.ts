
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service'; 
import { UsersController } from './controllers/users.controller';
import { User } from './user.entity';
import { AuthService } from '../auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from '../auth/strategies/local.strategy';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AuthService, JwtService, LocalStrategy, JwtStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
