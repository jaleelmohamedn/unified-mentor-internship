const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateSummary() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  totalIncomeEl.textContent = income;
  totalExpenseEl.textContent = expense;
  netBalanceEl.textContent = income - expense;
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateLocalStorage();
  renderTransactions();
}

function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = "transaction-item";

    li.innerHTML = `
      <span>${t.date}</span>
      <span>${t.description}</span>
      <span>${t.category}</span>
      <span>${t.type === "income" ? "+" : "-"}₹${t.amount}</span>
      <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
    `;

    transactionList.appendChild(li);
  });
  updateSummary();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (date && description && category && amount && type) {
    transactions.push({ date, description, category, amount, type });
    updateLocalStorage();
    renderTransactions();
    form.reset();
  }
});

renderTransactions();
document.getElementById("download-pdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Expense Tracker - Transaction Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleString()}`, 14, 30);

  let y = 40;
  doc.setFont("Helvetica", "bold");
  doc.text("Date", 14, y);
  doc.text("Description", 40, y);
  doc.text("Category", 90, y);
  doc.text("Amount", 140, y);
  doc.text("Type", 170, y);

  doc.setFont("Helvetica", "normal");

  transactions.forEach((t, i) => {
    y += 10;
    doc.text(t.date, 14, y);
    doc.text(t.description, 40, y);
    doc.text(t.category, 90, y);
    doc.text(`₹${t.amount}`, 140, y);
    doc.text(t.type, 170, y);
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  y += 20;
  const totalIncome = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const netBalance = totalIncome - totalExpense;

  doc.setFont("Helvetica", "bold");
  doc.text(`Total Income: ₹${totalIncome}`, 14, y);
  doc.text(`Total Expense: ₹${totalExpense}`, 14, y + 10);
  doc.text(`Net Balance: ₹${netBalance}`, 14, y + 20);

  doc.save("Expense_Transactions_Report.pdf");
});
