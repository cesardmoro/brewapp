jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /home/cmoro/www/brewapp/brewkey.keystore /home/cmoro/www/brewapp/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk brew-o-matic

$ANDROID_HOME/build-tools/29.0.2/zipalign -v 4 app-release-unsigned.apk brew-o-matic.apk

password keystore: Birra15
