import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
    constructor(
        private readonly bookingsService: BookingsService
    ){}

    @Post('create')
    @ApiOperation({ summary: 'Create a new booking' })
    @ApiResponse({ status: 201, description: 'Booking created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid booking data' })
    async createBooking(
        @Body() data: CreateBookingDto
    ){
        return this.bookingsService.create(data)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a booking' })
    @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async deleteBookings(
        @Param('id') id: number
    ){
        return this.bookingsService.remove(id)
    }
}