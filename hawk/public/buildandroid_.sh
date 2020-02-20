#!/bin/bash
export GRADLE_HOME=/Users/wx/gradle
export PATH=$PATH:$GRADLE_HOME/bin
./add_plugin.sh
cordova platform add android
cordova build android --release
cp /Users/wx/code/release/hawk/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk public/hawk-v1.7.0.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore public/release-key.keystore public/hawk-v1.7.0.apk sanfan
