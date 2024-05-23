import { Module } from '@nestjs/common';
import { ItineraryController } from './itinerary.controller';
import { ItineraryService, UsersService } from 'src/services';

@Module({
  controllers: [ItineraryController],
  providers: [UsersService, ItineraryService],
})
export class ItineraryModule {}
