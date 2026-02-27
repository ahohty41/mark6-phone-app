/**
 * 根據香港六合彩官方規則返回號碼球顏色
 * 紅色: 1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46
 * 藍色: 3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48
 * 綠色: 5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49
 */
export const getBallColor = (num: number): string => {
  const red = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46];
  const blue = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48];
  const green = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49];

  if (red.includes(num)) return '#FF3B30'; // 官方紅
  if (blue.includes(num)) return '#007AFF'; // 官方藍
  if (green.includes(num)) return '#34C759'; // 官方綠
  return '#999999';
};

export const generateMarkSixNumbers = (): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < 6) {
    const randomNum = Math.floor(Math.random() * 49) + 1;
    numbers.add(randomNum);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};
