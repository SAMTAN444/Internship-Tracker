import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-3xl font-bold text-blue-600">
          Internship Tracker
        </div>
      </div>
    </>
  )
}

export default App
