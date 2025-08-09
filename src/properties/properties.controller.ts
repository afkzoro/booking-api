import { Controller, Get, Param } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
    constructor(
        private readonly propertiesService: PropertiesService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get all properties' })
    @ApiResponse({ status: 200, description: 'List of all properties' })
    async getAllProperties(){
        return this.propertiesService.findAll()
    }

    @Get(':id/availability')
    @ApiOperation({ summary: 'Get property availability' })
    @ApiResponse({ status: 200, description: 'Property availability periods' })
    @ApiResponse({ status: 404, description: 'Property not found' })
    async getAllAvailableProperties(
        @Param('id') id: number
    ){
        return this.propertiesService.getAvailability(id)
    }
}