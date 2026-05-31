export const stripUndefined = (obj: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): { [key: string]: any } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: { [key: string]: any } = {};

  // eslint-disable-next-line no-restricted-syntax/noForInLoops
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result;
};

export const stripNull = (obj: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): { [key: string]: any } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: { [key: string]: any } = {};

  // eslint-disable-next-line no-restricted-syntax/noForInLoops
  for (const key in obj) {
    if (obj[key] !== null) {
      result[key] = obj[key];
    }
  }

  return result;
};

export const stripFalsy = (obj: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): { [key: string]: any } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: { [key: string]: any } = {};

  // eslint-disable-next-line no-restricted-syntax/noForInLoops
  for (const key in obj) {
    if (obj[key]) {
      result[key] = obj[key];
    }
  }

  return result;
};
