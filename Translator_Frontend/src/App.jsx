import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('vi');

    const translateText = async () => {
        try {
            const response = await axios.post('https://api.example.com/translate', {
                q: inputText,
                source: sourceLang,
                target: targetLang,
                format: 'text',
            });

            setTranslatedText(response.data.translatedText);
        } catch (error) {
            console.error('Error translating text:', error);
        }
    };

    const swapLanguages = () => {
        const temp = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(temp);
    };

    return (
        <div className="app-container">
            <h1>Translator</h1>
            <div className="translator-box">
                <div style={{ width: '45%' }}>
                    <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                        <option value="en" disabled={targetLang === 'en'}>English</option>
                        <option value="vi" disabled={targetLang === 'vi'}>Vietnamese</option>
                        <option value="pl" disabled={targetLang === 'pl'}>Polish</option>
                    </select>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Start typing to translate..."
                    />
                </div>

                {/* Column for the buttons */}
                <div className="button-column">
                    {/* Swap button */}
                    <button onClick={swapLanguages} className="swap-btn">
                        &#8646; {/* Swap icon */}
                    </button>

                    {/* Translate button */}
                    <button onClick={translateText} className="translate-btn">
                        &rarr;
                    </button>
                </div>

                <div style={{ width: '45%' }}>
                    <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                        <option value="en" disabled={sourceLang === 'en'}>English</option>
                        <option value="vi" disabled={sourceLang === 'vi'}>Vietnamese</option>
                        <option value="pl" disabled={sourceLang === 'pl'}>Polish</option>
                    </select>
                    <div className="translation-output">
                        {translatedText || 'Translation will appear here...'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;