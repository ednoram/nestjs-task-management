import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { TaskStatus } from '../task.status.enum';

export class GetTasksFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
