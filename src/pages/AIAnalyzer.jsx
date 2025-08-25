import { useState } from 'react'

function AIAnalyzer() {
  const [file, setFile] = useState(null)
  const [problem, setProblem] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError(null)
    } else {
      setError('Please select a valid PDF file')
      setFile(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file || !problem.trim()) {
      setError('Please select a PDF file and describe your symptoms')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('problem', problem)

    try {
      const response = await fetch('https://chikitsak-backend-rbwd.onrender.com/MedicalHistoryPdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data.analysis)
      setSessionId(data.session_id)
      setChatMessages([]) // Reset chat when new analysis is done
    } catch (err) {
      setError(`Error: ${err.message}. Make sure your FastAPI server is running on localhost:8000`)
    } finally {
      setLoading(false)
    }
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    
    if (!currentMessage.trim() || !sessionId) {
      return
    }

    setChatLoading(true)
    const userMessage = currentMessage.trim()
    
    // Add user message to chat
    const newUserMessage = { type: 'user', content: userMessage, timestamp: new Date() }
    setChatMessages(prev => [...prev, newUserMessage])
    setCurrentMessage('')

    try {
      const response = await fetch('https://chikitsak-backend-rbwd.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Add assistant response to chat
      const assistantMessage = { 
        type: 'assistant', 
        content: data.response, 
        timestamp: new Date() 
      }
      setChatMessages(prev => [...prev, assistantMessage])
      
    } catch (err) {
      const errorMessage = { 
        type: 'error', 
        content: `Error: ${err.message}`, 
        timestamp: new Date() 
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">🏥 Medical History Analyzer</h1>
          <p className="text-lg opacity-90">
            Upload your medical history PDF and describe your symptoms for AI-powered analysis
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label htmlFor="file" className="block text-lg font-semibold text-gray-700 mb-3">
                📄 Upload Medical History PDF
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                  className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:border-blue-400 hover:bg-blue-100 transition-colors duration-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>
              {file && (
                <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✅ Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>

            {/* Symptoms Description */}
            <div>
              <label htmlFor="problem" className="block text-lg font-semibold text-gray-700 mb-3">
                🩺 Describe Your Current Symptoms
              </label>
              <textarea
                id="problem"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe your current symptoms, problems, or concerns in detail..."
                required
                rows={6}
                className="w-full p-4 border-2 border-gray-200 rounded-lg resize-vertical focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file || !problem.trim()}
              className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-200 ${
                loading || !file || !problem.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg transform hover:-translate-y-1'
              }`}
            >
              {loading ? '🔄 Analyzing...' : '🔍 Analyze Medical History'}
            </button>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="mt-8 text-center p-6">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Analyzing your medical history and symptoms...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-8 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Analysis Results</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">📚</span>
                  Medical History Summary
                </h4>
                <p className="text-gray-700 leading-relaxed">{result.summarized_history}</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <span className="mr-2">💊</span>
                  AI Recommendations
                </h4>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {result.ai_suggestion}
                </div>
              </div>

              {/* Chat Interface */}
              {sessionId && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                    <span className="mr-2">💬</span>
                    Ask Follow-up Questions
                  </h4>
                  
                  {/* Chat Messages */}
                  <div className="mb-4 max-h-64 overflow-y-auto space-y-3">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-100 text-blue-800 ml-8'
                            : message.type === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800 mr-8'
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {message.type === 'user' ? 'You' : message.type === 'error' ? 'Error' : 'AI Assistant'}
                        </div>
                        <div className="whitespace-pre-line">{message.content}</div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="bg-gray-100 text-gray-800 mr-8 p-3 rounded-lg">
                        <div className="text-sm font-medium mb-1">AI Assistant</div>
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                          Thinking...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Ask a question about your analysis..."
                      className="flex-1 p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !currentMessage.trim()}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        chatLoading || !currentMessage.trim()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {chatLoading ? '⏳' : 'Send'}
                    </button>
                  </form>

                  {/* Chat Suggestions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['What medications should I consider?', 'Which doctor should I see?', 'Any dietary recommendations?'].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMessage(suggestion)}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                        disabled={chatLoading}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIAnalyzer
