// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

// --- Helpers for the timers ---
function formatDuration(ms) {
  if (ms <= 0) return '00:00:00';
  let totalSec = Math.floor(ms / 1000);
  const hrs  = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  totalSec   %= 3600;
  const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const secs = String(totalSec % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function getNextBedtime(timeStr) {
  const [H, M] = timeStr.split(':').map(Number);
  const now    = new Date();
  const bt     = new Date(now);
  bt.setHours(H, M, 0, 0);
  if (bt <= now) bt.setDate(bt.getDate() + 1);
  return bt;
}

// --- DailyTimers Component ---
function DailyTimers({ bedtime = '23:00' }) {
  // define your goals + cutoff hours
  const goals = [
    { label: 'No caffeine',        hours: 10 },
    { label: 'No eating/drinking', hours: 3  },
    { label: 'No work',            hours: 2  },
    { label: 'No screens',         hours: 1  },
  ];

  const [now, setNow] = useState(Date.now());
  const nextBed = getNextBedtime(bedtime);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="daily-timers">
      <h2>Cut-off Timers</h2>
      <ul>
        {goals.map(({ label, hours }) => {
          const cutoff    = nextBed.getTime() - hours * 3_600_000;
          const remaining = cutoff - now;
          return (
            <li key={label}>
              <span className="timer-label">{label}</span>
              <span className="timer-value">{formatDuration(remaining)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// --- Main Dashboard ---
export default function Dashboard() {
  const dailyGoals = [
    'Exercise 1 Hour',
    'Meditate 10 Minutes',
    'Read 30 Pages',
  ];

  const widgets = [
    {
      to: '/log-activity',
      title: 'Log Activity',
      summary: '5 workouts logged this week',
    },
    {
      to: '/achievements',
      title: 'Achievements',
      summary: '3 badges unlocked',
    },
    {
      to: '/log-history',
      title: 'Log History',
      summary: 'Last entry: Today at 8:15 AM',
    },
  ];

  return (
    <main className="dashboard">
      {/* Daily Goals */}
      <section className="daily-goals">
        <h2 className="section-title">Daily Goals</h2>
        <div className="goals-grid">
          {dailyGoals.map((goal, i) => (
            <span key={i} className="goal-pill">{goal}</span>
          ))}
        </div>
      </section>

      {/* Timers */}
      <DailyTimers bedtime="23:00" />

      {/* Widgets */}
      <section className="widgets-grid">
        {widgets.map(({ to, title, summary }, i) => (
          <Link key={i} to={to} className="widget-card">
            <div className="widget-card__header">{title}</div>
            <div className="widget-card__body">{summary}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
