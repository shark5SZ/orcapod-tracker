import { useState, useEffect  } from "react";
import { useOrcapodData } from "./hooks/useOrcapodData";

function App() {
  const { viewers, setViewers, statuses, setStatuses, views, setViews } = useOrcapodData();

  const [newViewer, setNewViewer] = useState("");
  const [newStatusDate, setNewStatusDate] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editedStatusName, setEditedStatusName] = useState("");

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

  const filteredViewers = sortedViewers.filter(viewer =>
    viewer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStatus = (status) => {
    setEditingStatusId(status.id);
    setEditedStatusName(status.date);
  };

  const handleSaveStatus = (statusId) => {
    if (!editedStatusName.trim()) return alert("Status name cannot be empty");

    const oldStatus = statuses.find((s) => s.id === statusId);
    const oldDate = oldStatus.date;
    const newDate = editedStatusName.trim();

    // 1. Update statuses array
    const updatedStatuses = statuses.map((s) =>
      s.id === statusId ? { ...s, date: newDate } : s
    );
    setStatuses(updatedStatuses);

    // 2. Update views (rename the key)
    const updatedViews = {};
      for (const [viewer, viewData] of Object.entries(views)) {
        const newViewData = { ...viewData };
        newViewData[newDate] = newViewData[oldDate];
        delete newViewData[oldDate];
        updatedViews[viewer] = newViewData;
      }
    setViews(updatedViews);

    // 3. Exit edit mode
    setEditingStatusId(null);
    setEditedStatusName("");
  };

  const handleCancelEdit = () => {
    setEditingStatusId(null);
    setEditedStatusName("");
  };
    
  return (
    <div className="min-h-screen w-full px-14">
      <h1 className="text-center text-blue-400 mt-4 text-4xl">Orcapod Tracker</h1>
      <p className="text-center mb-4">Track and analyse your social reach, one status at a time</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-110 overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-gray-900 text-white sticky top-0 z-20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm bg-gray-900 font-semibold sticky left-0 z-30">#</th>
                  <th className="px-6 py-4 text-left text-sm bg-gray-900 font-semibold sticky left-12 z-30">Viewers</th>
                  {statuses.map(status => (
                    <th key={status.id} className="px-2 py-2 text-center z-10 text-sm font-semibold whitespace-nowrap">
                      {editingStatusId === status.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editedStatusName}
                            onChange={(e) => setEditedStatusName(e.target.value)}
                            className="border p-1 rounded w-20"
                          />
                          <button
                            onClick={() => handleSaveStatus(status.id)}
                            className="text-green-500 text-sm"
                          >
                            💾
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-400 hover:text-gray-600 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 justify-center">
                          <span>{status.date}</span>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            {getStatusViewCount(status.date)}
                          </span> 
                          <button
                            onClick={() => handleEditStatus(status)}
                            className="text-blue-500 text-xs ml-1"
                          >
                            ✎
                          </button>
                        </div>
                      )}
                      
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredViewers.length === 0 ? (
                      <tr>
                        <td colSpan={statuses.length + 2} className="px-6 py-8 text-center text-gray-500">
                          No viewers found matching "{searchQuery}"
                        </td>
                      </tr>
                    ) : (filteredViewers.map((viewer, index) => (
                          <tr key={viewer}>
                            <td className="px-6 py-4 text-gray-500 text-sm bg-white sticky left-0 z-10">{index + 1}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 sticky left-12 z-10 bg-white">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                  <span>{viewer}</span>
                                  <span className="bg-blue-100 text-xs text-blue-700 px-2 py-1 rounded-full font-semibold">
                                    {getViewerViewCount(viewer)}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleDeleteViewer(viewer)}
                                  className="ml-2 text-red-500 hover:text-red-700 text-sm"
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                            
                            {statuses.map(status => (
                              <td key={status.id} className="px-6 py-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={views[viewer]?.[status.date] || false}
                                  onChange={() => toggleView(viewer, status.date)}
                                />
                              </td>
                            ))}
                          </tr>
                        )))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
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

        <div className="mt-4 mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search viewer..."
            className="border p-2 rounded w-full sm:w-64"
          />
        </div>
      </div>
    </div>
  )
}

export default App
