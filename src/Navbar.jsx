import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (

<nav className="navbar">
    <div className="navbar-left">
        <a href="/" className="logo">
            SnoozeStreak
        </a>
    </div>
    <div className="navbar-center">
        <ul className="nav-links">
            <li>
                <a href="/activity-log">Activity Log</a>
            </li>
            <li>
                <a href="/log-history">Log History</a>
            </li>
            <li>
                <a href="/more-info">Info</a>
            </li>
        </ul>
    </div>
    <div className="navbar-right">
        <a href="/menu" className="menu-icon">
            <i className="fas fa-bars"></i>
        </a>
        <a href="/settings" className="gear-icon">
            <i className="fas fa-cog"></i>
        </a>
    </div>
</nav>
);
};

export default Navbar;