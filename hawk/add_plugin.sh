#!/bin/bash

cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-splashscreen
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-signature-fingerprint
cordova plugin add ./plugins_package/cordova-amap-track --variable ANDROID_KEY=eda43c649b80196eb1785a12923f0170 --variable IOS_KEY=438c6772edcd551edea44660d82f781e
#cordova plugin add cordova-call
cordova plugin add https://github.com/sanfanerp/CordovaCall.git
cordova plugin add cordova-plugin-permission
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-local-notification
cordova plugin add cordova-open-native-settings
cordova plugin add cordova-plugin-alipay-v2 --variable APP_ID=2019052265302664
cordova plugin add ./cordova-plugin-wechat-master --variable WECHATAPPID=wx57df763c831755ab
cordova plugin add cordova-plugin-calllog
#cordova plugin add jpush-phonegap-plugin --variable APP_KEY=f4670bd35855482ce09f4b28
cordova plugin add cordova-plugin-file-downloader
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-file-transfer
cordova plugin add cordova-plugin-file-opener2
cordova plugin add https://github.com/sanfanerp/cordova-plugin-auto-update.git
cordova plugin add cordova-media-with-compression
#cordova plugin add cordova.plugins.diagnostic --variable ANDROID_SUPPORT_VERSION=27.+
cordova plugin add ./plugins_package/cordova-plugin-xgpush --variable ACCESS_ID="2100334387" --variable ACCESS_KEY="A6TD6644RGXT" --variable IOS_ACCESS_ID="2200334388" --variable IOS_ACCESS_KEY="IN3A3A43EN6X"
cordova plugin add phonegap-plugin-barcodescanner
