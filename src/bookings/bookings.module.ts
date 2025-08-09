import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { Booking } from './bookings.entity';
import { Property } from 'src/properties/properties.entity';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Property])
  ],
  providers: [BookingsService],
  exports: [BookingsService, TypeOrmModule],
  controllers: [BookingsController]
})
export class BookingsModule {}