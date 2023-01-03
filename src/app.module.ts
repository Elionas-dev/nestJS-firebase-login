import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FirebaseService } from './firebase/firebase.service';

@Module({
  // forRoot() is a method that allows the module to expose module internal things
  // Is a static method and can be named anything, but by convension is called forRoot or register.
  // In the case of configModule, this method loads the .env file and the variables.
  // So it's better to import ConfigModule in the AppModule.
  imports: [AuthModule, ConfigModule.forRoot()],
  providers: [FirebaseService],
})
export class AppModule {}
