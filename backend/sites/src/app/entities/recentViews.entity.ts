import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import { Sites } from './sites.entity';
import { SiteStaffs } from './siteStaffs.entity';

@ObjectType()
@Entity('recent_views')
@Index('idx_user_id', ['userId'])
export class RecentViews {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('character varying', { name: 'user_id', length: 30 })
  userId: string;

  @Field()
  @Column('character varying', { name: 'site_id' })
  siteId: string;

  @Field()
  @Column('character varying', { length: 200 })
  address: string;

  @Field()
  @Column('character varying', { name: 'city', length: 30 })
  city: string;

  @Field({ nullable: true })
  @Column('character varying', {
    name: 'general_description',
    length: 225,
    nullable: true,
  })
  generalDescription: string | null;

  @Field({ nullable: true })
  @Column('timestamp without time zone', {
    name: 'when_updated',
    nullable: true,
  })
  whenUpdated: Date | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @ManyToOne(() => Sites, (site) => site.recentViewedSites)
  @JoinColumn({ name: 'site_id', referencedColumnName: 'id' })
  site: Sites;
}
