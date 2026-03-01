import React from 'react';
import { View, StyleSheet } from 'react-native';
import { isExpoGo, AD_UNIT_IDS } from '../utils/adConfig';

export function BannerAdComponent() {
  if (isExpoGo) return null;

  // Dynamic require so Expo Go never loads the native module
  const { BannerAd, BannerAdSize } = require('react-native-google-mobile-ads');

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={AD_UNIT_IDS.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(69, 10, 10, 0.95)',
  },
});
