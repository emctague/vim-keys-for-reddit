#!/bin/sh

xcodebuild archive -scheme "Vim Keys for Reddit" -archivePath vkfr-archive CODE_SIGNING_REQUIRED=NO SWIFT_VERSION=5 CODE_SIGNING_IDENTITY="travis_dist_key.p12"
xcodebuild -archivePath vkfr-archive.xcarchive -exportArchive -exportOptionsPlist ExportOptions.plist -exportPath .
zip Vim.Keys.for.Reddit.zip "Vim Keys for Reddit.app"
