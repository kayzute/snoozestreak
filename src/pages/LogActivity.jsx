import './LogActivity.css'
import { useState } from 'react';

export default function LogActivity() {
  const [selectedOption, setSelectedOption] = useState('');
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="log-activity">
      <h1>LogActivity</h1>
      <label htmlFor="options">Choose an option: </label>
      <select id="options" value={selectedOption} onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        <option value="sleep">Sleep</option>
        <option value="nap">Nap</option>
        <option value="walk">Walk</option>
      </select>
      <p>Selected: {selectedOption}</p>
          <div className="rectangle purple"></div>
          <div className="rectangle magenta"></div>
          <div className="rectangle blue"></div>
    </div>
);
}