import './LogHistory.css';
import { useEffect, useState } from 'react';

export default function LogHistory() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageKeys, setPageKeys] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = "https://x6bj965173.execute-api.us-east-1.amazonaws.com";
  const [selectedLogs, setSelectedLogs] = useState([]);

  const fetchLogs = async (pageNum, startKey = null) => {
    setLoading(true);
    try {
      let url = `${API_URL}/log?userid=first_user123`;
      if (startKey) {
        url += `&startKeyTimestamp=${encodeURIComponent(startKey)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setLogs(data.items);

      setPageKeys(prev => ({
        ...prev,
        [pageNum + 1]: data.lastKey?.timestamp || null
      }));

      setHasNextPage(!!data.lastKey && data.items.length === 5);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      const nextPage = currentPage + 1;
      const startKey = pageKeys[nextPage];
      setCurrentPage(nextPage);
      fetchLogs(nextPage, startKey);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      const startKey = pageKeys[prevPage];
      setCurrentPage(prevPage);
      fetchLogs(prevPage, startKey);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    fetchLogs(1, null);
  };

  const selectAllOnPage = () => {
    setSelectedLogs(logs.map(({ userid, timestamp }) => ({ userid, timestamp })));
  };

  const clearSelection = () => {
    setSelectedLogs([]);
  };

  const toggleLogSelection = (log) => {
    setSelectedLogs((prev) => {
      const exists = prev.find(
        (item) => item.timestamp === log.timestamp && item.userid === log.userid
      );
      if (exists) {
        return prev.filter(
          (item) => !(item.timestamp === log.timestamp && item.userid === log.userid)
        );
      } else {
        return [...prev, { userid: log.userid, timestamp: log.timestamp }];
      }
    });
  };

  const deleteSelectedLogs = async () => {
    if (selectedLogs.length === 0) return;
    if (!window.confirm(`Delete ${selectedLogs.length} selected log(s)?`)) return;

    setLoading(true);

    try {
      for (const { userid, timestamp } of selectedLogs) {
        await fetch(`${API_URL}/log`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userid, timestamp })
        });
      }

      // Remove from UI
      setLogs((prevLogs) =>
        prevLogs.filter(
          (log) =>
            !selectedLogs.some(
              (sel) => sel.timestamp === log.timestamp && sel.userid === log.userid
            )
        )
      );

      setSelectedLogs([]);
    } catch (error) {
      console.error("Error deleting selected logs:", error);
      alert("Some deletions may have failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1, null);
  }, []);

  const eventPhrases = {
    exercise: "Exercised",
    sleep_wokeup: "Woke up",
    sleep_bed: "Went to bed",
    nap: "Took a nap",
    consume_food: "Consumed food",
    consume_caffeine: "Consumed caffeine",
    consume_alcohol: "Consumed alcohol"
  };

  const estimatedTotalPages = hasNextPage ? currentPage + 1 : currentPage;

  return (
    <div className="log-history">
      <div className="background-layer">
        <div className="rectangle purple"></div>
        <div className="rectangle magenta"></div>
        <div className="rectangle blue"></div>
      </div>
      
      <div className="content-container">
        <h1>Log History</h1>
        
        <div className="log-list-container">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <ul className="log-list">
              {logs.length > 0 ? (
                logs.map((log, index) => {
                  const date = new Date(log.timestamp);
                  const shortDate = date.toLocaleDateString(undefined, {
                    year: '2-digit',
                    month: 'numeric',
                    day: 'numeric',
                  });
                  const shortTime = date.toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                  });

                  const phrase = eventPhrases[log.event] || 
                    log.event.charAt(0).toUpperCase() + log.event.slice(1);

                  return (
                    <li key={index} className="log-item">
                      <input
                        type="checkbox"
                        checked={selectedLogs.some(
                          (item) => item.timestamp === log.timestamp && item.userid === log.userid
                        )}
                        onChange={() => toggleLogSelection(log)}
                        style={{ marginRight: '8px' }}
                      />
                      <strong>{shortDate}</strong> at <strong>{shortTime}</strong>: {phrase}
                      {log.hours !== 0 && ` — ${log.hours} hrs`}
                    </li>
                  );
                })
              ) : (
                <li className="log-item">
                  <p>No entries found for this page.</p>
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="action-controls">
          <div className="bulk-actions">
            <button 
              className="bulk-btn del" 
              onClick={selectAllOnPage} 
              disabled={loading || logs.length === 0}
            >
              Select All
            </button>
            <button 
              className="bulk-btn del" 
              onClick={clearSelection} 
              disabled={loading}
            >
              Clear
            </button>
            <button
              className="bulk-btn delete-btn"
              onClick={deleteSelectedLogs}
              disabled={loading || selectedLogs.length === 0}
            >
              Delete Selected ({selectedLogs.length})
            </button>
          </div>

          <div className="pagination-controls">
            <button 
              className="pagination-btn" 
              onClick={goToFirstPage}
              disabled={currentPage === 1 || loading}
            >
              First
            </button>

            <button 
              className="pagination-btn" 
              onClick={goToPreviousPage}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </button>

            <span className="page-info">
              Page {currentPage} of {estimatedTotalPages}
            </span>

            <button 
              className="pagination-btn" 
              onClick={goToNextPage}
              disabled={!hasNextPage || loading}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}