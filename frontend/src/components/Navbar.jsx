import React from 'react'

const Navbar = ({ activeTab, setActiveTab, onExport, onImport }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add', label: 'Add Transaction', icon: '➕' },
    { id: 'transactions', label: 'Transactions', icon: '📝' },
    { id: 'summary', label: 'Summary', icon: '📈' },
    { id: 'assistant', label: 'AI Assistant', icon: '🤖' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'admin', label: 'Admin', icon: '👑' }
  ];

  return (
    <nav style={{
      width: '100%',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 80
      }}>
        {/* Brand Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <div style={{
            fontSize: 32,
            background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
            borderRadius: '12px',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(96, 165, 250, 0.3)'
          }}>
            💎
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            margin: 0,
            background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            FinTrack
          </h1>
        </div>

        {/* Navigation Tabs - Equal Space */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'space-evenly',
          maxWidth: 800,
          margin: '0 24px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)'
                  : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                fontSize: 12,
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === tab.id 
                  ? '0 4px 16px rgba(96, 165, 250, 0.4)' 
                  : 'none',
                fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
                minWidth: 80,
                flex: 1,
                maxWidth: 120
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = '#ffffff';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <span style={{
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {tab.icon}
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 'inherit',
                textAlign: 'center',
                lineHeight: 1.2
              }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar