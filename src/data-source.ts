// src/data-source.ts
import { DataSource } from 'typeorm';
import { Property } from './properties/properties.entity';
import { Booking } from './bookings/bookings.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Property, Booking],
  synchronize: true,
  logging: false,
});
