import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AdvisorEntity } from '../advisor/advisor.entity';

@Entity('products', { schema: 'public' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'advisor_id', type: 'uuid' })
  advisorId: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 7, scale: 2 })
  price: number;

  @ManyToOne(() => AdvisorEntity, (advisor) => advisor.products)
  @JoinColumn({ name: 'advisor_id' })
  advisor: AdvisorEntity;
}
