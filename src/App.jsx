import { useState, useEffect  } from "react";

function App() {
  // Load initial data directly from localStorage
  const [viewers, setViewers] = useState(() =>
    JSON.parse(localStorage.getItem("viewers")) || []
  );
  const [statuses, setStatuses] = useState(() =>
    JSON.parse(localStorage.getItem("statuses")) || []
  );
  const [views, setViews] = useState(() =>
    JSON.parse(localStorage.getItem("views")) || {}
  );

  const [newViewer, setNewViewer] = useState("");
  const [newStatusDate, setNewStatusDate] = useState("");

  // 🟣 Save data anytime state changes
  useEffect(() => {
    localStorage.setItem("viewers", JSON.stringify(viewers));
  }, [viewers]);

  useEffect(() => {
    localStorage.setItem("statuses", JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem("views", JSON.stringify(views));
  }, [views]);


  // Function to add viewer
  const handleAddViewer = () => {
    if (!newViewer.trim()) return; // avoid empty names

    const nameExists = viewers.some( (v) => v.toLowerCase() === newViewer.toLowerCase());
    if (nameExists) return alert("Viewer already exists");

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

  const getStatusViewCount = (date) => {
    return viewers.reduce((count, viewer) => {
      return views[viewer]?.[date] ? count + 1 : count;
    }, 0);
  };

  const getViewerViewCount = (viewer) => {
    const viewerData = views[viewer] || {};
    return Object.values(viewerData).filter(v => v === true).length;
  };

  // Sort viewers by view count (descending)
  const sortedViewers = [...viewers].sort((a, b) => {
    return getViewerViewCount(b) - getViewerViewCount(a);
  });

  const handleDeleteViewer = (viewerName) => {
    // Confirm deletion (optional)
    if (!confirm(`Delete viewer "${viewerName}"?`)) return;

    // 1. Remove viewer from the list
    const updatedViewers = viewers.filter(v => v !== viewerName);
    setViewers(updatedViewers);

    // 2. Remove viewer’s views data
    const updatedViews = { ...views };
    delete updatedViews[viewerName];
    setViews(updatedViews);
  };
    
  return (
    <>
      <h1 className="text-center text-blue-400 mt-4 text-4xl">Orcapod Tracker</h1>
      <p className="text-center mb-4">Track and analyse your social reach, one status at a time</p>

      <div className="overflow-x-auto  overflow-y-auto max-h-110">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Viewer</th>
              {statuses.map(status => (
                <th key={status.id} className="border px-4 py-2">
                  {status.date}({getStatusViewCount(status.date)})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedViewers.map((viewer, index) => (
              <tr key={viewer}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 font-medium">
                  {viewer}
                  ({getViewerViewCount(viewer)}) 
                  <button
                    onClick={() => handleDeleteViewer(viewer)}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </td>
                
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
