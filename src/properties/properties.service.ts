import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './properties.entity';
import { Booking } from 'src/bookings/bookings.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
  ) {}

  findAll() {
    return this.propertyRepo.find();
  }

  async getAvailability(propertyId: number) {
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    const bookings = await this.bookingRepo
      .createQueryBuilder('b')
      .where('b.property_id = :propertyId', { propertyId })
      .andWhere('NOT (b.end_date <= :availableFrom OR b.start_date >= :availableTo)', {
        availableFrom: property.availableFrom,
        availableTo: property.availableTo,
      })
      .orderBy('b.start_date', 'ASC')
      .getMany();

    const freeRanges: { start: string; end: string }[] = [];
    let cursor = property.availableFrom;
    
    for (const b of bookings) {
      if (b.startDate > cursor) {
        freeRanges.push({ start: cursor, end: b.startDate });
      }
      cursor = b.endDate > cursor ? b.endDate : cursor;
    }

    if (cursor < property.availableTo) {
      freeRanges.push({ start: cursor, end: property.availableTo });
    }

    return freeRanges;
  }
}
