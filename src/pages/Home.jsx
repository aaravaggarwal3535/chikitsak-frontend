import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">Code Chikitsak</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Your AI-powered medical support. Upload your medical documents and get intelligent insights 
          about your health condition with our advanced AI technology.
        </p>
        <Link
          to="/ai-analyzer"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Start Analysis 🔍
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">PDF Analysis</h3>
          <p className="text-gray-600">
            Upload your medical history PDFs and our AI will extract and analyze key information 
            to provide comprehensive insights.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Recommendations</h3>
          <p className="text-gray-600">
            Get personalized AI-powered recommendations based on your medical history 
            and current symptoms for better health management.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Private</h3>
          <p className="text-gray-600">
            Your medical data is processed securely and privately. We prioritize 
            your privacy and data security above everything else.
          </p>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📁</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">1. Upload PDF</h4>
            <p className="text-sm text-gray-600">Upload your medical history PDF document</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✍️</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">2. Describe Symptoms</h4>
            <p className="text-sm text-gray-600">Tell us about your current symptoms</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">3. AI Analysis</h4>
            <p className="text-sm text-gray-600">Our AI analyzes your data intelligently</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">4. Get Results</h4>
            <p className="text-sm text-gray-600">Receive detailed insights and recommendations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
