import { useMemo } from "react";
import { useApp, CATEGORY_COLORS, CATEGORY_ICONS } from "../context/AppContext";

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  const fmt = v => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
  const fmtDec = v => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

  const expenses = transactions.filter(t => t.type === "expense");
  const incomes = transactions.filter(t => t.type === "income");

  
  const categoryMap = useMemo(() => {
    const m = {};
    expenses.forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const topCategory = categoryMap[0];
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
  const avgTx = expenses.length ? totalExpenses / expenses.length : 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

  
  const monthlyData = useMemo(() => {
    const months = {};
    transactions.forEach(t => {
      const key = t.date.slice(0, 7);
      if (!months[key]) months[key] = { income: 0, expense: 0 };
      months[key][t.type] += t.amount;
    });
    return Object.entries(months)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, vals]) => ({
        label: new Date(key + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        ...vals,
      }));
  }, [transactions]);

  const maxMonthlyVal = Math.max(...monthlyData.flatMap(m => [m.income, m.expense]));

  
  const currentMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];
  const monthChange = currentMonth && prevMonth
    ? ((currentMonth.expense - prevMonth.expense) / prevMonth.expense * 100)
    : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Insights</h1>
        <p className="page-subtitle">Patterns and trends in your spending</p>
      </div>

      
      <div className="insights-grid">
        <div className="insight-card" style={{ borderTop: "2px solid var(--red)" }}>
          <div className="insight-icon">🏆</div>
          <div className="insight-label">Highest Spending Category</div>
          <div className="insight-value" style={{ color: "var(--red)" }}>
            {topCategory ? topCategory[0] : "N/A"}
          </div>
          <div className="insight-desc">
            {topCategory
              ? `${fmt(topCategory[1])} total · ${((topCategory[1] / totalExpenses) * 100).toFixed(1)}% of all spending`
              : "No data"}
          </div>
        </div>

        <div className="insight-card" style={{ borderTop: "2px solid var(--teal)" }}>
          <div className="insight-icon">📅</div>
          <div className="insight-label">Month-over-Month</div>
          <div className="insight-value" style={{ color: monthChange > 0 ? "var(--red)" : "var(--teal)" }}>
            {monthChange > 0 ? "+" : ""}{monthChange.toFixed(1)}%
          </div>
          <div className="insight-desc">
            {currentMonth && prevMonth
              ? `Spending ${monthChange > 0 ? "increased" : "decreased"} vs last month (${fmt(prevMonth.expense)} → ${fmt(currentMonth.expense)})`
              : "Not enough data for comparison"}
          </div>
        </div>

        <div className="insight-card" style={{ borderTop: "2px solid var(--gold)" }}>
          <div className="insight-icon">💡</div>
          <div className="insight-label">Savings Rate</div>
          <div className="insight-value" style={{ color: "var(--gold)" }}>
            {savingsRate.toFixed(1)}%
          </div>
          <div className="insight-desc">
            {savingsRate >= 20
              ? "Great job! You're saving above the recommended 20%."
              : "Consider reducing expenses to improve your savings rate."}
          </div>
        </div>

        <div className="insight-card" style={{ borderTop: "2px solid var(--purple)" }}>
          <div className="insight-icon">📊</div>
          <div className="insight-label">Avg Transaction</div>
          <div className="insight-value" style={{ color: "var(--purple)" }}>
            {fmtDec(avgTx)}
          </div>
          <div className="insight-desc">
            Average expense across {expenses.length} transactions
          </div>
        </div>
      </div>

      
      <div className="glass-card" style={{ marginBottom: 20 }}>
        <div className="chart-header">
          <div>
            <div className="chart-title">Monthly Income vs Expenses</div>
            <div className="chart-subtitle">Comparison across all recorded months</div>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--teal)", display: "inline-block" }}></span>Income
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--red)", display: "inline-block" }}></span>Expenses
            </span>
          </div>
        </div>

        {monthlyData.length === 0 ? (
          <div className="empty-state"><p>No monthly data available</p></div>
        ) : (
          <div>
            {monthlyData.map((m, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 500 }}>{m.label}</div>
                <div className="monthly-bar-row" style={{ marginBottom: 6 }}>
                  <div className="monthly-bar-label" style={{ color: "var(--teal)", fontSize: 11 }}>IN</div>
                  <div className="monthly-bar-track">
                    <div className="monthly-bar-fill" style={{ width: `${(m.income / maxMonthlyVal) * 100}%`, background: "var(--teal)" }} />
                  </div>
                  <div className="monthly-bar-amount" style={{ color: "var(--teal)" }}>{fmt(m.income)}</div>
                </div>
                <div className="monthly-bar-row">
                  <div className="monthly-bar-label" style={{ color: "var(--red)", fontSize: 11 }}>OUT</div>
                  <div className="monthly-bar-track">
                    <div className="monthly-bar-fill" style={{ width: `${(m.expense / maxMonthlyVal) * 100}%`, background: "var(--red)" }} />
                  </div>
                  <div className="monthly-bar-amount" style={{ color: "var(--red)" }}>{fmt(m.expense)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="glass-card">
        <div className="chart-header">
          <div>
            <div className="chart-title">Category Breakdown</div>
            <div className="chart-subtitle">Total spending per category</div>
          </div>
        </div>

        {categoryMap.length === 0 ? (
          <div className="empty-state"><p>No expense data</p></div>
        ) : (
          <div>
            {categoryMap.map(([cat, val], i) => {
              const pct = (val / totalExpenses) * 100;
              const color = CATEGORY_COLORS[cat] || "#888";
              return (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15 }}>{CATEGORY_ICONS[cat] || "💳"}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-primary)" }}>{cat}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{pct.toFixed(1)}%</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color, fontFamily: "'Syne', sans-serif" }}>{fmt(val)}</span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: "var(--bg-elevated)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: color,
                      borderRadius: 3,
                      transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
