// We want to use PUT operation type and a response type of success

import './LogActivity.css'
import { useState } from 'react';
import ReactDatePicker from '../components/TimePicker';

export default function LogActivity() {
  const [selectedOption, setSelectedOption] = useState('');
  const [hours, setHours] = useState('')  ;
  const needsHoursInput = ['sleep_wokeup', 'nap', 'exercise'].includes(selectedOption);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const API_URL = "https://x6bj965173.execute-api.us-east-1.amazonaws.com";

// Back end console log
  const handleSubmit = async () => {
    console.log("Submit button clicked!");
    console.log("Selected Option:", selectedOption);
    console.log("Selected Date:", selectedDate);
    console.log("Inputted Hours:", hours);

    if (needsHoursInput && (isNaN(hours) || parseFloat(hours) <= 0)) {
    alert("Please enter a valid number of hours.");
    return;
  }

  if (selectedDate > new Date()) {
  alert("Date cannot be in the future.");
  return;
  }

    const payload = {
      userid: "first_user123",
      event: selectedOption,
      timestamp: selectedDate.toISOString(),
      hours: needsHoursInput ? parseFloat(hours) : 0
    };

    try {
      const response = await fetch(API_URL + "/log", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Server response:", data);
    alert("Activity has been logged successfully!");

    setSelectedOption('');
    setHours('');
    setSelectedDate(null);
  } catch (error) {
    console.error("Error submitting activity:", error);
    alert("Failed to log activity. Please try again.");
  }
  };

  return (
    <div className="log-activity">
      <div className="background-layer">
        <div className="rectangle purple"></div>
        <div className="rectangle magenta"></div>
        <div className="rectangle blue"></div>
      </div>
      
      <div className="form-container">
        <h1>Log Activity</h1>
        <label htmlFor="options">Choose an option:</label>
        <select id="options" value={selectedOption} onChange={handleChange}>
          <option value="">--Please choose an option--</option>
          <option value="sleep_wokeup">Woke up</option>
          <option value="sleep_bed">Went to bed</option>
          <option value="nap">Took a nap</option>
          <option value="exercise">Exercised</option>
          <option value="consume_food">Ate food</option>
          <option value="consume_caffeine">Consumed caffeine</option>
          <option value="consume_alcohol">Consumed alcohol</option>
        </select>

        {/* <p>Selected: {selectedOption}</p> */}

        {needsHoursInput && (
          <div>
            <label htmlFor="hours">Enter hours slept: </label>
            <input
              type="number"
              id="hours"
              min="0"
              step="0.1"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 1.5"
              style={{ backgroundColor: 'white', color: 'black' }}
            />
          </div>
        )}

        <ReactDatePicker 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        
        <div className="button-layout">
          <button
            className="button-style"
            onClick={handleSubmit}
            disabled={!selectedOption || !selectedDate || (needsHoursInput && !hours)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}