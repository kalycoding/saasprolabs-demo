import { useState } from 'react'
import { useConversation } from '@elevenlabs/react'
import './App.css'

const industries = [
  { 
    id: 'retail', 
    label: 'Retail & E-commerce', 
    icon: '🛒',
    capabilities: ['Order tracking', 'Product inquiries', 'Returns & refunds', 'Store availability']
  },
  { 
    id: 'healthcare', 
    label: 'Healthcare & Medical', 
    icon: '🏥',
    capabilities: ['Appointment scheduling', 'Prescription refills', 'Insurance questions', 'Lab results']
  },
  { 
    id: 'finance', 
    label: 'Finance & Banking', 
    icon: '🏦',
    capabilities: ['Account inquiries', 'Transaction history', 'Loan applications', 'Fraud alerts']
  },
  { 
    id: 'realestate', 
    label: 'Real Estate', 
    icon: '🏠',
    capabilities: ['Property inquiries', 'Schedule viewings', 'Price negotiations', 'Mortgage info']
  },
  { 
    id: 'hospitality', 
    label: 'Hospitality & Travel', 
    icon: '✈️',
    capabilities: ['Room bookings', 'Flight changes', 'Concierge services', 'Loyalty rewards']
  },
  { 
    id: 'restaurant', 
    label: 'Restaurant & Food', 
    icon: '🍽️',
    capabilities: ['Table reservations', 'Takeout orders', 'Menu questions', 'Delivery tracking']
  },
  { 
    id: 'automotive', 
    label: 'Automotive', 
    icon: '🚗',
    capabilities: ['Service appointments', 'Parts availability', 'Test drive booking', 'Warranty claims']
  },
  { 
    id: 'government', 
    label: 'Government & Public', 
    icon: '🏛️',
    capabilities: ['Permit applications', 'Service inquiries', 'Appointment booking', 'Document status']
  },
]

function App() {
  const [step, setStep] = useState(1)
  const [selectedIndustry, setSelectedIndustry] = useState(null)

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onError: (error) => console.error('Error:', error),
    onModeChange: (mode) => console.log('Mode changed:', mode),
  })

  const { status, startSession, endSession } = conversation
  const isSpeaking = status === 'speaking'
  const isConnected = status === 'connected' || status === 'speaking' || status === 'listening'
  const isConnecting = status === 'connecting'

  const getAgentId = () => {
    // Industry-specific agents
    if (selectedIndustry?.id === 'hospitality') {
      return 'agent_5101kqnqdch4etvvqs0sv5p4b04p'
    }
    // Default agent
    return 'agent_5601kqng0fntehg9tkpp5n8p95mv'
  }

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry)
    setStep(2)
  }

  const handleStartCall = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      await startSession({ agentId: getAgentId() })
    } catch (err) {
      console.error('Failed to start call:', err)
      alert('Failed to start call. Please allow microphone access.')
    }
  }

  const handleEndCall = async () => {
    await endSession()
    setStep(1)
    setSelectedIndustry(null)
  }

  const handleBack = () => {
    setStep(1)
    setSelectedIndustry(null)
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="brand">
          <svg className="brand-logo" width="28" height="28" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" fill="#863bff"/>
          </svg>
          <span>SaasPro<span className="brand-highlight">Labs</span></span>
        </div>
        <span className="nav-badge">Demo</span>
      </nav>

      <main className="main">
        {step === 1 && !isConnected && !isConnecting && (
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

        {step === 2 && !isConnected && !isConnecting && (
          <section className="section section-centered">
            <div className="section-header">
              <button className="back-btn" onClick={handleBack}>
                ← Back
              </button>
              <h1>Ready to experience the future?</h1>
              <p>Start a call with your AI voice agent</p>
              <div className="selected-tag">
                {selectedIndustry?.icon} {selectedIndustry?.label}
              </div>
            </div>
            
            <div className="capabilities">
              <p className="capabilities-title">This AI agent can help with:</p>
              <div className="capabilities-list">
                {selectedIndustry?.capabilities.map((cap, index) => (
                  <span key={index} className="capability-chip">{cap}</span>
                ))}
              </div>
            </div>

            <button className="start-call-btn" onClick={handleStartCall}>
              <span className="call-icon">📞</span>
              Start Call
            </button>
            <p className="call-hint">Your browser will request microphone access</p>
          </section>
        )}

        {isConnecting && (
          <section className="section section-centered">
            <div className="call-active">
              <div className="connecting-spinner"></div>
              <h2>Connecting...</h2>
              <p>Setting up your AI voice agent</p>
            </div>
          </section>
        )}

        {isConnected && (
          <section className="section section-centered">
            <div className="call-active">
              <div className="call-pulse"></div>
              <div className={`call-avatar ${isSpeaking ? 'speaking' : ''}`}>🤖</div>
              
              <div className={`wave-container ${isSpeaking ? 'active' : ''}`}>
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
              
              <h2>{isSpeaking ? 'Agent Speaking...' : 'Listening...'}</h2>
              <p>Speaking with your {selectedIndustry?.label} AI Agent</p>
              <div className="call-info">
                <span>{selectedIndustry?.icon} {selectedIndustry?.label}</span>
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
