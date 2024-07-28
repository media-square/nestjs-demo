export const toArray = <T>(value: T[] | T | undefined): T[] => (value == null ? [] : Array.isArray(value) ? value : [value]);
