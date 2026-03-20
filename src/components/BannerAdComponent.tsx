import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { isExpoGo, AD_UNIT_IDS } from '../utils/adConfig';

export function BannerAdComponent() {
  const [adsReady, setAdsReady] = useState(false);

  useEffect(() => {
    if (isExpoGo) return;
    let mounted = true;
    const init = async () => {
      try {
        const mobileAds = require('react-native-google-mobile-ads').default;
        await mobileAds().initialize();
        if (mounted) setAdsReady(true);
      } catch (error) {
        console.warn('Failed to initialize mobile ads:', error);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  if (isExpoGo) {
    return (
      <View style={[styles.container, styles.mockContainer]}>
        <View style={styles.mockInner}>
          <Text style={styles.mockBadge}>Test Ad</Text>
          <Text style={styles.mockText}>Adaptive Banner Placeholder</Text>
          <Text style={styles.mockSubtext}>(Ads only show on native builds)</Text>
        </View>
      </View>
    );
  }

  if (!adsReady) {
    return <View style={styles.container} />;
  }

  try {
    const { BannerAd, BannerAdSize } = require('react-native-google-mobile-ads');

    return (
      <View style={styles.container}>
        <BannerAd
          unitId={AD_UNIT_IDS.banner}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
          onAdFailedToLoad={(error: any) => {
            console.warn('Banner ad failed to load:', error);
          }}
        />
      </View>
    );
  } catch (error) {
    console.warn('Failed to load ad module:', error);
    return <View />;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(69, 10, 10, 0.95)',
    width: '100%',
  },
  mockContainer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  mockInner: {
    width: '90%',
    height: 60,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  mockBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#4b5563',
    color: 'white',
    fontSize: 10,
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  mockText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mockSubtext: {
    color: '#6b7280',
    fontSize: 11,
  },
});
