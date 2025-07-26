const express = require('express');
const cors = require('cors');
const db = require('./db'); 

const app = express();
app.use(cors());
app.use(express.json());


const loansRouter = require('./routes/loans');
const customersRouter = require('./routes/customers');


app.use('/loans', loansRouter);
app.use('/customers', customersRouter);

app.post('/loans', (req, res) => {
  const { customer_id, principal, period, interest_rate } = req.body;
  const total_interest = principal * (period / 12) * (interest_rate / 100);
  const total_amount = principal + total_interest;
  const monthly_emi = total_amount / period;

  db.run(
    `INSERT INTO loans (customer_id, principal, period, interest_rate, total_amount, monthly_emi, total_interest, emIs_left, amount_paid)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [customer_id, principal, period, interest_rate, total_amount, monthly_emi, total_interest, period, 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        loan_id: this.lastID,
        total_amount,
        monthly_emi
      });
    }
  );
});


app.post('/payments', (req, res) => {
  const { loan_id, amount, type } = req.body;

  db.get('SELECT * FROM loans WHERE id = ?', [loan_id], (err, loan) => {
    if (err || !loan) return res.status(404).json({ error: "Loan not found" });

    const newPaid = (loan.amount_paid || 0) + amount;
    const emiReduction = amount / loan.monthly_emi;
    const newEmisLeft = Math.max(loan.emIs_left - emiReduction, 0);

    db.run(
      `UPDATE loans SET amount_paid = ?, emIs_left = ? WHERE id = ?`,
      [newPaid, newEmisLeft, loan_id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.run(
          `INSERT INTO payments (loan_id, type, amount) VALUES (?, ?, ?)`,
          [loan_id, type, amount],
          function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
              message: "Payment successful",
              loan_id,
              amount,
              type
            });
          }
        );
      }
    );
  });
});


app.get('/loans/:loanId/ledger', (req, res) => {
  const { loanId } = req.params;

  db.all(
    `SELECT * FROM payments WHERE loan_id = ? ORDER BY paid_at ASC`,
    [loanId],
    (err, transactions) => {
      if (err) return res.status(500).json({ error: err.message });

      db.get(
        `SELECT total_amount, amount_paid, monthly_emi, emIs_left FROM loans WHERE id = ?`,
        [loanId],
        (err, loan) => {
          if (err || !loan) return res.status(404).json({ error: "Loan not found" });

          res.json({
            transactions,
            balance: loan.total_amount - loan.amount_paid,
            monthly_emi: loan.monthly_emi,
            emis_left: loan.emIs_left
          });
        }
      );
    }
  );
});


app.get('/customers/:customerId/loans', (req, res) => {
  const { customerId } = req.params;

  db.all(
    `SELECT * FROM loans WHERE customer_id = ?`,
    [customerId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});
app.get('/', (req, res) => {
  res.send('Welcome to ABC Bank Loan API 🚀');
});



app.post('/customers', (req, res) => {
  const { name } = req.body;

  db.run(
    'INSERT INTO customers (name) VALUES (?)',
    [name],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name });
    }
  );
});


const PORT = 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

