#!/bin/sh

echo "Checking for proper branch..."
if [ "$AGENT_JOBSTATUS" == "Succeeded" ] && [ "$APPCENTER_BRANCH" == "master" ]; then

    echo "Zipping .app for distribution..."
    #cd $APPCENTER_OUTPUT_DIRECTORY
    #zip VKFR.zip "Vim Keys for Reddit.app"

    echo "Creating GitHub release..."
    UP_URL=`curl -v -i -X POST -H "Content-Type:application/json" -H "Authorization: token $GITHUB_AUTH_TOKEN" https://api.github.com/repos/emctague/vim-keys-for-reddit/releases -d '{"tag_name":"'$APPCENTER_BUILD_ID'","target_commitish": "'$APPCENTER_BRANCH'", "name": "'$APPCENTER_BUILD_ID'","body": "NEW RELEASE","draft": true,"prerelease": false}' | perl -n -e'/.\"upload_url\": \"(.+)\{.+/ && print $1'`

    echo "Uploading app..."
    curl -H "Authorization: token $GITHUB_AUTH_TOKEN" -H "Content-Type:application/octet-stream" --data-binary "@$APPCENTER_OUTPUT_DIRECTORY/Vim Keys for Reddit_distribution.zip" "$UP_URL?name=Vim.Keys.for.Reddit.zip"

    echo "Done!"

fi
