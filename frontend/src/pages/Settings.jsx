import React, { useState } from 'react';
import './Settings.css';

// Simple SVG icon components
const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
  </svg>
);

const Mail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const Lock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <circle cx="12" cy="16" r="1"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const Trash2 = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const Download = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const Shield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Palette = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="13.5" cy="6.5" r=".5"/>
    <circle cx="17.5" cy="10.5" r=".5"/>
    <circle cx="8.5" cy="7.5" r=".5"/>
    <circle cx="6.5" cy="12.5" r=".5"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.455 2 12 2z"/>
  </svg>
);

const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5m7-7-7 7 7 7"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);

const User = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

// Dialog Components
function DialogChangeEmail({ onClose }) {
  const [email, setEmail] = useState('');
  
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="dialog-header">
          <div className="dialog-icon blue">
            <Mail />
          </div>
          <h2 className="dialog-title">Change Email</h2>
        </div>
        
        <div className="dialog-content">
          <label className="dialog-label">
            New Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your new email"
            className="dialog-input"
          />
        </div>
        
        <div className="dialog-buttons">
          <button onClick={onClose} className="dialog-button secondary">
            Cancel
          </button>
          <button
            onClick={() => {
              // Handle email update logic here
              onClose();
            }}
            className="dialog-button primary"
          >
            Update Email
          </button>
        </div>
      </div>
    </div>
  );
}

function DialogChangeTheme({ onClose }) {
  const [selectedTheme, setSelectedTheme] = useState('light');
  
  const themes = [
    { id: 'light', name: 'Light', preview: 'light', accent: 'blue' },
    { id: 'dark', name: 'Dark', preview: 'dark', accent: 'purple' },
    { id: 'system', name: 'System', preview: 'system', accent: 'green' }
  ];
  
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="dialog-header">
          <div className="dialog-icon purple">
            <Palette />
          </div>
          <h2 className="dialog-title">Change Theme</h2>
        </div>
        
        <div className="dialog-content">
          <div className="theme-options">
            {themes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`theme-option ${selectedTheme === theme.id ? 'selected' : ''}`}
              >
                <div className={`theme-preview ${theme.preview}`}>
                  <div className={`theme-accent ${theme.accent}`}></div>
                </div>
                <span className="theme-name">{theme.name}</span>
                {selectedTheme === theme.id && (
                  <div className="theme-selected-indicator">
                    <div className="theme-selected-dot"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="dialog-buttons">
          <button onClick={onClose} className="dialog-button secondary">
            Cancel
          </button>
          <button
            onClick={() => {
              // Handle theme change logic here
              onClose();
            }}
            className="dialog-button purple"
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [openDialog, setOpenDialog] = useState('');
  
  const open = (name) => setOpenDialog(name);
  const close = () => setOpenDialog('');

  const settingsOptions = [
    {
      id: 'email',
      title: 'Change Email',
      description: 'Update your email address',
      icon: Mail,
      color: 'blue',
      available: true
    },
    {
      id: 'reset',
      title: 'Reset Password',
      description: 'Change your account password',
      icon: Lock,
      color: 'green',
      available: false
    },
    {
      id: 'theme',
      title: 'Change Theme',
      description: 'Customize your interface appearance',
      icon: Palette,
      color: 'purple',
      available: true
    },
    {
      id: 'export',
      title: 'Export History',
      description: 'Download your data and logs',
      icon: Download,
      color: 'indigo',
      available: false
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      description: 'Manage your privacy settings',
      icon: Shield,
      color: 'amber',
      available: false
    },
    {
      id: 'delete',
      title: 'Delete Account',
      description: 'Permanently remove your account',
      icon: Trash2,
      color: 'red',
      available: false
    }
  ];

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <div className="settings-header-content">
          <div className="settings-header-flex">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="back-button"
            >
              <ArrowLeft />
            </button>
            <div className="header-icon-container">
              <SettingsIcon />
            </div>
            <div>
              <h1 className="settings-title">Settings</h1>
              <p className="settings-subtitle">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="settings-main">
        {/* Profile Section */}
        <div className="profile-card">
          <div className="profile-flex">
            <div className="profile-avatar">
              <User />
            </div>
            <div>
              <h2 className="profile-name">Your Account</h2>
              <p className="profile-email">user@example.com</p>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="settings-grid">
          {settingsOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className={`settings-card ${!option.available ? 'disabled' : ''}`}
                onClick={option.available ? () => open(option.id) : undefined}
              >
                <div className="settings-card-content">
                  <div className={`settings-icon ${option.color}`}>
                    <IconComponent />
                  </div>
                  <div className="settings-info">
                    <h3 className="settings-card-title">
                      {option.title}
                      {!option.available && (
                        <span className="coming-soon-badge">
                          Coming Soon
                        </span>
                      )}
                    </h3>
                    <p className="settings-card-description">
                      {option.description}
                    </p>
                  </div>
                  {option.available && (
                    <div className="settings-arrow">
                      <ArrowRight />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="settings-footer">
          <p>Need help? Contact our support team</p>
        </div>
      </div>

      {/* Dialogs */}
      {openDialog === 'email' && <DialogChangeEmail onClose={close} />}
      {openDialog === 'theme' && <DialogChangeTheme onClose={close} />}
    </div>
  );
}