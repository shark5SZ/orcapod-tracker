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
    </div>
  )
}

export default ViewerTable