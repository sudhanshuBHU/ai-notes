"use client";

import { useState, useEffect, useRef } from 'react';

const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const recognitionRef = useRef(null);
  
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }
    recognitionRef.current = new window.webkitSpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setText(text);
    };
    recognition.onend = () => {
      setIsListening(false);
      setText('');
    };
    return () => {
      recognition.stop();
    };
  }, []);

  // 🎤 Speech Recognition (Speech to Text)
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
      return;
    }
  };
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
  };
  return {
    isListening,
    text,
    startListening,
    stopListening
  }
};

export default useSpeechToText;