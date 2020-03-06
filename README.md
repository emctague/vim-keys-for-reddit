<img src="http://cdn.jsdelivr.net/gh/emctague/vim-keys-for-reddit/Vim%20Keys%20for%20Reddit/Assets.xcassets/AppIcon.appiconset/Artboard%201%40256.png" align="right" width="150"/>

# Vim Keys for Reddit

This is a minimal Safari clone of the [Reddit Enhancement Suite](https://redditenhancementsuite.com).
Unfortunately, the Reddit Enhancement Suite doesn't support Safari - so this project introduces support.

##  [Install Latest Version](https://github.com/emctague/vim-keys-for-reddit/releases/latest/download/Vim.Keys.for.Reddit.zip)

You can download the latest version [here](https://github.com/emctague/vim-keys-for-reddit/releases/latest). Install it by downloading, unzipping, and then dragging it to your Applications folder. Make sure it's enabled in your Safari extension settings, too!

## Supported Keyboard Shortcuts

* `j`  -  Navigate down one post / comment.
* `k`  -  Navigate up one post / comment.
* `J`  -  Navigate down one post/comment at the same level (skipping over replies to the current comment.)
* `K`  -  Navigate up one post/comment at the same level (skipping over replies to the previous comment.)
* `a`, `A`  -  Upvote the current post / comment.
* `z`, `Z`  -  Downvote the current post / comment.
* `c`  -  Open the comment section for the current post.
* `C`  -  Open the comment section for the current post in a new tab.
* `l`  -  Open the comment section *and* linked URL for the current post in new tabs.
* `x`  -  Expand/collapse an expando or comment, or load more comments on a "Load more comments" link.

## Differences from RES Behavior

* The first post / comment on the page is automatically focused when the page loads. On RES, the first time you press `j` or `k` it'd select the first post, instead.

* There is no infinite scrolling for the time being, which is unfortunate. Sorry!

* Once you've expanded an expando with `x`, navigating with `j` and `k` *won't* cause other expandos to automatically expand.

* The enter key cannot be used to collapse or expand comments and expandos.

* Pressing `c`  or `C` on a comment will open the permalink page for that comment.

* There are quirks in navigation after additional comments have been loaded via a "load more comments" link.

## Licensing

Vim Keys for Reddit is licensed under the MIT license. See [LICENSE](LICENSE) for details.

## Contributors

* [Ethan McTague](https://github.com/emctague) - Main project
* [cpiro](https://github.com/cpiro) - contributed `l` key binding functionality!
