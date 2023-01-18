export const parse = <T extends string>(data: T) => {
  return JSON.parse(data) as NonNullable<T>;
};

export const toUtf8 = (data: string) => {
  return Buffer.from(data, "base64").toString("utf-8");
};

export const toBase64 = (data: string) => {
  return Buffer.from(data).toString("base64");
};
