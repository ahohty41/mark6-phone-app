import { ColorDistribution, BankerConfig, MultipleConfig } from '../types/lottery';

/**
 * 根據香港六合彩官方規則返回號碼球顏色
 * 紅色: 1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46
 * 藍色: 3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48
 * 綠色: 5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49
 */
export const RED_BALLS = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46];
export const BLUE_BALLS = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48];
export const GREEN_BALLS = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49];

export const getBallColor = (num: number): string => {
  if (RED_BALLS.includes(num)) return '#FF3B30';
  if (BLUE_BALLS.includes(num)) return '#007AFF';
  if (GREEN_BALLS.includes(num)) return '#34C759';
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

const shuffleArray = <T>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const pickRandom = (pool: number[], count: number, exclude: Set<number> = new Set()): number[] => {
  const available = pool.filter((n) => !exclude.has(n));
  return shuffleArray(available).slice(0, count);
};

export const generateColorConstrainedNumbers = (
  colors: ColorDistribution,
  exclude: Set<number> = new Set(),
): number[] => {
  const reds = pickRandom(RED_BALLS, colors.red, exclude);
  const usedSoFar = new Set([...exclude, ...reds]);
  const blues = pickRandom(BLUE_BALLS, colors.blue, usedSoFar);
  blues.forEach((n) => usedSoFar.add(n));
  const greens = pickRandom(GREEN_BALLS, colors.green, usedSoFar);
  return [...reds, ...blues, ...greens].sort((a, b) => a - b);
};

export const generateBankerNumbers = (
  config: BankerConfig,
  useColorFilter = true,
): { bankers: number[]; players: number[] } => {
  if (useColorFilter) {
    const bankers = generateColorConstrainedNumbers(config.bankerColors);
    const bankerSet = new Set(bankers);
    const players = generateColorConstrainedNumbers(config.playerColors, bankerSet);
    return { bankers, players };
  }
  const all = shuffleArray(Array.from({ length: 49 }, (_, i) => i + 1));
  const bankers = all.slice(0, config.bankerCount).sort((a, b) => a - b);
  const players = all.slice(config.bankerCount, config.bankerCount + config.playerCount).sort((a, b) => a - b);
  return { bankers, players };
};

export const generateMultipleNumbers = (config: MultipleConfig, useColorFilter = true): number[] => {
  if (useColorFilter) {
    return generateColorConstrainedNumbers(config.colors);
  }
  const all = shuffleArray(Array.from({ length: 49 }, (_, i) => i + 1));
  return all.slice(0, config.totalCount).sort((a, b) => a - b);
};

export const distributeColors = (total: number): ColorDistribution => {
  const maxRed = RED_BALLS.length;   // 17
  const maxBlue = BLUE_BALLS.length; // 16
  const maxGreen = GREEN_BALLS.length; // 16

  const base = Math.floor(total / 3);
  let remainder = total - base * 3;

  let red = Math.min(base, maxRed);
  let blue = Math.min(base, maxBlue);
  let green = Math.min(base, maxGreen);

  // Distribute remainder: red first, then blue, then green
  if (remainder > 0 && red < maxRed) { red++; remainder--; }
  if (remainder > 0 && blue < maxBlue) { blue++; remainder--; }
  if (remainder > 0 && green < maxGreen) { green++; remainder--; }

  return { red, blue, green };
};
