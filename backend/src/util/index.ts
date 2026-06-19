export const isEmptyObject = (obj: Record<string, any> | null) =>
  obj != null &&
  Object.prototype.toString.call(obj) === '[object Object]' &&
  Object.keys(obj).length === 0;
