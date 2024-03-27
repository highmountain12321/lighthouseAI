import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'

interface TypewriterProps {
    sentence: string;
    delay?: number;
    startTyping: boolean;
    onTypingComplete?: () => void; // New prop for typing completion callback
}

const TypewriterLocal: React.FC<TypewriterProps> = ({ sentence, delay = 100, startTyping, onTypingComplete }) => {
    const [displayText, setDisplayText] = useState<string>('');
    const [showCursor, setShowCursor] = useState<boolean>(true);

    useEffect(() => {
        let index = 0;
        let intervalId: NodeJS.Timeout;

        const startTypingEffect = () => {
            intervalId = setInterval(() => {
                setDisplayText((prevText) => {
                    const nextChar = sentence[index];
                    index += 1;
                    return prevText + (nextChar === undefined ? '' : nextChar); // Check for undefined character
                });

                if (index === sentence.length) {
                    clearInterval(intervalId);
                    setShowCursor(false); // Hide cursor when typing is finished

                    // Invoke the onTypingComplete callback if provided
                    if (onTypingComplete) {
                        onTypingComplete();
                    }
                }
            }, delay);
        };

        const stopTypingEffect = () => {
            clearInterval(intervalId);
            setShowCursor(false); // Hide cursor when typing is stopped
        };

        if (startTyping) {
            startTypingEffect();
            setShowCursor(true); // Show cursor when typing starts
        } else {
            stopTypingEffect();
            setDisplayText(''); // Reset display text if typing is stopped
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [sentence, delay, startTyping, onTypingComplete]);

    return (
        <span>
            <ReactMarkdown>
                {displayText}
            </ReactMarkdown>
            {showCursor && '|'} {/* Show cursor when typing is in progress */}
        </span>
    );
};

export default TypewriterLocal;
