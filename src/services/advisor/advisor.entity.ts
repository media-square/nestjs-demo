import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { ProductEntity } from '../product/product.entity';

@Entity('advisors', { schema: 'public' })
export class AdvisorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  // Don't expose password hash unless intended
  @Column({ select: false })
  password: string;

  @OneToMany(() => ProductEntity, (product) => product.advisor)
  products: ProductEntity[];
}
