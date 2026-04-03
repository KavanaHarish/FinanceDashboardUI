import { createContext, useContext, useReducer, useEffect } from "react";

const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2024-06-01", description: "Salary Deposit",       category: "Income",       type: "income",  amount: 5800.00 },
  { id: 2,  date: "2024-06-02", description: "Netflix",              category: "Subscriptions", type: "expense", amount: 15.99 },
  { id: 3,  date: "2024-06-03", description: "Grocery Store",        category: "Food",          type: "expense", amount: 124.50 },
  { id: 4,  date: "2024-06-05", description: "Freelance Payment",    category: "Income",       type: "income",  amount: 1200.00 },
  { id: 5,  date: "2024-06-07", description: "Electricity Bill",     category: "Utilities",    type: "expense", amount: 89.40 },
  { id: 6,  date: "2024-06-08", description: "Spotify",              category: "Subscriptions", type: "expense", amount: 9.99 },
  { id: 7,  date: "2024-06-10", description: "Restaurant",           category: "Food",          type: "expense", amount: 67.20 },
  { id: 8,  date: "2024-06-12", description: "Amazon Purchase",      category: "Shopping",      type: "expense", amount: 143.00 },
  { id: 9,  date: "2024-06-14", description: "Gym Membership",       category: "Health",        type: "expense", amount: 45.00 },
  { id: 10, date: "2024-06-15", description: "Dividend Income",      category: "Income",       type: "income",  amount: 320.00 },
  { id: 11, date: "2024-06-17", description: "Uber Ride",            category: "Transport",     type: "expense", amount: 23.50 },
  { id: 12, date: "2024-06-18", description: "Internet Bill",        category: "Utilities",    type: "expense", amount: 59.99 },
  { id: 13, date: "2024-06-20", description: "Coffee Shop",          category: "Food",          type: "expense", amount: 18.40 },
  { id: 14, date: "2024-06-21", description: "Clothing Store",       category: "Shopping",      type: "expense", amount: 210.00 },
  { id: 15, date: "2024-06-22", description: "Consulting Income",    category: "Income",       type: "income",  amount: 850.00 },
  { id: 16, date: "2024-06-23", description: "Pharmacy",             category: "Health",        type: "expense", amount: 35.60 },
  { id: 17, date: "2024-06-24", description: "Fuel",                 category: "Transport",     type: "expense", amount: 55.00 },
  { id: 18, date: "2024-06-25", description: "Online Course",        category: "Education",     type: "expense", amount: 79.00 },
  { id: 19, date: "2024-06-26", description: "Water Bill",           category: "Utilities",    type: "expense", amount: 32.00 },
  { id: 20, date: "2024-06-28", description: "Side Project Revenue", category: "Income",       type: "income",  amount: 620.00 },
  { id: 21, date: "2024-05-01", description: "Salary Deposit",       category: "Income",       type: "income",  amount: 5800.00 },
  { id: 22, date: "2024-05-05", description: "Grocery Store",        category: "Food",          type: "expense", amount: 110.00 },
  { id: 23, date: "2024-05-10", description: "Freelance Payment",    category: "Income",       type: "income",  amount: 900.00 },
  { id: 24, date: "2024-05-12", description: "Restaurant",           category: "Food",          type: "expense", amount: 55.00 },
  { id: 25, date: "2024-05-15", description: "Amazon Purchase",      category: "Shopping",      type: "expense", amount: 98.00 },
  { id: 26, date: "2024-05-18", description: "Electricity Bill",     category: "Utilities",    type: "expense", amount: 85.00 },
  { id: 27, date: "2024-05-20", description: "Gym Membership",       category: "Health",        type: "expense", amount: 45.00 },
  { id: 28, date: "2024-05-22", description: "Dividend Income",      category: "Income",       type: "income",  amount: 320.00 },
  { id: 29, date: "2024-05-25", description: "Clothing Store",       category: "Shopping",      type: "expense", amount: 135.00 },
  { id: 30, date: "2024-05-28", description: "Fuel",                 category: "Transport",     type: "expense", amount: 48.00 },
  { id: 31, date: "2024-04-01", description: "Salary Deposit",       category: "Income",       type: "income",  amount: 5800.00 },
  { id: 32, date: "2024-04-08", description: "Grocery Store",        category: "Food",          type: "expense", amount: 95.00 },
  { id: 33, date: "2024-04-12", description: "Online Course",        category: "Education",     type: "expense", amount: 129.00 },
  { id: 34, date: "2024-04-15", description: "Freelance Payment",    category: "Income",       type: "income",  amount: 1500.00 },
  { id: 35, date: "2024-04-20", description: "Amazon Purchase",      category: "Shopping",      type: "expense", amount: 76.00 },
  { id: 36, date: "2024-04-25", description: "Restaurant",           category: "Food",          type: "expense", amount: 88.00 },
];

const BALANCE_TREND = [
  { month: "Jan", balance: 8200 },
  { month: "Feb", balance: 9100 },
  { month: "Mar", balance: 8600 },
  { month: "Apr", balance: 10200 },
  { month: "May", balance: 11400 },
  { month: "Jun", balance: 12790 },
];

const initialState = {
  transactions: JSON.parse(localStorage.getItem("ff_transactions")) || INITIAL_TRANSACTIONS,
  role: localStorage.getItem("ff_role") || "viewer",
  filters: { search: "", type: "all", category: "all", sort: "date_desc" },
  balanceTrend: BALANCE_TREND,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      localStorage.setItem("ff_role", action.payload);
      return { ...state, role: action.payload };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "ADD_TRANSACTION": {
      const updated = [action.payload, ...state.transactions];
      localStorage.setItem("ff_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }
    case "EDIT_TRANSACTION": {
      const updated = state.transactions.map(t => t.id === action.payload.id ? action.payload : t);
      localStorage.setItem("ff_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }
    case "DELETE_TRANSACTION": {
      const updated = state.transactions.filter(t => t.id !== action.payload);
      localStorage.setItem("ff_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }
    default: return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

export const CATEGORY_COLORS = {
  Food:          "#D4A843",
  Shopping:      "#9B6EFF",
  Utilities:     "#4A9EFF",
  Transport:     "#00D4AA",
  Health:        "#FF5A6E",
  Subscriptions: "#F06A4D",
  Education:     "#3DD68C",
  Income:        "#00D4AA",
};

export const CATEGORY_ICONS = {
  Food:          "🍽️",
  Shopping:      "🛍️",
  Utilities:     "⚡",
  Transport:     "🚗",
  Health:        "💊",
  Subscriptions: "📱",
  Education:     "📚",
  Income:        "💰",
};
