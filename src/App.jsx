import { useState } from "react";

function App() {
  const [viewers, setViewers] = useState(["Alice", "Bob", "Charlie"]);
  const [statuses, setStatuses] = useState([
    { id: 1, date: "2025-09-20" },
    { id: 2, date: "2025-09-21" },
    { id: 3, date: "2025-09-22" },
  ]);

  // Example data: who viewed what
  const [views, setViews] = useState({
    Alice: { "2025-09-20": true, "2025-09-21": false, "2025-09-22": true },
    Bob:   { "2025-09-20": true, "2025-09-21": true,  "2025-09-22": false },
    Charlie:{ "2025-09-20": false,"2025-09-21": true, "2025-09-22": true },
  });

  const [newViewer, setNewViewer] = useState(""); // input state
  const [newStatusDate, setNewStatusDate] = useState(""); 

  // Function to add viewer
  const handleAddViewer = () => {
    if (!newViewer.trim()) return; // avoid empty names

    // 1. Add to viewers list
    setViewers([...viewers, newViewer]);

    // 2. Add to views with default false for each status
    setViews({
      ...views,
      [newViewer]: Object.fromEntries(statuses.map(s => [s.date, false]))
    });

    // Clear input
    setNewViewer("");
  };


  // Add status
  const handleAddStatus = () => {
    if (!newStatusDate.trim()) return;

    // 1. Create a new status object
    const newStatus = {
      id: statuses.length + 1,
      date: newStatusDate,
    };

    // 2. Update statuses list
    setStatuses([...statuses, newStatus]);

    // 3. Update views: add this new date to every viewer
    const updatedViews = { ...views };
    viewers.forEach(v => {
      updatedViews[v] = {
        ...updatedViews[v],
        [newStatusDate]: false
      };
    });

    setViews(updatedViews);
    setNewStatusDate(""); // clear input
  };

  // Toggle a checkbox value
  const toggleView = (viewer, date) => {
    setViews(prev => ({
      ...prev,
      [viewer]: {
        ...prev[viewer],
        [date]: !prev[viewer][date] // flip the boolean
      }
    }));
  };


    
  return (
    <>
      <h1>Orcapod Tracker</h1>
      <p>Track and analyse your social reach, one status at a time</p>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Viewer</th>
              {statuses.map(status => (
                <th key={status.id} className="border px-4 py-2">
                  {status.date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {viewers.map(viewer => (
              <tr key={viewer}>
                <td className="border px-4 py-2 font-medium">{viewer}</td>
                {statuses.map(status => (
                  <td key={status.id} className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={views[viewer]?.[status.date] || false}
                      onChange={() => toggleView(viewer, status.date)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4">
      {/* --- Input to add a viewer --- */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newViewer}
          onChange={e => setNewViewer(e.target.value)}
          placeholder="Enter new viewer"
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddViewer}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Viewer
        </button>
      </div>

       {/* --- Add Status Form --- */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newStatusDate}
          onChange={e => setNewStatusDate(e.target.value)}
          placeholder="Enter status (e.g. 2025-09-23)"
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddStatus}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Status
        </button>
      </div>
      </div>
    </>
  )
}

export default App
