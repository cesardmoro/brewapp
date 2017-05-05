cd c:/www/brewapp
cordova build --release android
cd C:\www\brewapp\platforms\android\build\outputs\apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore brewkey.keystore android-release-unsigned.apk brew-o-matic
%ANDROID_HOME%\build-tools\23.0.3\zipalign -v 4 android-release-unsigned.apk brew-o-matic.apk
 