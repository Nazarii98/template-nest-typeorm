import { Converter } from '@shared-kernel/common/interface/converter';
import { Template } from '../../../application/data/template';
import { TemplateEntity } from '../data/template.entity';

export class TemplateConverter implements Converter<Template, TemplateEntity> {
  from(from: Template): TemplateEntity {
    return TemplateEntity.fromObject(from);
  }
  to(to: TemplateEntity): Template {
    return { ...to };
  }
}
