type Value = string | number | boolean | null;

/**
 * Coerces the value based on the type provided.
 * Type is based on the resource model data types.
 *
 * @param type
 * @param value
 * @returns
 */
export default function (type: string, value: Value): Value {
  switch (type) {
    case 'data_type_string':
      return `${value}`;
    case 'data_type_number':
      return Number(value);
    case 'data_type_boolean':
      return value === 'true';
    default:
      return null;
  }
}
