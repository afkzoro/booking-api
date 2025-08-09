import { IsInt, IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'The ID of the property to book', example: 1 })
  @IsInt()
  propertyId: number;

  @ApiProperty({ description: 'Name of the person making the booking', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ description: 'Start date of the booking', example: '2025-08-10' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date of the booking', example: '2025-08-15' })
  @IsDateString()
  endDate: string;
}