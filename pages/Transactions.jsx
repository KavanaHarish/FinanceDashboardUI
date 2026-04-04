import { useState, useMemo } from "react";
import { useApp, CATEGORY_COLORS, CATEGORY_ICONS } from "../context/AppContext";

const CATEGORIES = ["Food", "Shopping", "Utilities", "Transport", "Health", "Subscriptions", "Education", "Income"];

function TransactionModal({ tx, onClose, onSave }) {
  const [form, setForm] = useState(tx || {
    description: "", amount: "", category: "Food", type: "expense", date: new Date().toISOString().slice(0, 10)
  });

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.description || !form.amount || !form.date) return;
    onSave({
      ...form,
      id: form.id || Date.now(),
      amount: parseFloat(form.amount),
      type: form.category === "Income" ? "income" : form.type,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">{tx ? "Edit Transaction" : "Add Transaction"}</div>

        <div className="modal-field">
          <label className="modal-label">Description</label>
          <input className="modal-input" value={form.description} onChange={e => handle("description", e.target.value)} placeholder="e.g. Grocery Store" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="modal-field">
            <label className="modal-label">Amount ($)</label>
            <input className="modal-input" type="number" value={form.amount} onChange={e => handle("amount", e.target.value)} placeholder="0.00" min="0" step="0.01" />
          </div>
          <div className="modal-field">
            <label className="modal-label">Date</label>
            <input className="modal-input" type="date" value={form.date} onChange={e => handle("date", e.target.value)} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="modal-field">
            <label className="modal-label">Category</label>
            <select className="modal-input" value={form.category} onChange={e => {
              const cat = e.target.value;
              handle("category", cat);
              if (cat === "Income") handle("type", "income");
              else handle("type", "expense");
            }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="modal-field">
            <label className="modal-label">Type</label>
            <select className="modal-input" value={form.type} onChange={e => handle("type", e.target.value)} disabled={form.category === "Income"}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-gold" onClick={submit}>{tx ? "Save Changes" : "Add Transaction"}</button>
        </div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const { state, dispatch } = useApp();
  const { transactions, filters, role } = state;
  const [modal, setModal] = useState(null); // null | "add" | tx object

  const isAdmin = role === "admin";

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    if (filters.type !== "all") list = list.filter(t => t.type === filters.type);
    if (filters.category !== "all") list = list.filter(t => t.category === filters.category);
    switch (filters.sort) {
      case "date_desc": list.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case "date_asc":  list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case "amount_desc": list.sort((a, b) => b.amount - a.amount); break;
      case "amount_asc":  list.sort((a, b) => a.amount - b.amount); break;
      default: break;
    }
    return list;
  }, [transactions, filters]);

  const setFilter = (key, val) => dispatch({ type: "SET_FILTER", payload: { [key]: val } });
  const fmt = v => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
  const formatDate = d => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleSave = (tx) => {
    if (modal && modal !== "add") dispatch({ type: "EDIT_TRANSACTION", payload: tx });
    else dispatch({ type: "ADD_TRANSACTION", payload: tx });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  const allCategories = [...new Set(transactions.map(t => t.category))].sort();

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{filtered.length} of {transactions.length} transactions</p>
        </div>
        {isAdmin && (
          <button className="btn-gold" onClick={() => setModal("add")}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Transaction
          </button>
        )}
      </div>

      
      <div className="glass-card" style={{ marginBottom: 20, padding: "16px 20px" }}>
        <div className="filters-bar" style={{ marginBottom: 0 }}>
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={e => setFilter("search", e.target.value)}
            />
          </div>
          <select className="filter-select" value={filters.type} onChange={e => setFilter("type", e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="filter-select" value={filters.category} onChange={e => setFilter("category", e.target.value)}>
            <option value="all">All Categories</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={filters.sort} onChange={e => setFilter("sort", e.target.value)}>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
          {(filters.search || filters.type !== "all" || filters.category !== "all") && (
            <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => dispatch({ type: "SET_FILTER", payload: { search: "", type: "all", category: "all" } })}>
              Clear
            </button>
          )}
        </div>
      </div>

      
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No transactions match your filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  {isAdmin && <th style={{ textAlign: "center" }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: `${CATEGORY_COLORS[tx.category] || "#888"}1A`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, flexShrink: 0,
                        }}>
                          {CATEGORY_ICONS[tx.category] || "💳"}
                        </div>
                        <span style={{ fontWeight: 500 }}>{tx.description}</span>
                      </div>
                    </td>
                    <td>
                      <span className="tx-category-badge" style={{
                        background: `${CATEGORY_COLORS[tx.category] || "#888"}18`,
                        color: CATEGORY_COLORS[tx.category] || "#888",
                      }}>
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{formatDate(tx.date)}</td>
                    <td><span className={`tx-type-badge ${tx.type}`}>{tx.type}</span></td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`tx-amount ${tx.type}`} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14 }}>
                        {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button className="btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setModal(tx)}>Edit</button>
                          <button onClick={() => handleDelete(tx.id)} style={{
                            background: "var(--red-dim)", border: "1px solid rgba(255,90,110,0.2)",
                            color: "var(--red)", borderRadius: 6, padding: "5px 10px",
                            fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                          }}>Del</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        {[
          { label: "Showing", value: `${filtered.length} transactions`, color: "var(--text-secondary)" },
          { label: "Total In", value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)), color: "var(--teal)" },
          { label: "Total Out", value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)), color: "var(--red)" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)", padding: "10px 16px",
            fontSize: 13,
          }}>
            <span style={{ color: "var(--text-muted)", marginRight: 6 }}>{s.label}:</span>
            <span style={{ color: s.color, fontWeight: 600 }}>{s.value}</span>
          </div>
        ))}
      </div>

      {modal && (
        <TransactionModal
          tx={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
