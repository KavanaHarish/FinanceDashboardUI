import { useApp } from "../context/AppContext";

const NAV_ITEMS = [
  { id: "dashboard",     label: "Dashboard",     icon: <GridIcon /> },
  { id: "transactions",  label: "Transactions",  icon: <TxIcon /> },
  { id: "insights",      label: "Insights",      icon: <InsightIcon /> },
];

function GridIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="6" height="6" rx="1.5"/>
      <rect x="10" y="1" width="6" height="6" rx="1.5"/>
      <rect x="1" y="10" width="6" height="6" rx="1.5"/>
      <rect x="10" y="10" width="6" height="6" rx="1.5"/>
    </svg>
  );
}
function TxIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h11M3 8.5h7M3 12h5"/><path d="M13 10l2 2-2 2"/>
    </svg>
  );
}
function InsightIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13l4-5 3 3 3-6 3 4"/>
    </svg>
  );
}

export default function Sidebar({ activePage, setActivePage }) {
  const { state, dispatch } = useApp();

  return (
    <aside style={{
      position: "fixed",
      top: 0, left: 0, bottom: 0,
      width: "var(--sidebar-w)",
      background: "var(--bg-surface)",
      borderRight: "1px solid var(--border-subtle)",
      display: "flex",
      flexDirection: "column",
      padding: "0",
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "26px 24px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 34, height: 34,
            background: "var(--gold)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800, fontSize: 16,
            color: "#080C10",
          }}>F</div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px", color: "var(--text-primary)" }}>FinanceFlow</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>Personal Finance</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "var(--text-muted)", padding: "0 10px", marginBottom: 8, textTransform: "uppercase" }}>Menu</div>
        {NAV_ITEMS.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: isActive ? "var(--gold-dim)" : "transparent",
                color: isActive ? "var(--gold)" : "var(--text-secondary)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                marginBottom: 2,
                transition: "all var(--transition)",
                textAlign: "left",
                borderLeft: isActive ? "2px solid var(--gold)" : "2px solid transparent",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-elevated)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Role Switcher */}
      <div style={{
        margin: "0 12px 16px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        padding: "14px 14px",
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase" }}>Role</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["viewer", "admin"].map(r => (
            <button
              key={r}
              onClick={() => dispatch({ type: "SET_ROLE", payload: r })}
              style={{
                flex: 1,
                padding: "7px 0",
                border: "1px solid",
                borderColor: state.role === r ? "var(--gold)" : "var(--border-subtle)",
                borderRadius: 6,
                background: state.role === r ? "var(--gold-dim)" : "transparent",
                color: state.role === r ? "var(--gold)" : "var(--text-muted)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all var(--transition)",
              }}
            >{r}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.4 }}>
          {state.role === "admin"
            ? "✏️ Admin: can add & edit transactions"
            : "👁️ Viewer: read-only mode"}
        </div>
      </div>

      {/* User Badge */}
      <div style={{
        padding: "14px 16px",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{
          width: 32, height: 32,
          borderRadius: "50%",
          background: "var(--blue-dim)",
          border: "1px solid rgba(74,158,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: "var(--blue)",
        }}>JD</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>John Doe</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{state.role === "admin" ? "Administrator" : "Viewer"}</div>
        </div>
      </div>
    </aside>
  );
}
