/**
 * trims a Float to `precision` number of decimals
 * @param {Float} number a Float that you want to trim
 * @param {Integer} precision number of decimals that you want
 * @returns {String} trimmedNumber, i.e. `trim(10.012345, 2) => '10.01'`
 */
 export function trim(number, precision) {
  if (number === undefined) {
    number = 0;
  }
  const array = number.toString().split(".");
  if (array.length === 1) return number.toString();
  if (precision === 0) return array[0].toString();

  array.push(array.pop().substring(0, precision));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
}