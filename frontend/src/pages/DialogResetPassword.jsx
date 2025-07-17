import React from 'react';
import './Dialog.css';

function DialogResetPassword({ onClose }) {
    return (
        <div className="dialog-backdrop">
            <div className="dialog-box">
                <h2>Reset Password</h2>
                <p>Enter your email to receive a reset link:</p>
                <input type="email" placeholder="your@email" />
                <div className="dialog-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button>Send Link</button>

                </div>
            </div>
        </div>
    );
}

export default DialogResetPassword;