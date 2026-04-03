# FinanceFlow — Personal Finance Dashboard

A clean, dark-luxury finance dashboard built with React + Vite. Designed as a screening assignment for a frontend internship role showcasing UI design, component architecture, state management, and role-based access control.

![FinanceFlow Dashboard](https://placehold.co/1200x600/080C10/D4A843?text=FinanceFlow+Dashboard)

---

## ✨ Features

### Dashboard Overview
- **4 Summary Cards** — Net Balance, Total Income, Total Expenses, Savings Rate
- **Balance Trend Chart** — Custom SVG line chart with area fill showing 6-month rolling balance
- **Spending Donut Chart** — Custom SVG donut chart with category breakdown legend
- **Recent Transactions** — Latest 6 transactions with category icons

### Transactions
- **Full transaction list** with date, description, category, type, and amount
- **Search** — filter by description or category keyword
- **Filter** — by type (income/expense) and category
- **Sort** — by date (newest/oldest) or amount (highest/lowest)
- **Admin CRUD** — add, edit, delete transactions (admin role only)
- **Summary bar** — live totals for the filtered view

### Insights
- **Highest spending category** with percentage of total
- **Month-over-month comparison** — spending change vs previous month
- **Savings rate** with contextual advice
- **Average transaction value**
- **Monthly income vs expenses** — horizontal bar chart across all months
- **Category breakdown** — animated progress bars with amounts and percentages

### Role-Based UI
- **Viewer** — read-only access; no edit/add/delete buttons visible
- **Admin** — full CRUD access on transactions
- Role toggled via sidebar switcher; persisted in localStorage

---

## 🛠 Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 | Industry standard, required for modern SPAs |
| Build Tool | Vite | Fast HMR and dev experience |
| Styling | Pure CSS with CSS Variables | Full control, no extra dependencies |
| Charts | Custom SVG | Zero dependencies, fully themed |
| State | React Context + useReducer | Appropriate for this app size |
| Persistence | localStorage | Data survives page refresh |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/KavanaHarish/FinanceDashboardUI.git
cd FinanceDashboardUI

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── context/
│   └── AppContext.jsx      
├── components/
│   └── Sidebar.jsx         
├── pages/
│   ├── Dashboard.jsx       
│   ├── Transactions.jsx    
│   └── Insights.jsx        
├── App.jsx                 
├── main.jsx                
└── index.css               
```

---

## 🎨 Design Decisions

**Dark Luxury Theme** — Deep obsidian blacks (`#080C10`) with amber/gold accents (`#D4A843`). Chosen because finance apps benefit from a professional, premium feel that dark mode naturally provides.

**Custom SVG Charts** — Rather than importing Recharts or Chart.js, all charts are hand-coded SVGs. This demonstrates understanding of SVG coordinate systems and math, and keeps the bundle tiny.

**CSS Variables Design System** — All colors, radii, and transitions live in `:root` variables for easy theming and consistency.

**useReducer Pattern** — State is managed via a single `AppContext` with typed action dispatches, mimicking a lightweight Redux-style pattern that scales cleanly.

**localStorage Persistence** — Transactions and role are persisted across sessions. The initial seed data loads only if localStorage is empty.

---

## 🔐 Role-Based Access

| Feature | Viewer | Admin |
|---|---|---|
| View Dashboard | ✅ | ✅ |
| View Transactions | ✅ | ✅ |
| View Insights | ✅ | ✅ |
| Add Transaction | ❌ | ✅ |
| Edit Transaction | ❌ | ✅ |
| Delete Transaction | ❌ | ✅ |

Switch roles using the toggle in the bottom of the sidebar. No backend — roles are simulated on the frontend.

---

## 📱 Responsive Design

- Sidebar collapses on screens below 900px
- Summary grid adapts from 4-column to 2-column on mobile
- Charts stack vertically on narrow viewports
- Filters bar wraps gracefully on small screens
- Transaction table scrolls horizontally when needed

---

## 🧩 Assumptions Made

1. All amounts are in USD
2. "Income" is a category that automatically sets type to income
3. The seed data represents a 3-month period (Apr–Jun 2024)
4. Role switching is a demo feature no auth backend needed

---

## 📬 Contact

Built by [Kavana Harish] · [kavanahpoojary@gmail.com]
