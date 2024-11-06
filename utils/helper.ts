export function convertToNumber(value: string | string[]): number  {
    if (Array.isArray(value)) {
      return parseFloat(value[0]);
    } else {
      return parseFloat(value);
    }
}

