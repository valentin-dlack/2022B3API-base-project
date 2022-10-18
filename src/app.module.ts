/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AuthService } from './auth/services/auth.service';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { Project } from './projects/project.entity';
import { ProjectsModule } from './projects/projects.module';
import { UsersController } from './users/controllers/users.controller';
import { UsersService } from './users/services/users.service';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Project],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ProjectsModule
  ],
  controllers: [ ],
  providers: [ ],
})
export class AppModule {}
