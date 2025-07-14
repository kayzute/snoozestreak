import React from 'react';
import './Dialog.css'; 

export default function DialogChangeEmail({ onClose}) {
    return (
        <div className = "dialog-overlay">
            <div className = "dialog-box">
                <h2>Change Email </h2>
                <input type = "email" placeholder = "Enter new email" />
                <div className = "dialog-buttons">
                    <button className = "dialog-button" onClick = { onClose }>Cancel</button>
                    <button className = "dialog-button"> Update </button>
                </div>
            </div>
        </div>
   );
};
