export const getEnvOrDefault = (varName: string, defaultValue?: any) =>
  varName in process.env ? process.env[varName] : defaultValue ? defaultValue : undefined;
