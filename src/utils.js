/**
 * Convert the color in &HAARRGGBB format to #RRGGBBAA format
 * @param color
 */
export function convertAiColor(color) {
  return '#' + color.substring(4, 10) + color.substring(2, 4);
}
