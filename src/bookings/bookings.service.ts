import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from './bookings.entity';
import { Property } from 'src/properties/properties.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateBookingDto) {
    const { propertyId, userName, startDate, endDate } = dto;

    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestException('startDate must be before endDate');
    }

    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    if (startDate < property.availableFrom || endDate > property.availableTo) {
      throw new BadRequestException('Requested dates are outside property availability');
    }

    // transaction to prevent race conditions
    return this.dataSource.transaction(async (manager) => {
      const overlappingCount = await manager
        .getRepository(Booking)
        .createQueryBuilder('b')
        .where('b.property_id = :propertyId', { propertyId })
        .andWhere('NOT (b.end_date <= :startDate OR b.start_date >= :endDate)', { startDate, endDate })
        .getCount();

      if (overlappingCount > 0) {
        throw new BadRequestException('Requested dates overlap an existing booking');
      }

      const booking = manager.getRepository(Booking).create({
        propertyId,
        userName,
        startDate,
        endDate,
      });

      return manager.getRepository(Booking).save(booking);
    });
  }

  async remove(id: number) {
    const res = await this.bookingRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Booking not found');
    return { success: true };
  }
}
