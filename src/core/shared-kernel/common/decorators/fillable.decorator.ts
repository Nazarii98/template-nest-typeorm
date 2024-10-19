export const Fillable = <T>(target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const keys = Object.getOwnPropertyNames(new target());
  descriptor.value = (obj: Partial<T>): T => {
    const model = new target();

    if (obj) {
      for (const key of keys) {
        const metadata = Reflect.getMetadata(`${key}:fillMapper`, model);
        if (!metadata) {
          model[key] = obj[key];
        } else {
          const mapper = metadata.mapper;
          model[key] = metadata.isArray ? obj[key]?.map((val) => mapper(val, obj)) : mapper(obj[key], obj);
        }
      }
    }
    return model;
  };
};

export const FillTransform =
  (resultMapper: (value: any, sourceObject: object) => any, options: { isArray: boolean } = { isArray: false }) =>
  (target: any, propertyName: string) => {
    Reflect.defineMetadata(`${propertyName}:fillMapper`, { mapper: resultMapper, isArray: options.isArray || false }, target);
  };
