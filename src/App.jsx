import { useState } from 'react'
import './App.css'

const industries = [
  { id: 'retail', label: 'Retail & E-commerce', icon: '🛒' },
  { id: 'healthcare', label: 'Healthcare & Medical', icon: '🏥' },
  { id: 'finance', label: 'Finance & Banking', icon: '🏦' },
  { id: 'realestate', label: 'Real Estate', icon: '🏠' },
  { id: 'education', label: 'Education & Training', icon: '🎓' },
  { id: 'hospitality', label: 'Hospitality & Travel', icon: '✈️' },
  { id: 'automotive', label: 'Automotive', icon: '🚗' },
  { id: 'professional', label: 'Professional Services', icon: '💼' },
  { id: 'technology', label: 'Technology & Software', icon: '💻' },
  { id: 'government', label: 'Government & Public', icon: '🏛️' },
  { id: 'food', label: 'Food & Beverage', icon: '🍽️' },
  { id: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
  { id: 'fitness', label: 'Fitness & Wellness', icon: '💪' },
  { id: 'legal', label: 'Legal Services', icon: '⚖️' },
  { id: 'nonprofit', label: 'Non-Profit', icon: '❤️' },
  { id: 'media', label: 'Media & Entertainment', icon: '🎬' },
  { id: 'other', label: 'Other', icon: '📦' },
]

const useCases = [
  { id: 'support', label: 'Customer Support', icon: '🎧' },
  { id: 'sales', label: 'Outbound Sales', icon: '📞' },
  { id: 'learning', label: 'Learning and Development', icon: '📚' },
  { id: 'scheduling', label: 'Scheduling', icon: '📅' },
  { id: 'leadqual', label: 'Lead Qualification', icon: '🎯' },
  { id: 'answering', label: 'Answering Service', icon: '📱' },
  { id: 'account', label: 'Account Inquiries', icon: '👤' },
  { id: 'loan', label: 'Loan Applications', icon: '💳' },
  { id: 'fraud', label: 'Fraud Alerts', icon: '🚨' },
  { id: 'investment', label: 'Investment Guidance', icon: '📈' },
  { id: 'billpay', label: 'Bill Payment Support', icon: '💵' },
  { id: 'planning', label: 'Financial Planning', icon: '🗂️' },
  { id: 'other', label: 'Other', icon: '✨' },
]

function App() {
  const [step, setStep] = useState(1)
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [selectedUseCase, setSelectedUseCase] = useState(null)
  const [isCallActive, setIsCallActive] = useState(false)

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry)
    setStep(2)
  }

  const handleUseCaseSelect = (useCase) => {
    setSelectedUseCase(useCase)
    setStep(3)
  }

  const handleStartCall = () => {
    setIsCallActive(true)
    // TODO: Integrate ElevenLabs Conversational AI here
    // const agentId = getAgentId(selectedIndustry, selectedUseCase)
    // startElevenLabsCall(agentId)
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setStep(1)
    setSelectedIndustry(null)
    setSelectedUseCase(null)
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      setSelectedIndustry(null)
    } else if (step === 3) {
      setStep(2)
      setSelectedUseCase(null)
    }
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="brand">
          <div className="brand-mark"></div>
          <span>SaasPro<span className="brand-highlight">Labs</span></span>
        </div>
        <span className="nav-badge">Demo</span>
      </nav>

      <main className="main">
        {step === 1 && (
          <section className="section">
            <div className="section-header">
              <h1>What industry is your business in?</h1>
              <p>Select the industry that best describes your business</p>
            </div>
            <div className="grid">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  className="card"
                  onClick={() => handleIndustrySelect(industry)}
                >
                  <span className="card-icon">{industry.icon}</span>
                  <span className="card-label">{industry.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="section">
            <div className="section-header">
              <button className="back-btn" onClick={handleBack}>
                ← Back
              </button>
              <h1>What will your agent help with?</h1>
              <p>Select the primary use case for your AI voice agent</p>
              <div className="selected-tag">
                {selectedIndustry?.icon} {selectedIndustry?.label}
              </div>
            </div>
            <div className="grid">
              {useCases.map((useCase) => (
                <button
                  key={useCase.id}
                  className="card"
                  onClick={() => handleUseCaseSelect(useCase)}
                >
                  <span className="card-icon">{useCase.icon}</span>
                  <span className="card-label">{useCase.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && !isCallActive && (
          <section className="section section-centered">
            <div className="section-header">
              <button className="back-btn" onClick={handleBack}>
                ← Back
              </button>
              <h1>Ready to experience the future?</h1>
              <p>Start a call with your AI voice agent</p>
              <div className="selected-tags">
                <div className="selected-tag">
                  {selectedIndustry?.icon} {selectedIndustry?.label}
                </div>
                <div className="selected-tag">
                  {selectedUseCase?.icon} {selectedUseCase?.label}
                </div>
              </div>
            </div>
            <button className="start-call-btn" onClick={handleStartCall}>
              <span className="call-icon">📞</span>
              Start Call
            </button>
            <p className="call-hint">Your browser will request microphone access</p>
          </section>
        )}

        {isCallActive && (
          <section className="section section-centered">
            <div className="call-active">
              <div className="call-pulse"></div>
              <div className="call-avatar">🤖</div>
              
              {/* Audio Wave Visualizer */}
              <div className="wave-container">
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
              
              <h2>Call in Progress</h2>
              <p>Speaking with your {selectedIndustry?.label} AI Agent</p>
              <div className="call-info">
                <span>{selectedUseCase?.icon} {selectedUseCase?.label}</span>
              </div>
              <button className="end-call-btn" onClick={handleEndCall}>
                End Call
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 SaasPro Labs. Voice AI agents for every sector.</p>
      </footer>
    </div>
  )
}

export default App
