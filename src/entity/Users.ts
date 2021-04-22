import { Entity, PrimaryGeneratedColumn, Unique, Column } from 'typeorm';
import { MinLength, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['email'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(6)
  @IsNotEmpty()
  name: string;

  @Column()
  @MinLength(5)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @MinLength(10)
  @IsNotEmpty()
  phone: string;

  @Column()
  @MinLength(10)
  @IsNotEmpty()
  password: string;

  @Column()
  @MinLength(6)
  @IsNotEmpty()
  type_id: string;

  @Column()
  @MinLength(6)
  @IsNotEmpty()
  num_id: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @MinLength(1)
  @IsNotEmpty()
  gender: string;

  @Column()
  @MinLength(6)
  @IsNotEmpty()
  cod_student: string;

  @Column()
  @MinLength(4)
  @IsNotEmpty()
  semester: string;

  @Column()
  @IsOptional()
  @IsNotEmpty()
  resetToken: string;



  hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}