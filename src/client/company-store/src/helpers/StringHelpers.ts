export function isEmpty(value: any) {
  return !value || value.length === 0;
}

export function hasValue(value: any) {
  return !isEmpty(value);
}
