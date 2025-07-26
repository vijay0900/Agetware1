const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bank.db');

// Run the following once to initialize
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      principal NUMERIC,
      period INTEGER,
      interest_rate NUMERIC,
      total_amount NUMERIC,
      monthly_emi NUMERIC,
      total_interest NUMERIC,
      amount_paid NUMERIC DEFAULT 0,
      emIs_left INTEGER,
      FOREIGN KEY(customer_id) REFERENCES customers(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loan_id INTEGER,
      type TEXT, -- 'EMI' or 'LUMP'
      amount NUMERIC,
      paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(loan_id) REFERENCES loans(id)
    );
  `);
});

module.exports = db;
