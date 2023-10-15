import React, { useEffect, useState, useRef, useMemo } from 'react';
import Player from '@vimeo/player';

/**
 * @param {number} progress The progress in percentage of the video length
 */
type OnProgress = (progress: number) => void;
type OnVideoEnded = () => void;
type OnPause = () => void;

interface VimeoPlayerProps {
    id: string;
    link: string;
    progressInterval?: number;
    onProgress?: OnProgress;
    onPause?: OnPause;
    onVideoEnded?: OnVideoEnded;
    latestProgress?: number;
    /**
     * default width percentage
     */
    widthPercentage?: number;
    /**
     * width percentage for small screens (takes over default)
     * 0 will be treated as undefined. If you want to hide this player for a certain width, you have to do it yourself
     */
    smWidthPercentage?: number;
    /**
     * width percentage for medium-sized screens (takes over default)
     * 0 will be treated as undefined. If you want to hide this player for a certain width, you have to do it yourself
     */
    mdWidthPercentage?: number;
    /**
     * width percentage for large screens (takes over default)
     * 0 will be treated as undefined. If you want to hide this player for a certain width, you have to do it yourself
     */
    lgWidthPercentage?: number;
    /**
     * width percentage for extra large screens (takes over default)
     * 0 will be treated as undefined. If you want to hide this player for a certain width, you have to do it yourself
     */
    xlWidthPercentage?: number;
    /**
     * a max width that the player should not exceed
     */
    maxWidth?: number;
    /**
     * changes to options will not trigger a re-fetch on the vimeo player!
     */
    vimeoOptions?: any;
    className?: string;
}

/**
 * remove event listeners
 * @param {object} player
 */
function removeEventListeners(player?: Player) {
    if (!player) return;
    player.off('ended');
    player.off('pause');
    player.off('play');
}

/**
 * remove interval
 * @param {number} interval
 */
function removeInterval(interval?: number) {
    if (!interval) return;
    window.clearInterval(interval);
}

function decideWidthPercentage(
    width: number,
    widthPercentage?: number,
    smWidthPercentage?: number,
    mdWidthPercentage?: number,
    lgWidthPercentage?: number,
    xlWidthPercentage?: number,
) {
    if (width <= 640) {
        return smWidthPercentage || widthPercentage;
    }
    if (width <= 768) {
        return mdWidthPercentage || widthPercentage;
    }
    if (width <= 1024) {
        return lgWidthPercentage || widthPercentage;
    }
    return xlWidthPercentage || widthPercentage;
}

/**
 * 640×480, 800×600, 960×720, 1024×768, 1280×960,
 * 1400×1050, 1440×1080 , 1600×1200, 1856×1392, 1920×1440, and 2048×1536
 * @param {number} width
 */
function computeRatio(delayedWidth: number, percentage = 0.9, maxWidth?: number) {
    const height = window.innerHeight;
    const computedWidth = delayedWidth - delayedWidth * (1 - percentage);
    const width = maxWidth && maxWidth < computedWidth ? maxWidth : computedWidth;

    if (height <= 480) {
        return width > 640 ? 640 : width;
    }
    if (height <= 600) {
        return width > 800 ? 800 : width;
    }
    if (height <= 720) {
        return width > 960 ? 960 : width;
    }
    if (height <= 768) {
        return width > 1024 ? 1024 : width;
    }
    if (height <= 960) {
        return width > 1280 ? 1280 : width;
    }
    if (height <= 1050) {
        return width > 1400 ? 1400 : width;
    }
    if (height <= 1080) {
        return width > 1440 ? 1440 : width;
    }
    if (height <= 1200) {
        return width > 1600 ? 1600 : width;
    }
    if (height <= 1392) {
        return width > 1856 ? 1856 : width;
    }
    if (height <= 1440) {
        return width > 1920 ? 1920 : width;
    }
    if (height <= 1536) {
        return width > 2048 ? 2048 : width;
    }
    return width;
}

