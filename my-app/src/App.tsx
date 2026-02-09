import './App.css'
import { useEffect, useState } from 'react'
import * as Papa from 'papaparse'

function App() {
  const [consumption, setConsumption] = useState<number | null>(null)
  const [production, setProduction] = useState<number | null>(null)

  useEffect(() => {
    Papa.parse('/H1_Wh (1).csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Array<Record<string, any>>
        
        // Find the column key that contains 'consumption' (case-insensitive)
        let consumptionKey: string | undefined
        // Find the column key that contains 'production' (case-insensitive)
        let productionKey: string | undefined
        
        if (rows.length > 0) {
          const sample = rows[0]
          consumptionKey = Object.keys(sample).find(k => k && k.toLowerCase().includes('consumption'))
          productionKey = Object.keys(sample).find(k => k && k.toLowerCase().includes('production'))
        }

        // Calculate consumption sum
        const consumptionSum = rows.reduce((acc, row) => {
          if (!consumptionKey) return acc
          const v = row[consumptionKey]
          const n = typeof v === 'number' ? v : parseFloat(String(v))
          return acc + (isFinite(n) ? n : 0)
        }, 0)

        // Calculate production sum
        const productionSum = rows.reduce((acc, row) => {
          if (!productionKey) return acc
          const v = row[productionKey]
          const n = typeof v === 'number' ? v : parseFloat(String(v))
          return acc + (isFinite(n) ? n : 0)
        }, 0)

        setConsumption(consumptionSum)
        setProduction(productionSum)
      },
      error: () => {
        setConsumption(null)
        setProduction(null)
      },
    })
  }, [])

  return (
    <div className="app-root">
      <div className="app-layout">
        <aside className="sidebar">
          <div className="consumption-grid" aria-label="Consumption">
            <div className="consumption-title">Consumption</div>
            <div className="consumption-value">{consumption === null ? '— kWh' : `${consumption.toFixed(2)} kWh`}</div>
          </div>

          <div className="production-grid" aria-label="Production">
            <div className="production-title">Production</div>
            <div className="production-value">{production === null ? '— kWh' : `${production.toFixed(2)} kWh`}</div>
          </div>
        </aside>

        <main className="main-content">
          {/* Plain placeholder area for future work */}
        </main>
      </div>
    </div>
  )
}

export default App
