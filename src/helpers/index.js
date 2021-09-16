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
  if (array.length === 1) return numberWithCommas(number.toString());
  if (precision === 0) return numberWithCommas(array[0].toString());

  array.push(array.pop().substring(0, precision));
  const trimmedNumber = numberWithCommas(array.join("."));
  
  return trimmedNumber;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * computes width of viewport for a `given containerRef`
 * @return {Float}
 */
export const getViewWidth = (containerRef) => {
  var element = containerRef.current;
  var styles = window.getComputedStyle(element);
  var padding = parseFloat(styles.paddingLeft) +
                parseFloat(styles.paddingRight);

  return element.clientWidth - padding;
};

export const heightFromAspectRatio = (width, aspectRatio) => {
  const height = width/(aspectRatio);
  return height;
};