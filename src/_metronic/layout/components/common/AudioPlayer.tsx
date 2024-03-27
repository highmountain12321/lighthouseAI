import React, { useEffect, useState } from 'react';

interface AudioPlayerProps {
    audioSrc: string;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc, isPlaying, setIsPlaying }) => {
    useEffect(() => {
        const audio = document.getElementById('audio-element') as HTMLAudioElement | null;
        if (audio && audioSrc && isPlaying) {
            audio.play();
        }
    }, [isPlaying])

    return (
        <>
            {audioSrc && (
                <audio id="audio-element" src={audioSrc}></audio>
            )}
        </>
    );
};

export default AudioPlayer;
