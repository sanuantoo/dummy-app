import './App.css'
import { useEffect, useState } from 'react'
import * as Papa from 'papaparse'

function App() {
  // This state will store the final sum of the "consumption" column
  const [consumption, setConsumption] = useState<number | null>(null)

  useEffect(() => {
    // Parse the CSV file when the component loads
    Papa.parse('/H1_Wh (1).csv', {
      download: true,        // Fetch the CSV from the server
      header: true,          // Treat the first row as column names
      dynamicTyping: true,   // Convert numeric strings into real numbers
      skipEmptyLines: true,  // Ignore blank rows

      complete: (results) => {
        // All rows from the CSV are now available here
        const rows = results.data as Array<Record<string, any>>

        // If the CSV is empty, stop early
        if (rows.length === 0) {
          setConsumption(null)
          return
        }

        // Look at the first row to detect which column contains "consumption"
        const firstRow = rows[0]

        // Find a column name that includes the word "consumption" (case-insensitive)
        const keyName = Object.keys(firstRow).find(key =>
          key.toLowerCase().includes('consumption')
        )

        // If no matching column is found, stop
        if (!keyName) {
          setConsumption(null)
          return
        }

        // Sum all values in the detected column
        const total = rows.reduce((sum, row) => {
          const value = row[keyName]

          // Ensure the value is a number (convert if needed)
          const numberValue =
            typeof value === 'number' ? value : parseFloat(String(value))

          // Add only valid numbers
          return sum + (isFinite(numberValue) ? numberValue : 0)
        }, 0)

        // Save the final sum into React state
        setConsumption(total)
      },

      // If something goes wrong, set consumption to null
      error: () => setConsumption(null),
    })
  }, [])

  return (
    <div className="app-root">
      <div className="app-layout">
        <aside className="consumption-grid" aria-label="Consumption">
          <div className="consumption-title">Consumption</div>
          <div className="consumption-value">{consumption === null ? '— kWh' : `${consumption.toFixed(2)} kWh`}</div>
        </aside>

        <main className="main-content">
          {/* Plain placeholder area for future work */}
        </main>
      </div>
    </div>


  )
}

export default App
