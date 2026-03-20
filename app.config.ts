import { ExpoConfig, ConfigContext } from 'expo/config';

const { version } = require('./package.json');

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'MarkSixLuckyDraw',
  slug: 'mark6-phone-app',
  version,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#450a0a',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ahohty.marksixluckydraw',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSUserTrackingUsageDescription:
        'This identifier will be used to deliver personalized ads to you.',
      SKAdNetworkItems: [
        { SKAdNetworkIdentifier: 'cstr6suwn9.skadnetwork' },
        { SKAdNetworkIdentifier: '4fzdc2evr5.skadnetwork' },
        { SKAdNetworkIdentifier: '2fnua5tdw4.skadnetwork' },
        { SKAdNetworkIdentifier: 'ydx93a7ass.skadnetwork' },
        { SKAdNetworkIdentifier: '5a6flpkh64.skadnetwork' },
        { SKAdNetworkIdentifier: 'p78aez3dca.skadnetwork' },
        { SKAdNetworkIdentifier: 'v72qych5uu.skadnetwork' },
        { SKAdNetworkIdentifier: 'c6k4g5qg8m.skadnetwork' },
        { SKAdNetworkIdentifier: 's39g8k73mm.skadnetwork' },
        { SKAdNetworkIdentifier: '3qy4746246.skadnetwork' },
        { SKAdNetworkIdentifier: '3sh42y64q3.skadnetwork' },
        { SKAdNetworkIdentifier: 'f38h382jlk.skadnetwork' },
        { SKAdNetworkIdentifier: 'hs6bdukanm.skadnetwork' },
        { SKAdNetworkIdentifier: 'prcb7njmu6.skadnetwork' },
        { SKAdNetworkIdentifier: 'v4nxqhlyqp.skadnetwork' },
        { SKAdNetworkIdentifier: 'wzmmz9fp6w.skadnetwork' },
        { SKAdNetworkIdentifier: 'yclnxrl5pm.skadnetwork' },
        { SKAdNetworkIdentifier: 't38b2kh725.skadnetwork' },
        { SKAdNetworkIdentifier: '7ug5zh24hu.skadnetwork' },
        { SKAdNetworkIdentifier: '9rd848q77k.skadnetwork' },
        { SKAdNetworkIdentifier: 'n6fk4nfna4.skadnetwork' },
        { SKAdNetworkIdentifier: 'kbd757ywx3.skadnetwork' },
        { SKAdNetworkIdentifier: '9t245vhmpl.skadnetwork' },
        { SKAdNetworkIdentifier: '4468km3ulz.skadnetwork' },
        { SKAdNetworkIdentifier: '2u9pt9hc89.skadnetwork' },
        { SKAdNetworkIdentifier: '8s468mfl3y.skadnetwork' },
        { SKAdNetworkIdentifier: 'av6w8kgt66.skadnetwork' },
        { SKAdNetworkIdentifier: 'klf5c3l5u5.skadnetwork' },
        { SKAdNetworkIdentifier: 'ppxm28t8ap.skadnetwork' },
        { SKAdNetworkIdentifier: '424m5254lk.skadnetwork' },
        { SKAdNetworkIdentifier: 'uw77j35x4d.skadnetwork' },
        { SKAdNetworkIdentifier: '578prtvx9j.skadnetwork' },
        { SKAdNetworkIdentifier: '4dzt52r2t5.skadnetwork' },
        { SKAdNetworkIdentifier: 'e5fvkxwrpn.skadnetwork' },
        { SKAdNetworkIdentifier: '8c4e2ghe7u.skadnetwork' },
        { SKAdNetworkIdentifier: 'zq492l623r.skadnetwork' },
        { SKAdNetworkIdentifier: '3rd42ekr43.skadnetwork' },
        { SKAdNetworkIdentifier: '3qcr597p9d.skadnetwork' },
      ],
    },
  },
  android: {
    package: 'com.ahohty.marksixluckydraw',
    versionCode: 9,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#450a0a',
    },
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID,
        iosAppId: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID,
        delay_app_measurement_init: true,
        user_tracking_usage_description:
          'This identifier will be used to deliver personalized ads to you.',
      },
    ],
    [
      'expo-build-properties',
      {
        ios: { newArchEnabled: false },
      },
    ],
    'expo-tracking-transparency',
    [
      'expo-font',
      {
        fonts: [
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf',
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf',
        ],
      },
    ],
  ],
  extra: {
    eas: {
      projectId: '1f49928d-5c38-422e-9a8b-79249c918f63',
    },
  },
  owner: 'ahohty',
});
