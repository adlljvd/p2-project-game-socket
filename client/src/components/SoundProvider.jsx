// SoundProvider.jsx
import React, { createContext, useEffect } from 'react';
import clickSoundFile from '../assets/sounds/click-sound.mp3';

const SoundContext = createContext();

export default function SoundProvider({ children }) {
    const playClickSound = () => {
        const audio = new Audio(clickSoundFile);
        audio.play();
    };

    return (
        <SoundContext.Provider value={{ playClickSound }}>
            {children}
        </SoundContext.Provider>
    );
};

