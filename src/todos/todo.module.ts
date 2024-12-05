import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodoModule {}
