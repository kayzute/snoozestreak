import React from 'react';
import './DialogPrivacyAgreement.css';

const DialogPrivacyAgreement = ( { onClose }) => {
    return (
        <div className = "dialog-overlay">
            <div className = "dialog-box">
                <h2>Privacy Agreement</h2>
                <p>
                    By using this app, you agree that your data may be collected to help improve your sleep experience.
                    You may delete your data anytime. Your information will never be sold or shared without your consent.

                </p>
                <div className = "dialog-buttons">
                    <button className = "agree-btn" onClick = {onCLose} >I Agree </button>
                    <button className = "close-btn" onClick = {onClose} >Close</button>
                </div>
            </div>
        </div>
    );
};

export default DialogPrivacyAgreement; 