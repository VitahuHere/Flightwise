import React, { useState } from 'react';
import axios from 'axios';

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

    return (
        <div className="app-container" style={{ padding: '20px' }}>
            <h1>Translator</h1>
            <div className="translator-box" style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '50%' }}>
                    <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                        <option value="en">English</option>
                        <option value="vi">Vietnamese</option>
                        {/* Add more languages as needed */}
                    </select>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Start typing to translate..."
                        rows="5"
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <button onClick={translateText}>&rarr;</button>
                <div style={{ width: '50%' }}>
                    <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                        <option value="vi">Vietnamese</option>
                        <option value="en">English</option>
                        {/* Add more languages as needed */}
                    </select>
                    <div style={{ padding: '10px', border: '1px solid #ccc', minHeight: '120px' }}>
                        {translatedText || 'Translation will appear here...'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;