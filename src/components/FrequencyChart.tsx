import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { DrawResult } from '../types/lottery';
import { getBallColor } from '../utils/lotteryUtils';
import { Ball } from './Ball';

interface FrequencyChartProps {
  draws: DrawResult[];
}

const MAX_BAR_HEIGHT = 150;

const COLOR_MAP: { label: string; color: string; nums: number[] }[] = [
  { label: '紅波', color: '#FF3B30', nums: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46] },
  { label: '藍波', color: '#007AFF', nums: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48] },
  { label: '綠波', color: '#34C759', nums: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49] },
];

export const FrequencyChart: React.FC<FrequencyChartProps> = React.memo(
  ({ draws }) => {
    const frequencies = useMemo(() => {
      const counts = new Array(50).fill(0);
      for (const draw of draws) {
        for (const num of draw.numbers) {
          counts[Number(num)]++;
        }
        counts[Number(draw.extraNumber)]++;
      }
      return counts;
    }, [draws]);

    const maxCount = useMemo(
      () => Math.max(1, ...frequencies.slice(1)),
      [frequencies],
    );

    const top10 = useMemo(() => {
      return Array.from({ length: 49 }, (_, i) => i + 1)
        .map((num) => ({ num, count: frequencies[num] }))
        .sort((a, b) => b.count - a.count || a.num - b.num)
        .slice(0, 10);
    }, [frequencies]);

    const colorStats = useMemo(() => {
      const totalBalls = draws.length * 7; // 6 numbers + 1 extra per draw
      return COLOR_MAP.map(({ label, color, nums }) => {
        const count = nums.reduce((sum, n) => sum + frequencies[n], 0);
        const pct = totalBalls > 0 ? (count / totalBalls) * 100 : 0;
        return { label, color, count, pct };
      });
    }, [frequencies, draws.length]);

    return (
      <View>
        {/* Bar Chart */}
        <Text style={styles.sectionTitle}>號碼頻率分佈</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chartContainer}
          nestedScrollEnabled
        >
          {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => {
            const count = frequencies[num];
            const barHeight = (count / maxCount) * MAX_BAR_HEIGHT;
            const color = getBallColor(num);
            return (
              <View key={num} style={styles.barColumn}>
                <Text style={styles.countLabel}>{count}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      { height: barHeight, backgroundColor: color },
                    ]}
                  />
                </View>
                <Text style={styles.numLabel}>
                  {String(num).padStart(2, '0')}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Top 10 */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>最熱門 10 個號碼</Text>
        <View style={styles.top10Grid}>
          {top10.map(({ num, count }, index) => (
            <View key={num} style={styles.top10Item}>
              <Text style={styles.rankLabel}>#{index + 1}</Text>
              <View style={styles.top10BallWrapper}>
                <Ball number={num} />
              </View>
              <Text style={styles.top10Count}>{count} 次</Text>
            </View>
          ))}
        </View>

        {/* Color Stats */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>色波統計</Text>
        <View style={styles.colorStatsContainer}>
          {colorStats.map(({ label, color, count, pct }) => (
            <View key={label} style={styles.colorRow}>
              <View style={styles.colorLabelRow}>
                <View style={[styles.colorDot, { backgroundColor: color }]} />
                <Text style={styles.colorLabel}>{label}</Text>
                <Text style={styles.colorCount}>{count} 次</Text>
                <Text style={styles.colorPct}>{pct.toFixed(1)}%</Text>
              </View>
              <View style={styles.pctBarTrack}>
                <View
                  style={[
                    styles.pctBar,
                    { width: `${pct}%`, backgroundColor: color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#fcd34d',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    marginVertical: 14,
  },
  // Bar Chart
  chartContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  barColumn: {
    alignItems: 'center',
    marginHorizontal: 2,
    width: 24,
  },
  countLabel: {
    color: 'rgba(252, 211, 77, 0.8)',
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 3,
  },
  barTrack: {
    height: MAX_BAR_HEIGHT,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 16,
    borderRadius: 3,
    minHeight: 2,
  },
  numLabel: {
    color: 'rgba(252, 211, 77, 0.6)',
    fontSize: 8,
    fontWeight: '600',
    marginTop: 4,
  },
  // Top 10
  top10Grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  top10Item: {
    alignItems: 'center',
    width: 58,
    backgroundColor: 'rgba(69, 10, 10, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 6,
  },
  rankLabel: {
    color: 'rgba(252, 211, 77, 0.5)',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  top10BallWrapper: {
    transform: [{ scale: 0.55 }],
    marginVertical: -10,
  },
  top10Count: {
    color: 'rgba(252, 211, 77, 0.8)',
    fontSize: 11,
    fontWeight: '600',
  },
  // Color Stats
  colorStatsContainer: {
    gap: 10,
  },
  colorRow: {
    backgroundColor: 'rgba(69, 10, 10, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    padding: 12,
  },
  colorLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  colorLabel: {
    color: '#fcd34d',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  colorCount: {
    color: 'rgba(252, 211, 77, 0.7)',
    fontSize: 13,
    marginRight: 8,
  },
  colorPct: {
    color: '#fcd34d',
    fontSize: 14,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'right',
  },
  pctBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  pctBar: {
    height: 6,
    borderRadius: 3,
  },
});