const VimeoPlayer: React.FC<VimeoPlayerProps> = ({
    id,
    link,
    progressInterval = 10000, // track every next 10 seconds of progress
    onProgress,
    onPause,
    onVideoEnded,
    latestProgress = 0,
    widthPercentage = 0.9,
    smWidthPercentage,
    mdWidthPercentage,
    lgWidthPercentage,
    xlWidthPercentage,
    maxWidth,
    vimeoOptions = {},
    className,
}) => {
    const [width, setWidth] = useState(0);
    const [delayedWidth, setDelayedWidth] = useState(0);
    const timeoutRef = useRef<number | undefined>(undefined);
    const [progress, setProgress] = useState(latestProgress < 1 ? latestProgress : 0);
    const intervalTimeRef = useRef<number>(progressInterval);
    const playerRef = useRef<Player>();
    const intervalRef = useRef<number>();
    const onPauseRef = useRef<OnPause>();
    const onVideoEndedRef = useRef<OnVideoEnded>();
    const onProgressRef = useRef<OnProgress>();
    const playerWidthPercentage = useMemo(
        () =>
            decideWidthPercentage(
                delayedWidth,
                widthPercentage,
                smWidthPercentage,
                mdWidthPercentage,
                lgWidthPercentage,
                xlWidthPercentage,
            ),
        [delayedWidth, widthPercentage, smWidthPercentage, mdWidthPercentage, lgWidthPercentage, xlWidthPercentage],
    );

    useEffect(() => {
        intervalTimeRef.current = progressInterval;
    }, [progressInterval]);

    useEffect(() => {
        onVideoEndedRef.current = onVideoEnded;
    }, [onVideoEnded]);

    useEffect(() => {
        onPauseRef.current = onPause;
    }, [onPause]);

    useEffect(() => {
        onProgressRef.current = onProgress;
    }, [onProgress]);

    useEffect(() => {
        setWidth(window.innerWidth);
        setDelayedWidth(window.innerWidth);

        const reportWindowSize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', reportWindowSize);
        return () => {
            window.removeEventListener('resize', reportWindowSize);
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
        timeoutRef.current = window.setTimeout(() => {
            setDelayedWidth(window.innerWidth);
        }, 1000);
    }, [width]);

    useEffect(() => {
        if (!delayedWidth) {
            return;
        }

        const asyncEffect = async () => {
            const player = playerRef.current;
            if (player) {
                const isFullscreen = await player.getFullscreen();

                if (isFullscreen) {
                    return;
                }

                removeEventListeners(player);
                playerRef.current = undefined;
                player.pause(); // gets rid of interval
                player.destroy();
            }

            const options: any = {
                ...vimeoOptions,
                id: link,
                width: computeRatio(delayedWidth, playerWidthPercentage, maxWidth),
            };
            const newPlayer = new Player(id, options);
            playerRef.current = newPlayer as Player;

            if (progress) {
                newPlayer.getDuration().then((duration) => {
                    const seconds = duration * progress;
                    newPlayer.setCurrentTime(seconds);
                });
            }

            const keepTrackProgress = async () => {
                // gets duration of video in seconds
                const duration = await newPlayer.getDuration();

                intervalRef.current = window.setInterval(() => {
                    const currentPlayer = playerRef.current;
                    if (!currentPlayer) {
                        return;
                    }
                    currentPlayer.getCurrentTime().then((seconds) => {
                        // `seconds` indicates the current playback position of the video
                        const newProgress = seconds / duration;
                        if (onProgressRef.current) {
                            onProgressRef.current(newProgress);
                        }
                        setProgress(newProgress);
                    });
                }, intervalTimeRef.current);
            };

            newPlayer.on('ended', () => {
                removeInterval(intervalRef.current);
                intervalRef.current = undefined;
                if (onProgressRef.current) {
                    onProgressRef.current(1);
                }
                setProgress(1);
                if (onVideoEndedRef.current) {
                    onVideoEndedRef.current();
                }
            });

            newPlayer.on('pause', ({ duration, seconds }) => {
                removeInterval(intervalRef.current);
                intervalRef.current = undefined;
                const newProgress = seconds / duration;
                if (onProgressRef.current) {
                    onProgressRef.current(newProgress);
                }
                if (onPauseRef.current) {
                    onPauseRef.current();
                }
                setProgress(newProgress);
            });

            newPlayer.on('play', () => {
                keepTrackProgress();
            });
        };

        asyncEffect();
        // only allowed prop
    }, [delayedWidth, link]);

    useEffect(
        () => () => {
            removeInterval(intervalRef.current);
            removeEventListeners(playerRef.current);
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        },
        [],
    );

    return <div id={id} className={className} />;
};

export default VimeoPlayer;
