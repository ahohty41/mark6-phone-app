import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getBallColor } from '../utils/lotteryUtils';

interface BallProps {
  number: number;
}

/**
 * 中式燈籠造型的號碼容器
 * 參考 assets/code.html 的設計
 */
export const Ball: React.FC<BallProps> = React.memo(({ number }) => {
  const baseColor = getBallColor(number);

  // 根據馬會顏色生成漸變深色
  const getDarkerColor = (color: string) => {
    if (color === '#FF3B30') return '#7f1d1d'; // 深紅
    if (color === '#007AFF') return '#1e3a8a'; // 深藍
    if (color === '#34C759') return '#064e3b'; // 深綠
    return '#333';
  };

  const darkerColor = getDarkerColor(baseColor);

  return (
    <View style={styles.container}>
      {/* 燈籠主體 */}
      <View style={[styles.lantern, { backgroundColor: baseColor, borderColor: '#d4af37' }]}>
        {/* 燈籠頂部金蓋 */}
        <View style={styles.goldCapTop} />

        {/* 垂直條紋效果 */}
        <View style={styles.stripe} />

        <Text style={styles.text}>{number}</Text>

        {/* 燈籠底部金蓋 */}
        <View style={styles.goldCapBottom} />
      </View>

      {/* 燈籠下方的掛線與流蘇 */}
      <View style={styles.string} />
      <View style={[styles.tassel, { backgroundColor: baseColor }]} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 25,
  },
  lantern: {
    width: 50,
    height: 65,
    borderRadius: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    position: 'relative',
  },
  goldCapTop: {
    position: 'absolute',
    top: -4,
    width: '60%',
    height: 6,
    backgroundColor: '#d4af37',
    borderRadius: 2,
  },
  goldCapBottom: {
    position: 'absolute',
    bottom: -4,
    width: '60%',
    height: 6,
    backgroundColor: '#d4af37',
    borderRadius: 2,
  },
  stripe: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.15)',
    left: '48%',
  },
  text: {
    color: '#fcd34d', // Gold light
    fontSize: 24,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    zIndex: 10,
  },
  string: {
    width: 2,
    height: 12,
    backgroundColor: '#d4af37',
  },
  tassel: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
});
