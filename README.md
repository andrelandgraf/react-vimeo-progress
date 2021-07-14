# React vimeo Progress

A lean responsive wrapper around the [vimeo player](https://github.com/vimeo/player.js). This packages exposes a single `VimeoPlayer` component and simplifies user progress tracking.

## vimeo Player

vimeo is a great platform to host your company's or private videos and the player can be integrated easily into your React application.

## Considerations 🤔

There are a few things you should know before installing this package or the original vimeo player.

### vimeo Platform 💸

The vimeo player only works with videos hosted on [vimeo.com](https://vimeo.com/).

The pricing on vimeo is fair and competitive but there are different pricing tiers and you should have a look before installing this component.

### Cookies 🍪

The vimeo player uses cookies to track several analytics data points for you to access on the vimeo platform.

The cookies are also used to offer logged-in vimeo users social features (like, comment) right from your embedded video player (which you can disable on vimeo.com).

This is no other than what the embedded YouTube player is doing but you should be aware that vimeo uses cookies as third-party cookies are [regulated](https://gdpr.eu/cookies/) in several regions.

### Responsivness 📱

The official vimeo player package offers responsive height and width options and user progress tracking is very straight forward to implement. I would first try to make the offical package work. I personally ran into issues with the progressive feature. Feel free to get inspired by the code on [GitHub](https://github.com/andrelandgraf/react-vimeo-progress) or just install this package if it solves your issues with the offical player!

## Installation

```bash
npm i react-vimeo-progress
```

## Documentation 📖

This component tracks user progress and allows progressive breakpoints.

It is built with TypeScript and should be typed out of the box.

The VimeoPlayer component can be imported like so:

```ts
import VimeoPlayer from 'react-vimeo-progress';
```

The component takes the following properties:

-   id: string
-   link: string
-   progressInterval?: number
-   onProgress?: (progress: number) => void
-   onVideoEnded?: () => void
-   latestProgress?: number
-   widthPercentage?: number
-   smWidthPercentage?: number
-   mdWidthPercentage?: number
-   lgWidthPercentage?: number
-   xlWidthPercentage?: number
-   maxWidth?: number
-   vimeoOptions?: any
-   className?: string

### id (required)

A unique id that is passed to the div which vimeo will use to load the player into.

-   example value: `"product-introduction-video"`

### link (required)

The URL to your video hosted on vimeo (both private and public videos are supported as long as your domain is whitelisted).

-   example value: `"https://vimeo.com/:id"` or `"https://vimeo.com/:account/:id"`

### progressInterval (optional)

How often do you want the callback function `onProgress` to be called?

-   default is 10 seconds
-   example value: `10000` // 10000ms === 10 seconds

### onProgress (optional)

The callback function which will be fired every progressInterveral milliseconds.

Example implementation:

```ts
const handleProgress = useCallback((progress: number) => {
    console.log(`The user has watched ${progress}% of the video!`);
});
```

### onVideoEnded (optional)

Will be called once when the user finished watching the video. `onVideoEnded` is handy for progress tracking.

### widthPercentage (optional)

The default widthPercentage the vimeo player should take on the screen.

-   default is 90%
-   example value: `0.6` (for 60% of the screen size)

### smWidthPercentage (optional)

Width percentage for small screens (takes over default).

Be aware that `0` will be treated as a falsy value and the default width will be used instead.
If you want to hide this player for a certain width, you have to do it yourself!

-   default is `undefined` (widthPercentage is used)
-   example value: `0.9` (for 90% of the screen size)

### mdWidthPercentage (optional)

Width percentage for medium-sized screens (takes over default)

Be aware that `0` will be treated as a falsy value and the default width will be used instead.
If you want to hide this player for a certain width, you have to do it yourself!

-   default is `undefined` (widthPercentage is used)
-   example value: `0.7` (for 70% of the screen size)

### lgWidthPercentage (optional)

Width percentage for large screens (takes over default)

Be aware that `0` will be treated as a falsy value and the default width will be used instead.
If you want to hide this player for a certain width, you have to do it yourself!

-   default is `undefined` (widthPercentage is used)
-   example value: `0.6` (for 60% of the screen size)

### xlWidthPercentage (optional)

Width percentage for extra large screens (takes over default)

Be aware that `0` will be treated as a falsy value and the default width will be used instead.
If you want to hide this player for a certain width, you have to do it yourself!

-   default is `undefined` (widthPercentage is used)
-   example value: `0.5` (for 50% of the screen size)

### maxWidth (optional)

A maximum width that the player should not exceed.

-   default is none
-   example value: `1200` (the player will not exceed 1200px)

### vimeoOptions (optional)

The vimeo player takes an options property which allows further configuration.

Find the documentation here: [embed options](https://github.com/vimeo/player.js#embed-options).

Please be aware that this object is typed as `any` since [vimeo does not officially support TypeScript](https://github.com/vimeo/player.js/discussions/679) and the current @types are outdated 😢.

I hope in the future, I can type this as `Options` and also expose the `Options` interface from the vimeo package.

### className (optional)

A string of classes you want to pass on.

If you don't know how the `className` property works, find more information [here](https://reactjs.org/docs/faq-styling.html).
