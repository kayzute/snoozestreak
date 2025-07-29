import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '../components/CircularProgress';
import './Dashboard.css';
// git test

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
  const now = new Date();
  const bt = new Date(now);
  bt.setHours(H, M, 0, 0);
  
  // If bedtime is already past for today, set it to tomorrow
  if (bt <= now) {
    bt.setDate(bt.getDate() + 1);
  }
  return bt;
}

const personalizedGoals = {
  'Restless Relaxer': [
    'Progressive Muscle Relaxation - 15 mins',
    'No Screen Time 2hrs Before Bed',
    'Evening Yoga Session - 20 mins'
  ],
  'Fragmented Sleeper': [
    'Meditation Before Bed - 10 mins',
    'No Afternoon Naps',
    'Consistent Wake Time'
  ],
  'Sleep-Deprived Dreamer': [
    'Earlier Bedtime - By 10PM',
    'Morning Sunlight - 10 mins',
    'No Late Caffeine'
  ],
  'Healthy Sleeper': [
    'Exercise 1 Hour',
    'Meditate 10 Minutes',
    'Read 30 Pages'
  ],
  'Oversleeping Owl': [
    'Morning Walk - 15 mins',
    'Set Single Alarm',
    'No Snooze Button'
  ],
  'default': [
    'Exercise 1 Hour',
    'Meditate 10 Minutes',
    'Read 30 Pages'
  ]
};

const sleepRoleDescriptions = {
  'Restless Relaxer': 'Your mind tends to race at bedtime. These goals will help you wind down naturally and find your calm.',
  'Fragmented Sleeper': 'You wake up during the night. These goals will help you maintain continuous, restorative sleep.',
  'Sleep-Deprived Dreamer': 'You\'re getting less sleep than needed. These goals will help you reclaim your natural sleep rhythm.',
  'Healthy Sleeper': 'You have good sleep habits. These goals will help you maintain and optimize your rest.',
  'Oversleeping Owl': 'You tend to oversleep. These goals will help you wake up refreshed and energized.',
  'default': 'Personalized goals to help you achieve better sleep quality.'
};

// bedtime can be altered later to add user input, maybe included in survey
// and customizable in settings?
function DailyTimers({ bedtime = '22:00' }) {  // Changed bedtime to 10 PM
  const goals = [
    { label: 'No caffeine',        hours: 10 },
    { label: 'No eating/drinking', hours: 3  },
    { label: 'No work',            hours: 2  },
    { label: 'No screens',         hours: 1  },
  ];

  // Set a fixed "current time" for demo purposes
  const [now] = useState(() => {
    const demoTime = new Date();
    demoTime.setHours(17, 30, 0, 0); // Set to 5:30 PM
    return demoTime.getTime();
  });

  const nextBed = getNextBedtime(bedtime);

  return (
    <section className="daily-timers">
      <h2>Cut-off Timers</h2>
      <ul>
        {goals.map(({ label, hours }) => {
          const cutoff = nextBed.getTime() - hours * 3_600_000;
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
  const [userRole] = useState('Fragmented Sleeper');
  const roleDescription = sleepRoleDescriptions[userRole] || sleepRoleDescriptions.default;
  const dailyGoals = personalizedGoals[userRole] || personalizedGoals.default;

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

  // Initialize states
  const [streak, setStreak] = useState(1);
  const [checkedGoals, setCheckedGoals] = useState(() => Array(dailyGoals.length).fill(false));
  const [completionHistory, setCompletionHistory] = useState(() => {
    const today = new Date();
    const history = {};
    
    // Add Wed 23
    const wed23 = new Date(today);
    wed23.setDate(23);
    history[wed23.toISOString().split('T')[0]] = true;
    
    // Add Sun 27
    const sun27 = new Date(today);
    sun27.setDate(27);
    history[sun27.toISOString().split('T')[0]] = true;
    
    return history;
  });

  // Update both streak and calendar when all goals are completed
  useEffect(() => {
    if (checkedGoals.every(Boolean)) {
      // Update streak
      setStreak(2);

      // Update calendar for Monday
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(28); // Set to Monday the 28th
      const mondayStr = monday.toISOString().split('T')[0];
      
      setCompletionHistory(prev => ({
        ...prev,
        [mondayStr]: true
      }));
    } else {
      // Reset streak and remove Monday's completion if not all goals are checked
      setStreak(1);
      
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(28);
      const mondayStr = monday.toISOString().split('T')[0];
      
      setCompletionHistory(prev => {
        const newHistory = { ...prev };
        delete newHistory[mondayStr];
        return newHistory;
      });
    }
  }, [checkedGoals]);

  // toggle one goal
  const toggleGoal = (i) => {
    setCheckedGoals((prev) =>
      prev.map((c, idx) => (idx === i ? !c : c))
    );
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const completedGoals = checkedGoals.filter(Boolean).length;
    return (completedGoals / dailyGoals.length) * 100;
  };

  return (
    <main className="dashboard">
      <section className="daily-goals">
        <div className="goals-box">
          <h2 className="section-title">Daily Goals</h2>
          <div className="role-indicator">
            <span className="role-label">Your Sleep Personality:</span>
            <span className="role-value" data-text={userRole}>The {userRole}</span>
            <div className="role-description">
              {roleDescription}
            </div>
          </div>
          <div className="streak-counter" key={streak}>
            <span className="fire-emoji">🔥</span> Daily Streak: <strong>{streak}</strong>
          </div>
          <div className="goals-container">
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
          </div>
        </div>
        <div className="progress-container">
          <CircularProgress percentage={calculateProgress()} />
        </div>
      </section>

      {/* Streak Calendar */}
      <section className="streak-calendar">
        <h2>Streak Calendar</h2>
        <div className="calendar-grid">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 6 + i);
            const dateStr = date.toISOString().split('T')[0];
            const isCompleted = completionHistory[dateStr];
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            
            return (
              <div 
                key={dateStr} 
                className={`calendar-day ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
              >
                <div className="day-label">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}
                </div>
                <div className="date-number">{date.getDate()}</div>
                {isCompleted && <span className="completion-indicator">✓</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* timers */}
      <DailyTimers bedtime="22:00" />

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

