import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AdminRoleGuard } from 'src/guards';
import { UsersService } from 'src/services';
import { TestsModule } from './tests/tests.module';
import { ItineraryModule } from './itinerary/itinerary.module';
import { ChatModule } from './chat/chat.module';
import { ReferenceModule } from './reference/reference.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    TestsModule,
    UsersModule,
    ChatModule,
    ItineraryModule,
    ReferenceModule,
    SearchModule,
  ],
  providers: [UsersService, AdminRoleGuard],
})
export class AppModule {}
