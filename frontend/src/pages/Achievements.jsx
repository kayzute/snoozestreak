import './Achievements.css';
import { useState, useEffect } from 'react';

export default function Achievements() {
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  const API_URL = "https://x6bj965173.execute-api.us-east-1.amazonaws.com";

  // achievements with icons, progress bar, and potential backend support
  const achievements = [
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Wake up before 7 AM for 7 consecutive days',
      icon: '🌅',
      category: 'sleep',
      criteria: { type: 'streak', event: 'sleep_wokeup', condition: 'before_7am', target: 7 },
      unlocked: true,
      progress: 7,
      maxProgress: 7
    },
    {
      id: 'night_owl',
      title: 'Night Owl',
      description: 'Go to bed after midnight 10 times',
      icon: '🦉',
      category: 'sleep',
      criteria: { type: 'count', event: 'sleep_bed', condition: 'after_midnight', target: 10 },
      unlocked: false,
      progress: 6,
      maxProgress: 10
    },
    {
      id: 'workout_warrior',
      title: 'Workout Warrior',
      description: 'Exercise for 30+ hours total',
      icon: '💪',
      category: 'exercise',
      criteria: { type: 'total_hours', event: 'exercise', target: 30 },
      unlocked: true,
      progress: 35,
      maxProgress: 30
    },
    {
      id: 'nap_master',
      title: 'Nap Master',
      description: 'Take 20 naps',
      icon: '😴',
      category: 'sleep',
      criteria: { type: 'count', event: 'nap', target: 20 },
      unlocked: false,
      progress: 15,
      maxProgress: 20
    },
    {
      id: 'caffeine_cold_turkey',
      title: 'Caffeine Cold Turkey',
      description: 'Go without caffeine 50 times',
      icon: '☕',
      category: 'consumption',
      criteria: { type: 'count', event: 'consume_caffeine', target: 50 },
      unlocked: false,
      progress: 1,
      maxProgress: 50
    },
    {
      id: 'consistent_sleeper',
      title: 'Consistent Sleeper',
      description: 'Maintain regular sleep schedule for 30 days',
      icon: '🕐',
      category: 'sleep',
      criteria: { type: 'consistency', event: 'sleep_bed', target: 30 },
      unlocked: false,
      progress: 5,
      maxProgress: 30
    },
    {
      id: 'food_logger',
      title: 'Food Logger',
      description: 'Log food consumption 100 times',
      icon: '🍽️',
      category: 'consumption',
      criteria: { type: 'count', event: 'consume_food', target: 100 },
      unlocked: false,
      progress: 0,
      maxProgress: 100
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: 'Log activities every day for a week',
      icon: '📅',
      category: 'general',
      criteria: { type: 'daily_streak', target: 7 },
      unlocked: true,
      progress: 7,
      maxProgress: 7
    }
  ];

  // categories for filtering
  const categories = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'sleep', name: 'Sleep', icon: '🛏️' },
    { id: 'exercise', name: 'Exercise', icon: '🏃' },
    { id: 'consumption', name: 'Consumption', icon: '🥤' },
    { id: 'general', name: 'General', icon: '⭐' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [achievementsData, setAchievementsData] = useState(achievements);

  // Fetch user data and calculate achievement progress, needs further backend support
  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      // const response = await fetch(`${API_URL}/log?userid=first_user123`);
      // if (!response.ok) throw new Error('Failed to fetch data');
      
      // const data = await response.json();
      // setUserStats(data);
      // calculateAchievements(data.items || []);
      setAchievementsData(achievements);

    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievements = (logs) => {
    const updatedAchievements = achievementsData.map(achievement => {
      const progress = calculateProgress(achievement, logs);
      return {
        ...achievement,
        progress: progress,
        unlocked: progress >= achievement.maxProgress
      };
    });
    
    setAchievementsData(updatedAchievements);
  };

  const calculateProgress = (achievement, logs) => {
    const { criteria } = achievement;
    
    switch (criteria.type) {
      case 'count':
        return logs.filter(log => log.event === criteria.event).length;
      
      case 'total_hours':
        return logs
          .filter(log => log.event === criteria.event)
          .reduce((total, log) => total + (log.hours || 0), 0);
      
      case 'streak':
        // implements streak calculation logic
        return calculateStreak(logs, criteria);
      
      case 'daily_streak':
        return calculateDailyStreak(logs);
      
      default:
        return 0;
    }
  };

  const calculateStreak = (logs, criteria) => {
    const relevantLogs = logs.filter(log => log.event === criteria.event);
    return Math.min(relevantLogs.length, criteria.target);
  };

  const calculateDailyStreak = (logs) => {
    // calculates consecutive days with any activity
    const dates = [...new Set(logs.map(log => new Date(log.timestamp).toDateString()))];
    return Math.min(dates.length, 7); // Simplified for demo
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievementsData 
    : achievementsData.filter(achievement => achievement.category === selectedCategory);

  const unlockedCount = achievementsData.filter(a => a.unlocked).length;
  const totalCount = achievementsData.length;

  if (loading) {
    return (
      <div className="achievements">
        <div className="loading">Loading achievements...</div>
      </div>
    );
  }

  return (
    <div className="achievements">
      
      <div className="content-container">
        <h1>Achievements</h1>
        
        <div className="achievements-header">
          <div className="progress-summary">
            <h2>{unlockedCount} / {totalCount}</h2>
            <p>Achievements Unlocked</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        <div className="achievements-grid">
          {filteredAchievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">
                {achievement.icon}
              </div>
              
              <div className="achievement-content">
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-description">{achievement.description}</p>
                
                <div className="achievement-progress">
                  <div className="progress-bar-small">
                    <div 
                      className="progress-fill-small"
                      style={{ 
                        width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {achievement.progress} / {achievement.maxProgress}
                  </span>
                </div>
              </div>
              
              {achievement.unlocked && (
                <div className="achievement-badge">
                  <span>✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}