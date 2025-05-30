import React, { useState } from "react";
import "./App.css";

/*
  Main container for SpendWise (ExpenseTrackr)
  - App header (SpendWise)
  - Expense input form (amount, description, date)
  - Total spent this month
  - Transaction list for current month
  The entire UI is styled according to:
    - primary: #2D9CDB
    - secondary: #F2F2F2
    - accent: #27AE60
  Minimal, single-column, responsive layout.
*/

// Helper function to check if a date is in the current month
function isInCurrentMonth(dateStr) {
  const input = new Date(dateStr);
  const now = new Date();
  return (
    input.getFullYear() === now.getFullYear() &&
    input.getMonth() === now.getMonth()
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Holds all transactions.
   * Each transaction: { id, amount, description, date }
   */
  const [transactions, setTransactions] = useState([]);

  // For input form state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => {
    // Default to current date
    const now = new Date();
    return now.toISOString().split("T")[0];
  });
  const [error, setError] = useState("");

  // Filter: only show transactions from current month
  const currentMonthTransactions = transactions.filter((tx) =>
    isInCurrentMonth(tx.date)
  );

  // Sum total spent for current month
  const totalSpent = currentMonthTransactions.reduce(
    (acc, tx) => acc + Number(tx.amount),
    0
  );

  // PUBLIC_INTERFACE
  function handleAddExpense(e) {
    e.preventDefault();
    setError("");
    // Validation
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (!description.trim()) {
      setError("Enter a description.");
      return;
    }
    if (!date) {
      setError("Pick a date.");
      return;
    }
    // Create new transaction
    setTransactions([
      {
        id: Date.now(),
        amount: Number(amount),
        description: description.trim(),
        date,
      },
      ...transactions,
    ]);
    setAmount("");
    setDescription("");
    setDate(() => {
      const now = new Date();
      return now.toISOString().split("T")[0];
    });
  }

  // PUBLIC_INTERFACE
  function handleDeleteExpense(id) {
    setTransactions((list) => list.filter((tx) => tx.id !== id));
  }

  // Format date for display
  function prettyDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="sw-app">
      {/* HEADER */}
      <header className="sw-header">
        <div className="sw-header-inner">
          <span className="sw-logo">💸 SpendWise</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="sw-main">
        {/* Expense Input Form */}
        <section className="sw-card sw-form-card">
          <h2 className="sw-section-title">Add Expense</h2>
          <form className="sw-form" onSubmit={handleAddExpense} autoComplete="off">
            <div className="sw-form-fields">
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Amount"
                className="sw-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                aria-label="Amount"
              />
              <input
                type="text"
                placeholder="Description"
                className="sw-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                aria-label="Description"
                maxLength={60}
              />
              <input
                type="date"
                className="sw-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                aria-label="Date"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <button className="sw-btn sw-btn-accent" type="submit">
              Add
            </button>
            {error && <div className="sw-form-error">{error}</div>}
          </form>
        </section>

        {/* Total Spent */}
        <section className="sw-card sw-total-card">
          <div className="sw-total-label">Total Spent This Month</div>
          <div className="sw-total-amount">
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </section>

        {/* Transaction List */}
        <section className="sw-card sw-tx-card">
          <h2 className="sw-section-title">
            {currentMonthTransactions.length > 0
              ? "Transactions"
              : "No Transactions Yet"}
          </h2>
          <ul className="sw-tx-list">
            {currentMonthTransactions.length === 0 && (
              <li className="sw-empty-msg">Start tracking your expenses!</li>
            )}
            {currentMonthTransactions.map((tx) => (
              <li className="sw-tx-item" key={tx.id}>
                <div className="sw-tx-data">
                  <span className="sw-tx-amount">
                    ${Number(tx.amount).toFixed(2)}
                  </span>
                  <span className="sw-tx-desc">{tx.description}</span>
                  <span className="sw-tx-date">{prettyDate(tx.date)}</span>
                </div>
                <button
                  className="sw-tx-delete"
                  onClick={() => handleDeleteExpense(tx.id)}
                  title="Delete"
                  aria-label="Delete"
                  type="button"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
