export type Zodiac = 'rat' | 'ox' | 'tiger' | 'rabbit' | 'dragon' | 'snake' | 'horse' | 'goat' | 'monkey' | 'rooster' | 'dog' | 'pig';
export type ChineseHour = 'zi' | 'chou' | 'yin' | 'mao' | 'chen' | 'si' | 'wu' | 'wei' | 'shen' | 'you' | 'xu' | 'hai';

// 2025 蛇年號碼對照
const ZODIAC_NUMBERS: Record<Zodiac, number[]> = {
  snake:   [1, 13, 25, 37, 49],
  dragon:  [2, 14, 26, 38],
  rabbit:  [3, 15, 27, 39],
  tiger:   [4, 16, 28, 40],
  ox:      [5, 17, 29, 41],
  rat:     [6, 18, 30, 42],
  pig:     [7, 19, 31, 43],
  dog:     [8, 20, 32, 44],
  rooster: [9, 21, 33, 45],
  monkey:  [10, 22, 34, 46],
  goat:    [11, 23, 35, 47],
  horse:   [12, 24, 36, 48],
};

const HOUR_ZODIAC: Record<ChineseHour, Zodiac> = {
  zi:   'rat',
  chou: 'ox',
  yin:  'tiger',
  mao:  'rabbit',
  chen: 'dragon',
  si:   'snake',
  wu:   'horse',
  wei:  'goat',
  shen: 'monkey',
  you:  'rooster',
  xu:   'dog',
  hai:  'pig',
};

export function getZodiacNumbers(zodiac: Zodiac): number[] {
  return ZODIAC_NUMBERS[zodiac];
}

export function getHourZodiac(hour: ChineseHour): Zodiac {
  return HOUR_ZODIAC[hour];
}

export function generateZodiacNumbers(zodiac: Zodiac, hour: ChineseHour): number[] {
  const zodiacNums = new Set(getZodiacNumbers(zodiac));
  const hourZodiac = getHourZodiac(hour);
  const hourNums = new Set(getZodiacNumbers(hourZodiac));

  // Build weighted pool: zodiac 3x, hour 2x, others 1x
  const weighted: number[] = [];
  for (let i = 1; i <= 49; i++) {
    const count = zodiacNums.has(i) ? 3 : hourNums.has(i) ? 2 : 1;
    for (let j = 0; j < count; j++) {
      weighted.push(i);
    }
  }

  const result = new Set<number>();
  while (result.size < 6) {
    const idx = Math.floor(Math.random() * weighted.length);
    result.add(weighted[idx]);
  }
  return Array.from(result).sort((a, b) => a - b);
}

export const ZODIAC_LIST: { key: Zodiac; emoji: string }[] = [
  { key: 'rat',     emoji: '🐀' },
  { key: 'ox',      emoji: '🐂' },
  { key: 'tiger',   emoji: '🐅' },
  { key: 'rabbit',  emoji: '🐇' },
  { key: 'dragon',  emoji: '🐉' },
  { key: 'snake',   emoji: '🐍' },
  { key: 'horse',   emoji: '🐴' },
  { key: 'goat',    emoji: '🐏' },
  { key: 'monkey',  emoji: '🐒' },
  { key: 'rooster', emoji: '🐓' },
  { key: 'dog',     emoji: '🐕' },
  { key: 'pig',     emoji: '🐖' },
];

export const HOUR_LIST: { key: ChineseHour; time: string }[] = [
  { key: 'zi',   time: '23-01' },
  { key: 'chou', time: '01-03' },
  { key: 'yin',  time: '03-05' },
  { key: 'mao',  time: '05-07' },
  { key: 'chen', time: '07-09' },
  { key: 'si',   time: '09-11' },
  { key: 'wu',   time: '11-13' },
  { key: 'wei',  time: '13-15' },
  { key: 'shen', time: '15-17' },
  { key: 'you',  time: '17-19' },
  { key: 'xu',   time: '19-21' },
  { key: 'hai',  time: '21-23' },
];
