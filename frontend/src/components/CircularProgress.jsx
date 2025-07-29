import React from 'react';

const CircularProgress = ({ percentage }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="circular-progress">
      <svg width="150" height="150" viewBox="0 0 150 150">
        {/* Background circle */}
        <circle
          cx="75"
          cy="75"
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="10"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="75"
          cy="75"
          r={radius}
          stroke="#4caf50"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 75 75)"
          style={{
            transition: 'stroke-dashoffset 0.3s ease'
          }}
        />
        {/* Percentage text */}
        <text
          x="75"
          y="65"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#f2f2f2"
          fontSize="24"
          fontWeight="bold"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        >
          {Math.round(percentage)}%
        </text>
        {/* Subtitle text */}
        <text
          x="75"
          y="90"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#f2f2f2"
          fontSize="8"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          opacity="0.6"
        >
          of daily goals completed
        </text>
      </svg>
    </div>
  );
};

export default CircularProgress; 