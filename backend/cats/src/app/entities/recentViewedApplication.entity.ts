import { Column, Entity, In, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "./application.entity";

@Index('idx_user_id', ['userId'])
@Index('idx_user_id_site_id_application_id', ['userId', 'siteId', 'applicationId'], { unique: true })
@Entity('recent_viewed_applications')
export class RecentViewedApplication {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: number;

    @Column('character varying', { name: 'user_id', length: 100 })
    userId: string;

    @Column('character varying', { name: 'application_id' })
    applicationId: number

    @Column('character varying', { name: 'site_id', nullable: true })
    siteId: number | null;

    @Column('character varying', { length: 200 })
    address: string;

    @Column('character varying', { length: 200 })
    applicationType: string

    @Column('character varying', { name: 'visited_by', length: 20 })
    visitedBy: string;

    @Column('timestamp without time zone', { name: 'visited_date_time' })
    visitedDateTime: Date;

    @ManyToOne(() => Application, (application) => application.recentViewedApplications)
    @JoinColumn({ name: 'application_id', referencedColumnName: 'id' })
    application: Application;
}