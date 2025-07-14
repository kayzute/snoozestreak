import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

// format for time
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

// bedtime can be altered later to add user input, maybe included in survey
// and customizable in settings?
function DailyTimers({ bedtime = '23:00' }) {
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

export default function Dashboard() {
  // daily goals change based on survey
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

  // month day year format
  const todayStr = () => new Date().toISOString().split('T')[0];
  const yesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  // load checked state from localStorage
  const [checkedGoals, setCheckedGoals] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('checkedGoals') || '{}');
    if (saved.date === todayStr() && Array.isArray(saved.checked)) {
      return saved.checked;
    }
    return Array(dailyGoals.length).fill(false);
  });

  // load streak and last-counted-date
  const [streak, setStreak] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('streakData') || '{}');
    return saved.streak || 0;
  });
  const [lastCountedDate, setLastCountedDate] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('streakData') || '{}');
    return saved.lastDate || null;
  });

  
  useEffect(() => {
    // checked state to today's date
    localStorage.setItem(
      'checkedGoals',
      JSON.stringify({ date: todayStr(), checked: checkedGoals })
    );

    // if all goals are checked and today has not been counted, update
    if (checkedGoals.every(Boolean) && lastCountedDate !== todayStr()) {
      let newStreak = 1;
      if (lastCountedDate === yesterdayStr()) {
        newStreak = streak + 1;
      }
      setStreak(newStreak);
      setLastCountedDate(todayStr());
      localStorage.setItem(
        'streakData',
        JSON.stringify({ streak: newStreak, lastDate: todayStr() })
      );
    }
  }, [checkedGoals, lastCountedDate, streak]);

  // toggle one goal
  const toggleGoal = (i) => {
    setCheckedGoals((prev) =>
      prev.map((c, idx) => (idx === i ? !c : c))
    );
  };

  return (
    <main className="dashboard">
      <section className="daily-goals">
        <h2 className="section-title">Daily Goals</h2>

        {/*streaks */}
        <div className="streak-counter">
          🔥 Daily Streak: <strong>{streak}</strong>
        </div>

        <div className="goals-grid">
          {dailyGoals.map((goal, i) => (
            <span
              key={i}
              className={`goal-pill ${checkedGoals[i] ? 'completed' : ''}`}
              onClick={() => toggleGoal(i)}
            >
              {goal}
            </span>
          ))}
        </div>
      </section>

      {/* timers */}
      <DailyTimers bedtime="23:00" />

      {/* widgets */}
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

