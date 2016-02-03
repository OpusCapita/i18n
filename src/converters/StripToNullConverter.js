import Converter from './Converter';
export default class StripToNullConverter extends Converter {
  valueToString(value) {
    if (value) {
      return value;
    }

    return '';
  }

  stringToValue(string) {
    if (string) {
      return string;
    }

    return null;
  }
}
