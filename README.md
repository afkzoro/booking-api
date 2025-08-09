# Property Booking API

A RESTful API built with NestJS for managing property bookings and availability.

## Features

- Property management
- Booking creation and management
- Availability checking
- Swagger API documentation
- PostgreSQL database integration

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASS=your_password
DB_NAME=booking_db
PORT=3000
```

## Installation

```bash
# Install dependencies
npm install

# or with yarn
yarn install
```

## Database Setup and Seeding

1. First ensure PostgreSQL is running and your `.env` file is configured correctly.

2. Run the seeding script to populate the database with initial data:

```bash
# Using npm
npm run seed

# Using yarn
yarn seed
```

The seeding script will create a sample property:
- Title: "Cozy studio"
- Description: "Nice studio downtown"
- Price per night: $50.00
- Available from: September 1, 2025
- Available to: December 31, 2025

## Running the Application

```bash
# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Documentation

The API documentation is available via Swagger UI at:
```
http://localhost:3000/api
```

## API Endpoints

### Properties

- `GET /properties` - Get all properties
- `GET /properties/:id/availability` - Get property availability

### Bookings

- `POST /bookings/create` - Create a new booking
- `DELETE /bookings/:id` - Delete a booking

## Smart Booking Logic

### Availability Calculation
The API implements sophisticated availability checking:

- **Date Range Validation**: Ensures bookings are only made within the property's available period
```typescript
if (startDate < property.availableFrom || endDate > property.availableTo) {
  throw new BadRequestException('Requested dates are outside property availability');
}
```

- **Overlap Prevention**: Uses SQL to detect booking conflicts
```typescript
NOT (end_date <= :startDate OR start_date >= :endDate)
```

- **Free Range Detection**: Calculates available periods between bookings
```typescript
const freeRanges: { start: string; end: string }[] = [];
let cursor = property.availableFrom;
    
for (const booking of bookings) {
  if (booking.startDate > cursor) {
    freeRanges.push({ start: cursor, end: booking.startDate });
  }
  cursor = booking.endDate > cursor ? booking.endDate : cursor;
}
```

### Transaction Safety
All bookings are handled in database transactions to prevent double-bookings:
- Checks for overlapping bookings
- Creates new booking record
- All operations are atomic (succeed or fail together)

### Error Handling
The API includes comprehensive validation:
- ✓ Date sequence validation (start before end)
- ✓ Property existence verification
- ✓ Booking overlap prevention
- ✓ Available date range enforcement