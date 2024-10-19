export class Template {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  name:string;

  public static build(_data: Partial<Template>): Template {
    const template = new Template();

    template.id = _data.id;
    template.createdAt = _data.createdAt;
    template.updatedAt = _data.updatedAt;
    template.name = _data.name;
    return template;
  }
}