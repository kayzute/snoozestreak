// We want to use GET operation type and return type of data set of previous LogActivity POSTS and PUTS

import './LogHistory.css'

export default function LogHistory() {
  return (
    <div className="log-history">
      <div className="background-layer">
        <div className="rectangle purple"></div>
        <div className="rectangle magenta"></div>
        <div className="rectangle blue"></div>
      </div>
      
      <div className="content-container">
        <h1>Log History</h1>
        <label htmlFor="options">Previous Log here</label>
      </div>
    </div>
  );
}