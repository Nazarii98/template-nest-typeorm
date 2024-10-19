import { Fillable } from '@shared-kernel/common/decorators/fillable.decorator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../../configuration/base.entity';

@Entity('template')
export class TemplateEntity extends BaseEntity {
  @Column({ name: 'name', type: 'text' })
  name: string;

  @Fillable
  public static fromObject(_obj: TemplateEntity): TemplateEntity {
    return new TemplateEntity();
  }
}
