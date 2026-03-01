import Constants from 'expo-constants';

// Expo Go cannot load native ad modules
export const isExpoGo = Constants.appOwnership === 'expo';

const TEST_BANNER = 'ca-app-pub-3940256099942544/6300978111';
const TEST_INTERSTITIAL = 'ca-app-pub-3940256099942544/1033173712';

export const AD_UNIT_IDS = {
  banner: __DEV__
    ? TEST_BANNER
    : 'ca-app-pub-8422835846268677/8780492501',
  interstitial: __DEV__
    ? TEST_INTERSTITIAL
    : 'ca-app-pub-8422835846268677/8812640887',
};

// Show interstitial every N generates
export const INTERSTITIAL_FREQUENCY = 5;
