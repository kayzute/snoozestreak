import React from 'react';
import './dialog.css';

export default function DialogChangeTheme({ onClose }) {
    const toggleTheme = () => {
        document.body.classList.toggle('dark-theme');
        onClose(); //close dialog after change 
    };

    return (
        <div className = "dialog-overlay">
            <div className = "dialog-box">
                <h2>Change Theme</h2>
                <p>Wouold you like to switch themes?</p>
                <div className = "dialog-buttons">
                    <button onClick = {toggleTheme} className = "dialog-button">Toggle Theme</button>
                    <button onClick = {onClose} className = "dialog-button">Cancel</button>
                </div>
            </div>
        </div>
    );
}