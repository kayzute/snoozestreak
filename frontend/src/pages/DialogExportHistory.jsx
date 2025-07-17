import React from 'react'; 
import './Dialog.css';

export default function DialogExportHistory ({ onClose }) {
    const handleExport = () => {
        //replace later
        alert("Log history exported!");
        onClose()
    };

    return (
        <div className = "dialog-overlay">
            <div className = "dialog-box">
                <h2>Export Log History</h2>
                <p> Download your sleep log history.</p>
                <div className = "dialog-buttons">
                    <button className = "dialog-button" onClick = {onClose}>Cancel</button>
                    <button className = "dialog-button" onClick = {handelExport}>Export</button>
                </div>
            </div>
        </div>
    );
};