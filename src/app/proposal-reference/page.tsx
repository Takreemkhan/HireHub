'use client';

export default function ProposalReferencePage() {
  return (
    <div style={{ background: '#0f2a44', minHeight: '100vh', padding: 24, fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ color: '#ffffff', marginBottom: 24 }}>
          FreelanceHub Pro – Proposal Experience (Reference UI)
        </h1>

        <div style={{ display: 'flex', gap: 20 }}>
          {/* CLIENT REVIEW SIDE */}
          <div style={{ flex: 1 }}>
            <div style={cardStyle}>
              <h2 style={h2Style}>Client – Review Proposals</h2>
              <p><b>Project:</b> Website Development for Startup</p>
              <p><b>Budget:</b> ₹40k – ₹70k | <b>Timeline:</b> 3–4 weeks</p>

              <div style={{ marginBottom: 16 }}>
                <button style={btnOutline}>All</button>
                <button style={btnOutline}>Recommended</button>
                <button style={btnOutline}>Experienced</button>
                <button style={btnOutline}>New</button>
              </div>

              <h3>⭐ Recommended</h3>
              <div style={proposalStyle}>
                <div style={avatarStyle}>R</div>
                <div style={{ flex: 1 }}>
                  <b>Rahul Sharma</b><br />
                  <Badge text="✔ Verified" bg="#dcfce7" color="#166534" />
                  <Badge text="⭐ Experienced" bg="#e0f2fe" color="#075985" />
                  <p>I will design and develop a scalable website with clean UI, optimized performance and proper testing. Weekly updates included.</p>
                </div>
                <div>
                  <div style={priceStyle}>₹55,000</div>
                  <button style={btnPrimary}>Hire</button>
                </div>
              </div>

              <h3>🆕 New Talent</h3>
              <div style={proposalStyle}>
                <div style={avatarStyle}>A</div>
                <div style={{ flex: 1 }}>
                  <b>Ankit Verma</b><br />
                  <Badge text="🆕 New" bg="#f1f5f9" color="#334155" />
                  <p>I am a motivated developer and can complete this project efficiently with regular communication and revisions.</p>
                </div>
                <div>
                  <div style={priceStyle}>₹35,000</div>
                  <button style={btnPrimary}>Hire</button>
                </div>
              </div>
            </div>
          </div>

          {/* FREELANCER SUBMIT SIDE */}
          <div style={{ flex: 1 }}>
            <div style={{ ...cardStyle, background: '#f8fafc' }}>
              <h2 style={h2Style}>Freelancer – Submit Proposal</h2>
              <p>Project: Website Development for Startup</p>

              <label>Proposed Price</label>
              <input style={inputStyle} placeholder="₹ 45,000" />
              <p style={{ fontSize: 12 }}>Most similar projects: ₹40k – ₹70k</p>

              <label>Timeline</label>
              <select style={inputStyle}>
                <option>2 weeks</option>
                <option>3 weeks</option>
                <option>1 month</option>
              </select>

              <label>Proposal Message</label>
              <textarea
                rows={6}
                style={inputStyle}
                placeholder="Briefly explain how you will handle this project, timeline & cost (80–200 words)"
              />

              <button style={{ ...btnPrimary, width: '100%' }}>Submit Proposal</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ text, bg, color }: { text: string; bg: string; color: string }) {
  return (
    <span style={{
      background: bg,
      color,
      padding: '4px 10px',
      borderRadius: 999,
      fontSize: 12,
      marginRight: 6
    }}>
      {text}
    </span>
  );
}

const cardStyle = {
  background: '#ffffff',
  borderRadius: 14,
  padding: 20,
  boxShadow: '0 10px 30px rgba(0,0,0,.12)'
};

const proposalStyle = {
  display: 'flex',
  gap: 16,
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 16,
  marginBottom: 14
};

const avatarStyle = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: '#c7d2fe',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700
};

const btnPrimary = {
  padding: '10px 16px',
  borderRadius: 10,
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  background: '#f97316',
  color: '#ffffff'
};

const btnOutline = {
  padding: '8px 14px',
  borderRadius: 10,
  border: '1px solid #cbd5f5',
  background: '#ffffff',
  cursor: 'pointer',
  marginRight: 8
};

const priceStyle = {
  fontSize: 18,
  fontWeight: 700,
  color: '#0f2a44',
  marginBottom: 8
};

const inputStyle = {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: '1px solid #cbd5f5',
  marginBottom: 12
};

const h2Style = { color: '#0f2a44', marginBottom: 12 };
