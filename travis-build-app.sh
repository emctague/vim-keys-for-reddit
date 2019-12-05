#!/bin/sh

security create-keychain -p travis mac-build.keychain
security default-keychain -s mac-build.keychain
security unlock-keychain -p travis mac-build.keychain
security import ./travis_dist_key.p12 -k mac-build.keychain -P $KEY_PASSWORD -T /usr/bin/codesign

xcodebuild archive -scheme "Vim Keys for Reddit" -archivePath vkfr-archive CODE_SIGNING_REQUIRED=NO SWIFT_VERSION=5
xcodebuild -archivePath vkfr-archive.xcarchive -exportArchive -exportOptionsPlist ExportOptions.plist -exportPath .
zip Vim.Keys.for.Reddit.zip "Vim Keys for Reddit.app"
