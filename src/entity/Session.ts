import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity("sessions")
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({name: "userId", referencedColumnName:'id'})
  user: User;
  
  @Field()
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  userAgent: string;

  @Column({ type: 'timestamp' })
  expiredDate: Date;
}
