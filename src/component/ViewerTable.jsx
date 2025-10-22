import React from 'react'

const ViewerTable = ({
    statuses,
    filteredViewers,
    views,
    editingStatusId,
    editedStatusName,
    handleEditStatus,
    handleSaveStatus,
    handleCancelEdit,
    handleDeleteViewer,
    toggleView,
    getStatusViewCount,
    getViewerViewCount,
}) => {
  return (
    <div className="overflow-x-auto text-xs overflow-y-auto max-h-110">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border px-2 py-2">#</th>
              <th className="border px-2 py-2 text-white bg-gray-900 sticky left-0 z-10">Viewers</th>
              {statuses.map(status => (
                <th key={status.id} className="border px-2 py-2">
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
                      <span>{status.date}({getStatusViewCount(status.date)})</span>
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
          <tbody>
            {filteredViewers.map((viewer, index) => (
              <tr key={viewer}>
                <td className="border px-2 py-2 text-center">{index + 1}</td>
                <td className="border px-2 py-2 font-medium text-white sticky left-0 z-9 bg-gray-900">
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







  {/* const [viewers, setViewers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [views, setViews] = useState({});

  const [newViewer, setNewViewer] = useState("");
  const [newStatusDate, setNewStatusDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editedStatusName, setEditedStatusName] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddViewer = () => {
    if (!newViewer.trim()) {
      showNotification("Please enter a viewer name", "error");
      return;
    }

    const nameExists = viewers.some((v) => v.toLowerCase() === newViewer.trim().toLowerCase());
    if (nameExists) {
      showNotification("Viewer already exists", "error");
      return;
    }

    const trimmedName = newViewer.trim();
    setViewers([...viewers, trimmedName]);
    setViews({
      ...views,
      [trimmedName]: Object.fromEntries(statuses.map((s) => [s.date, false])),
    });

    setNewViewer("");
    showNotification(`Added ${trimmedName}`, "success");
  };

  const handleAddStatus = () => {
    if (!newStatusDate.trim()) {
      showNotification("Please enter a status date", "error");
      return;
    }

    const dateExists = statuses.some((s) => s.date === newStatusDate.trim());
    if (dateExists) {
      showNotification("Status already exists", "error");
      return;
    }

    const newStatus = {
      id: Date.now(),
      date: newStatusDate.trim(),
    };

    setStatuses([...statuses, newStatus]);

    const updatedViews = { ...views };
    viewers.forEach((v) => {
      updatedViews[v] = {
        ...updatedViews[v],
        [newStatusDate.trim()]: false,
      };
    });

    setViews(updatedViews);
    setNewStatusDate("");
    showNotification(`Added status ${newStatusDate.trim()}`, "success");
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') {
      callback();
    }
  };

  const toggleView = (viewer, date) => {
    setViews((prev) => ({
      ...prev,
      [viewer]: {
        ...prev[viewer],
        [date]: !prev[viewer][date],
      },
    }));
  };

  const getStatusViewCount = (date) => {
    return viewers.reduce((count, viewer) => {
      return views[viewer]?.[date] ? count + 1 : count;
    }, 0);
  };

  const getViewerViewCount = (viewer) => {
    const viewerData = views[viewer] || {};
    return Object.values(viewerData).filter((v) => v === true).length;
  };

  const sortedViewers = useMemo(() => {
    return [...viewers].sort((a, b) => {
      return getViewerViewCount(b) - getViewerViewCount(a);
    });
  }, [viewers, views]);

  const handleDeleteViewer = (viewerName) => {
    const updatedViewers = viewers.filter((v) => v !== viewerName);
    setViewers(updatedViewers);

    const updatedViews = { ...views };
    delete updatedViews[viewerName];
    setViews(updatedViews);

    setShowDeleteConfirm(null);
    showNotification(`Deleted ${viewerName}`, "success");
  };

  const handleEditStatus = (status) => {
    setEditingStatusId(status.id);
    setEditedStatusName(status.date);
  };

  const handleSaveStatus = (statusId) => {
    if (!editedStatusName.trim()) {
      showNotification("Status name cannot be empty", "error");
      return;
    }

    const oldStatus = statuses.find((s) => s.id === statusId);
    const oldDate = oldStatus.date;
    const newDate = editedStatusName.trim();

    const updatedStatuses = statuses.map((s) =>
      s.id === statusId ? { ...s, date: newDate } : s
    );
    setStatuses(updatedStatuses);

    const updatedViews = {};
    for (const [viewer, viewData] of Object.entries(views)) {
      const newViewData = { ...viewData };
      newViewData[newDate] = newViewData[oldDate];
      delete newViewData[oldDate];
      updatedViews[viewer] = newViewData;
    }
    setViews(updatedViews);

    setEditingStatusId(null);
    setEditedStatusName("");
    showNotification("Status updated", "success");
  };

  const handleCancelEdit = () => {
    setEditingStatusId(null);
    setEditedStatusName("");
  };

  const filteredViewers = sortedViewers.filter((viewer) =>
    viewer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalViews = Object.values(views).reduce((total, viewerViews) => {
    return total + Object.values(viewerViews).filter((v) => v).length;
  }, 0);

  const avgViewsPerStatus = statuses.length > 0 ? (totalViews / statuses.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-3 rounded-lg shadow-lg ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {notification.message}
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{showDeleteConfirm}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDeleteViewer(showDeleteConfirm)} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrendingUp className="w-10 h-10 text-blue-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Orcapod Tracker
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Track and analyze your social reach, one status at a time</p>
        </div>

        {(viewers.length > 0 || statuses.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Viewers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{viewers.length}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Statuses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{statuses.length}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Avg Views/Status</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{avgViewsPerStatus}</p>
                </div>
                <Eye className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Add Viewer</label>
              <div className="flex gap-2">
                <input type="text" value={newViewer} onChange={(e) => setNewViewer(e.target.value)} onKeyPress={(e) => handleKeyPress(e, handleAddViewer)} placeholder="Enter viewer name" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                <button onClick={handleAddViewer} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 whitespace-nowrap">
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Add Status</label>
              <div className="flex gap-2">
                <input type="text" value={newStatusDate} onChange={(e) => setNewStatusDate(e.target.value)} onKeyPress={(e) => handleKeyPress(e, handleAddStatus)} placeholder="e.g. 2025-10-16" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" />
                <button onClick={handleAddStatus} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 whitespace-nowrap">
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Search Viewers</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>

        {viewers.length === 0 && statuses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Get Started</h3>
            <p className="text-gray-500">Add your first viewer and status to start tracking engagement</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white sticky top-0 z-20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold sticky left-0 bg-gradient-to-r from-gray-900 to-gray-800 z-30">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold sticky left-12 bg-gradient-to-r from-gray-900 to-gray-800 z-30">Viewer</th>
                      {statuses.map((status) => (
                        <th key={status.id} className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">
                          {editingStatusId === status.id ? (
                            <div className="flex items-center gap-2 justify-center">
                              <input type="text" value={editedStatusName} onChange={(e) => setEditedStatusName(e.target.value)} className="px-2 py-1 border border-white rounded text-gray-900 w-32" autoFocus />
                              <button onClick={() => handleSaveStatus(status.id)} className="text-green-400 hover:text-green-300 transition-colors">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={handleCancelEdit} className="text-red-400 hover:text-red-300 transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 justify-center">
                              <span>{status.date}</span>
                              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">{getStatusViewCount(status.date)}</span>
                              <button onClick={() => handleEditStatus(status)} className="text-blue-400 hover:text-blue-300 transition-colors">
                                <Edit2 className="w-4 h-4" />
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
                    ) : (
                      filteredViewers.map((viewer, index) => (
                        <tr key={viewer} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-500 sticky left-0 bg-white z-10">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-gray-900 sticky left-12 bg-white z-10">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <span>{viewer}</span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">{getViewerViewCount(viewer)}</span>
                              </div>
                              <button onClick={() => setShowDeleteConfirm(viewer)} className="text-red-500 hover:text-red-700 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          {statuses.map((status) => (
                            <td key={status.id} className="px-6 py-4 text-center">
                              <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={views[viewer]?.[status.date] || false} onChange={() => toggleView(viewer, status.date)} className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" />
                              </label>
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

    </div> */}









    </div>
  )
}

export default ViewerTable