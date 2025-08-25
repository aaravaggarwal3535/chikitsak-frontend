function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About Code Chikitsak</h1>
          <p className="text-lg opacity-90">
            Revolutionizing healthcare with AI-powered medical analysis
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Mission Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At Code Chikitsak, we believe that everyone deserves access to intelligent healthcare insights. 
              Our mission is to democratize medical knowledge by providing AI-powered analysis tools that help 
              individuals understand their medical history and make informed health decisions.
            </p>
          </section>

          {/* What We Do */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔬 What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">📄 Document Analysis</h3>
                <p className="text-gray-700">
                  We use advanced AI to extract and analyze key information from medical PDFs, 
                  making complex medical data accessible and understandable.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">🤖 AI Insights</h3>
                <p className="text-gray-700">
                  Our AI provides personalized recommendations based on your medical history 
                  and current symptoms, helping you understand potential health implications.
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">🔒 Privacy First</h3>
                <p className="text-gray-700">
                  We prioritize your privacy and data security. Your medical information is 
                  processed securely and never stored permanently on our servers.
                </p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">🎯 Accuracy</h3>
                <p className="text-gray-700">
                  Our AI models are trained on vast medical datasets to provide accurate 
                  and reliable analysis while continuously improving through feedback.
                </p>
              </div>
            </div>
          </section>

          {/* Technology */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ Technology</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                Code Chikitsak is built using cutting-edge technologies:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <strong>Advanced NLP Models:</strong> For medical text understanding and analysis
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <strong>Machine Learning:</strong> For pattern recognition and symptom correlation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  <strong>Secure Processing:</strong> End-to-end encryption for data protection
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  <strong>Modern Web Stack:</strong> React, Tailwind CSS, and FastAPI for seamless experience
                </li>
              </ul>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-800 mb-3">⚠️ Important Disclaimer</h2>
            <p className="text-yellow-800 leading-relaxed">
              <strong>Code Chikitsak is designed for informational purposes only.</strong> Our AI analysis 
              should not be considered as medical advice, diagnosis, or treatment recommendations. 
              Always consult with qualified healthcare professionals for medical decisions. 
              In case of medical emergencies, contact your local emergency services immediately.
            </p>
          </section>

          {/* Team */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">👥 Our Team</h2>
            <p className="text-gray-700 leading-relaxed">
              We are a passionate team of developers, data scientists, and healthcare enthusiasts 
              committed to making healthcare more accessible through technology. Our diverse 
              backgrounds in AI, healthcare, and software development drive us to create 
              innovative solutions that can make a real difference in people's lives.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About
