import { useEffect, useState } from 'react';

const useSound = (filePath: string, options?: {
  loop?: boolean;
  volume?: number;
  autoplay?: boolean
}) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioElement = new Audio(filePath);

    if (options?.loop !== undefined) {
      audioElement.loop = options.loop;
    }

    if (options?.volume !== undefined) {
      audioElement.volume = options.volume;
    }

    setAudio(audioElement);

    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, [filePath, options?.loop, options?.volume]);

  useEffect(() => {
    if (audio && options?.autoplay) {
      play();
    }
  }, [audio, options?.autoplay]);

  const play = () => {
    if (!audio) return;

    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(error => {
        console.warn('Autoplay prevented:', error);
        setIsPlaying(false);
      });
  };

  const pause = () => {
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return {
    play,
    pause,
    toggle,
    isPlaying
  };
};

export default useSound;