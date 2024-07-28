export const isStringTruthy = (input?: string) => !!input && !!input.trim() && !['undefined', 'null', 'false', 'NaN'].includes(input.trim());
