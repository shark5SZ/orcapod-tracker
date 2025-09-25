

function App() {
  const viewers = ["Alice", "Bob", "Charlie"]
  const statuses = [
    { id: 1, date: "2025-09-20" },
    { id: 2, date: "2025-09-21" },
    { id: 3, date: "2025-09-22" }
  ]

  // Example data: who viewed what
  const views = {
    Alice: { "2025-09-20": true, "2025-09-21": false, "2025-09-22": true },
    Bob:   { "2025-09-20": true, "2025-09-21": true, "2025-09-22": false },
    Charlie:{ "2025-09-20": false,"2025-09-21": true, "2025-09-22": true },
  }

    
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
                      checked={views[viewer][status.date]}
                      readOnly
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
