import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/bookings.entity';
import { Property } from './properties.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Booking, Property])
    ],
  controllers: [PropertiesController],
  providers: [PropertiesService, TypeOrmModule]
})
export class PropertiesModule {}
