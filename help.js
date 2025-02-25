/*
git clone https://github.com/macontouch/NoteBook.git
git clone https://github.com/macontouch/picarrange.git
git add .
git commit -m "data.json updated"
git push origin main

git clone https://github.com/macontouch/NoteBook.git
git clone https://github.com/macontouch/picarrange.git
git add .
git commit -m "data.json updated"
git push origin main


ca-app-pub-5705659618300152~3727789761
ca-app-pub-5705659618300152/5867740083

npx create-expo-app --template


npm uninstall -g expo-cli
add dependencies - 
-------------------
"dependencies": {
    "expo": "^48.0.0",
    "expo-ads-admob": "~13.0.0",
    "react": "18.2.0",
    "react-native": "0.71.7"
  }
  --------------------
npm install

npx expo install expo-dev-client
npm install react-native-google-mobile-ads


set NODE_TLS_REJECT_UNAUTHORIZED=0
npx expo install expo-dev-client


{
  "react-native-google-mobile-ads": {
    "android_app_id": "ca-app-pub-xxxxxxxx~xxxxxxxx",
    "ios_app_id": "ca-app-pub-xxxxxxxx~xxxxxxxx"
  }
}

import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
<BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />




eas login
eas build --profile development --platform android
npx expo start --dev-client


*/