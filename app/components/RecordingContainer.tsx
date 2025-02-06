"use client";

import React from 'react';
import useSpeechToText from '../hooks/useSpeechToText';

interface RecordingContainerProps {
    originalText: string;
    setOriginalText: React.Dispatch<React.SetStateAction<string>>;
}

const RecordingContainer: React.FC<RecordingContainerProps> = ({ originalText, setOriginalText }) => {
    // const [textInput, setTextInput] = useState('');
    const { isListening, startListening, stopListening, text } = useSpeechToText();

    const startStopListening = () => {
        if (isListening) {
            stopVoiceinput();
        } else {
            startListening();
        }
    }

    const stopVoiceinput = () => {
        setOriginalText(prev => prev + (text ? (prev ? ' ' : '') + text : ''));
        stopListening();
    }
    return (
        <div className="p-4 flex flex-col items-center">
            <button
                onClick={startStopListening}
                className={`px-4 py-2 rounded ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white`}
            >
                {isListening ? 'Stop' : 'Tap & Speak'}
            </button>
            <textarea
                className="mt-4 w-full p-2 border rounded"
                value={isListening ? originalText + (text ? (originalText ? ' ' : '') + text : '') : originalText}
                onChange={e => setOriginalText(e.target.value)}
                disabled={isListening}
                placeholder='Start speaking to add notes...'
            />
        </div>
    )
}

export default RecordingContainer;