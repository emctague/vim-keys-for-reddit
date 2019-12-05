#!/bin/sh

xcodebuild archive -scheme "Vim Keys for Reddit" -archivePath vkfr-archive CODE_SIGNING_REQUIRED=NO SWIFT_VERSION=5
xcodebuild -archivePath vkfr-archive.xcarchive -exportArchive -exportOptionsPlist ExportOptions.plist -exportPath .
zip Vim.Keys.for.Reddit.zip "Vim Keys for Reddit.app"