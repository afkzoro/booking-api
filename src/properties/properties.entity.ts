import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from 'src/bookings/bookings.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerNight: number;

  @Column({ type: 'date', name: 'available_from' })
  availableFrom: string; // ISO date string YYYY-MM-DD

  @Column({ type: 'date', name: 'available_to' })
  availableTo: string;

  @OneToMany(() => Booking, (b) => b.property)
  bookings: Booking[];
}
