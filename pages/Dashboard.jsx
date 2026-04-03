import { useMemo } from "react";
import { useApp, CATEGORY_COLORS, CATEGORY_ICONS } from "../context/AppContext";

function BalanceTrendChart({ data }) {
  const W = 580, H = 180;
  const pad = { top: 16, right: 16, bottom: 32, left: 52 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const min = Math.min(...data.map(d => d.balance)) * 0.97;
  const max = Math.max(...data.map(d => d.balance)) * 1.02;
  const n = data.length;

  const x = i => pad.left + (i / (n - 1)) * innerW;
  const y = v => pad.top + innerH - ((v - min) / (max - min)) * innerH;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.balance).toFixed(1)}`).join(" ");
  const areaPath = linePath + ` L${x(n - 1).toFixed(1)},${(pad.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(pad.top + innerH).toFixed(1)} Z`;

  const yTicks = [min, (min + max) / 2, max];
  const formatK = v => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`;

  return (
    <div className="chart-wrapper">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4A843" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#D4A843" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line
              x1={pad.left} y1={y(v).toFixed(1)}
              x2={pad.left + innerW} y2={y(v).toFixed(1)}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1"
            />
            <text x={pad.left - 8} y={y(v) + 4} textAnchor="end" fill="#4A505C" fontSize="10" fontFamily="DM Sans, sans-serif">
              {formatK(v)}
            </text>
          </g>
        ))}
        {/* Month labels */}
        {data.map((d, i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fill="#4A505C" fontSize="11" fontFamily="DM Sans, sans-serif">
            {d.month}
          </text>
        ))}
        {/* Area */}
        <path d={areaPath} fill="url(#areaGrad)"/>
        {/* Line */}
        <path d={linePath} fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Dots */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(d.balance)} r="4" fill="#080C10" stroke="#D4A843" strokeWidth="2"/>
            {i === n - 1 && (
              <text x={x(i)} y={y(d.balance) - 10} textAnchor="middle" fill="#D4A843" fontSize="10" fontFamily="Syne, sans-serif" fontWeight="700">
                {formatK(d.balance)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function DonutChart({ data }) {
  const size = 160, cx = size / 2, cy = size / 2, r = 58, innerR = 36;
  const total = data.reduce((s, d) => s + d.value, 0);

  let angle = -Math.PI / 2;
  const slices = data.map(d => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const startAngle = angle;
    angle += sweep; 
    const endAngle = angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const xi1 = cx + innerR * Math.cos(startAngle);
    const yi1 = cy + innerR * Math.sin(startAngle);
    const xi2 = cx + innerR * Math.cos(endAngle);
    const yi2 = cy + innerR * Math.sin(endAngle);
    const large = sweep > Math.PI ? 1 : 0;
    return { ...d, path: `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${xi2.toFixed(2)},${yi2.toFixed(2)} A${innerR},${innerR} 0 ${large},0 ${xi1.toFixed(2)},${yi1.toFixed(2)} Z` };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: 140, flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} opacity="0.9"/>
        ))}
        <text x={cx} y={cy - 5} textAnchor="middle" fill="#F0EDE8" fontSize="13" fontFamily="Syne, sans-serif" fontWeight="700">
          ${(total / 1000).toFixed(1)}k
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#4A505C" fontSize="9" fontFamily="DM Sans, sans-serif">
          SPENT
        </text>
      </svg>
      <div className="donut-legend" style={{ flex: 1 }}>
        {data.slice(0, 5).map((d, i) => (
          <div key={i} className="legend-item">
            <span className="legend-label">
              <span className="legend-dot" style={{ background: d.color }}></span>
              {d.label}
            </span>
            <span className="legend-value">${d.value.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { state } = useApp();
  const { transactions, balanceTrend } = state;

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const balance = income - expenses;
    const savings = income > 0 ? ((income - expenses) / income) * 100 : 0;
    return { income, expenses, balance, savings };
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] || "#888" }));
  }, [transactions]);

  const recentTx = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6),
    [transactions]
  );

  const fmt = v => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
  const formatDate = d => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your financial overview at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card gold">
          <div className="card-top">
            <span className="card-label">Net Balance</span>
            <div className="card-icon-bg">💰</div>
          </div>
          <div className="card-value">{fmt(stats.balance)}</div>
          <div className="card-change positive">▲ 12.4% from last month</div>
        </div>
        <div className="summary-card teal">
          <div className="card-top">
            <span className="card-label">Total Income</span>
            <div className="card-icon-bg">📈</div>
          </div>
          <div className="card-value">{fmt(stats.income)}</div>
          <div className="card-change positive">▲ 8.1% from last month</div>
        </div>
        <div className="summary-card red">
          <div className="card-top">
            <span className="card-label">Total Expenses</span>
            <div className="card-icon-bg">📉</div>
          </div>
          <div className="card-value">{fmt(stats.expenses)}</div>
          <div className="card-change negative">▲ 3.2% from last month</div>
        </div>
        <div className="summary-card purple">
          <div className="card-top">
            <span className="card-label">Savings Rate</span>
            <div className="card-icon-bg">🎯</div>
          </div>
          <div className="card-value">{stats.savings.toFixed(1)}%</div>
          <div className="card-change positive">▲ 2.4% from last month</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="glass-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Balance Trend</div>
              <div className="chart-subtitle">6-month rolling balance</div>
            </div>
            <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: "var(--gold-dim)", color: "var(--gold)", fontWeight: 600 }}>2024</span>
          </div>
          <BalanceTrendChart data={balanceTrend} />
        </div>

        <div className="glass-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Spending Breakdown</div>
              <div className="chart-subtitle">By category</div>
            </div>
          </div>
          <DonutChart data={categoryBreakdown} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card">
        <div className="chart-header">
          <div>
            <div className="chart-title">Recent Transactions</div>
            <div className="chart-subtitle">Latest activity</div>
          </div>
        </div>
        {recentTx.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet</p>
          </div>
        ) : (
          recentTx.map(tx => (
            <div key={tx.id} className="recent-tx-row">
              <div className="tx-icon-circle" style={{ background: `${CATEGORY_COLORS[tx.category]}1A` }}>
                {CATEGORY_ICONS[tx.category] || "💳"}
              </div>
              <div className="tx-meta">
                <div className="tx-name">{tx.description}</div>
                <div className="tx-date">{formatDate(tx.date)} · {tx.category}</div>
              </div>
              <div className={`tx-amount-right ${tx.type}`}>
                {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
