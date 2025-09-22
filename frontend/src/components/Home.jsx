import React from 'react';

const features = [
  {
    icon: '📊',
    title: 'Smart Dashboard',
    description: 'Get real-time insights into your financial health with interactive charts and personalized recommendations.',
    color: 'from-blue-500 to-purple-600'
  },
  {
    icon: '➕',
    title: 'Add Transaction',
    description: 'Easily track your income and expenses with a simple, intuitive form and automatic categorization.',
    color: 'from-green-500 to-teal-600'
  },
  {
    icon: '📅',
    title: 'Calendar View',
    description: 'Never miss a bill or milestone with our intelligent calendar system and smart reminders.',
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: '🤖',
    title: 'AI Finance Assistant',
    description: 'Get personalized financial advice, spending insights, and budget recommendations from our AI assistant.',
    color: 'from-orange-500 to-red-600'
  },
  {
    icon: '📈',
    title: 'Advanced Reports',
    description: 'Generate detailed financial reports with customizable charts, trends, and export capabilities.',
    color: 'from-indigo-500 to-blue-600'
  },
  {
    icon: '👤',
    title: 'Secure Profile',
    description: 'Manage your profile securely with bank-level encryption and privacy protection.',
    color: 'from-pink-500 to-rose-600'
  }
];

const stats = [
  { value: "10+", label: "Active Users", icon: "⭐" },
  { value: "$2B+", label: "Tracked Finances", icon: "💰" },
  { value: "99.9%", label: "Uptime", icon: "🛡️" },
  { value: "4.9", label: "User Rating", icon: "⭐" }
];

const benefits = [
  "Real-time expense tracking and categorization",
  "AI-powered financial insights and recommendations",
  "Multi-account synchronization and management",
  "Advanced budget planning and goal setting",
  "Secure bank-level encryption and privacy",
  "Mobile and desktop accessibility"
];

const Home = ({ onLoginClick, onSignupClick }) => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #a855f7 100%)', fontFamily: 'Inter, Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif', display: 'flex', flexDirection: 'column' }}>
    
    {/* Hero Section */}
    <section style={{ textAlign: 'center', padding: '80px 16px 60px 16px', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          fontWeight: 900, 
          margin: '0 0 24px 0', 
          letterSpacing: '-2px',
          background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1
        }}>
          Master Your Financial Future
        </h1>
        <p style={{ 
          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', 
          color: 'rgba(255,255,255,0.9)', 
          maxWidth: 700, 
          margin: '0 auto 40px auto', 
          fontWeight: 500,
          lineHeight: 1.6
        }}>
          Empower your financial journey with AI-driven insights, comprehensive tracking, 
          and professional-grade tools designed for modern financial management.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 40 }}>
          <button 
            onClick={onSignupClick}
            style={{ 
              background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)', 
              color: '#fff', 
              border: 'none', 
              fontWeight: 700, 
              fontSize: '18px', 
              cursor: 'pointer', 
              padding: '16px 32px', 
              borderRadius: '12px', 
              boxShadow: '0 8px 32px rgba(102,126,234,0.3)',
              transition: 'all 0.3s ease',
              minWidth: '180px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 40px rgba(102,126,234,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(102,126,234,0.3)';
            }}
          >
            Get Started Free
          </button>
          <button 
            onClick={onLoginClick}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              color: '#fff', 
              border: '2px solid rgba(255,255,255,0.2)', 
              fontWeight: 600, 
              fontSize: '18px', 
              cursor: 'pointer', 
              padding: '16px 32px', 
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              minWidth: '180px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.border = '2px solid rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.border = '2px solid rgba(255,255,255,0.2)';
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </section>

    {/* Stats Section */}
    <section style={{ padding: '60px 16px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{stat.icon}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{stat.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section style={{ padding: '80px 16px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ 
            color: '#fff', 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: 800, 
            marginBottom: 20,
            letterSpacing: '-1px'
          }}>
            Everything You Need for Financial Success
          </h2>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '1.2rem', 
            maxWidth: 600, 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Comprehensive tools and insights to take control of your finances and achieve your goals
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 30 }}>
          {features.map((feature, idx) => (
            <div key={feature.title} style={{ 
              background: 'rgba(255,255,255,0.08)', 
              borderRadius: '20px', 
              padding: '32px', 
              border: '1px solid rgba(255,255,255,0.12)', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.background = 'rgba(255,255,255,0.12)';
              e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.background = 'rgba(255,255,255,0.08)';
              e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
            }}
            >
              <div style={{ fontSize: 48, marginBottom: 20 }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: 12 }}>{feature.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits Section */}
    <section style={{ padding: '80px 16px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ 
            color: '#fff', 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: 800, 
            marginBottom: 20 
          }}>
            Why Choose FinTrack?
          </h2>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '1.2rem', 
            maxWidth: 600, 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Join thousands of users who have transformed their financial lives
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {benefits.map((benefit, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 16, 
              padding: '24px', 
              background: 'rgba(255,255,255,0.08)', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ 
                fontSize: 20, 
                color: '#10b981', 
                flexShrink: 0, 
                marginTop: 2 
              }}>✓</div>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: 1.6 }}>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section style={{ padding: '80px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.08)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '24px', 
          padding: '60px 40px', 
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ 
            color: '#fff', 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: 800, 
            marginBottom: 20 
          }}>
            Ready to Transform Your Finances?
          </h2>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '1.2rem', 
            marginBottom: 40,
            lineHeight: 1.6
          }}>
            Start your journey to financial freedom today. No credit card required for your free trial.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            <button 
              onClick={onSignupClick}
              style={{ 
                background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)', 
                color: '#fff', 
                border: 'none', 
                fontWeight: 700, 
                fontSize: '18px', 
                cursor: 'pointer', 
                padding: '16px 32px', 
                borderRadius: '12px', 
                boxShadow: '0 8px 32px rgba(102,126,234,0.3)',
                transition: 'all 0.3s ease',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 40px rgba(102,126,234,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 32px rgba(102,126,234,0.3)';
              }}
            >
              Get Started Free
            </button>
            <button 
              onClick={onLoginClick}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                color: '#fff', 
                border: '2px solid rgba(255,255,255,0.2)', 
                fontWeight: 600, 
                fontSize: '18px', 
                cursor: 'pointer', 
                padding: '16px 32px', 
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.border = '2px solid rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.border = '2px solid rgba(255,255,255,0.2)';
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Footer - Same as Footer.jsx */}
    <footer style={{
      width: "100%",
      background: "rgba(15, 23, 42, 0.9)",
      backdropFilter: "blur(20px)",
      color: "rgba(255, 255, 255, 0.7)",
      textAlign: "center",
      padding: "32px 0 24px 0",
      fontSize: 14,
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      marginTop: 48,
      letterSpacing: 0.5,
      fontWeight: 500,
      zIndex: 10,
      position: "relative"
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <div style={{
              fontSize: 20,
              background: "linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)",
              borderRadius: "8px",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              💎
            </div>
            <span style={{
              background: "linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 700,
              fontSize: 16
            }}>
              FinTrack
            </span>
          </div>
          <div style={{
            fontSize: 13,
            color: "rgba(255, 255, 255, 0.5)"
          }}>
            © {new Date().getFullYear()} FinTrack. All rights reserved.
          </div>
          <div style={{
            display: "flex",
            gap: 16,
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.6)"
          }}>
            <span style={{ cursor: "pointer", transition: "color 0.3s" }}>Privacy</span>
            <span style={{ cursor: "pointer", transition: "color 0.3s" }}>Terms</span>
            <span style={{ cursor: "pointer", transition: "color 0.3s" }}>Support</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default Home; 