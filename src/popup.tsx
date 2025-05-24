import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/globals.css'

function IndexPopup() {
  const [isRecording, setIsRecording] = useState(false)

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // TODO: Implement recording logic
  }

  return (
    <div className="w-64 p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-xl font-bold">LilaDot</h1>
        <p className="text-sm text-center">
          {isRecording ? 'Recording meeting...' : 'Ready to record your meeting'}
        </p>
        <button
          onClick={toggleRecording}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
createRoot(root).render(<IndexPopup />)
