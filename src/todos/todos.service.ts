import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(private readonly db: PrismaService) {}

  // Private helper to find a Todo or throw an exception if not found
  private async getTodoOrFail(id: string): Promise<Todo> {
    const todo = await this.db.todo.findUnique({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  // Fetch all todos
  async findAll(): Promise<Todo[]> {
    return this.db.todo.findMany();
  }

  // Fetch a single todo by ID
  async findOne(id: string): Promise<Todo> {
    return this.getTodoOrFail(id);
  }

  // Create a new todo
  async create(
    createTodoDto: CreateTodoDto,
  ): Promise<{ message: string; data: Todo }> {
    const todo = await this.db.todo.create({
      data: createTodoDto,
    });
    return {
      message: 'Todo successfully created',
      data: todo,
    };
  }

  // Update an existing todo
  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<{ message: string; data: Todo }> {
    await this.getTodoOrFail(id); // Ensure the todo exists before updating

    const updatedTodo = await this.db.todo.update({
      where: { id },
      data: updateTodoDto,
    });

    return {
      message: 'Todo successfully updated',
      data: updatedTodo,
    };
  }

  // Delete a todo
  async remove(id: string): Promise<{ message: string }> {
    await this.getTodoOrFail(id); // Ensure the todo exists before deleting

    await this.db.todo.delete({ where: { id } });
    return { message: `Todo with ID ${id} successfully deleted` };
  }
}
