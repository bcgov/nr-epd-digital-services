import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { ColumnConfigDto } from '../dto/application/columnConfig.dto';

@Entity('user_column_preferences')
@Unique(['userId', 'page'])
export class UserColumnPreferences {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @Column({ name: 'page', type: 'varchar', length: 100 })
  page: string;

  @Column({ name: 'column_config', type: 'jsonb' })
  columnConfig: ColumnConfigDto[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
