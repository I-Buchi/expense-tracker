// Secure Expense Tracker JS

// Select elements
const expenseForm = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const customCategoryInput = document.getElementById("custom-category");
const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total-display");
const filterInput = document.getElementById("filter");
const chartRangeInput = document.getElementById("chart-range");
const themeToggle = document.getElementById("toggle-theme");

// Storage key
const STORAGE_KEY = "expenses_secure";

// Sanitize text input to prevent script injection
function sanitize(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

// Validate date string
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

// Load from localStorage
let expenses = [];
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) expenses = JSON.parse(stored);
} catch (e) {
  console.warn("Could not parse stored expenses:", e);
}

// Initial render
renderFilteredExpenses();
updateChart();

// Submit
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = sanitize(descriptionInput.value.trim());
  const amount = parseFloat(amountInput.value);
  const selected = sanitize(categoryInput.value);
  const custom = sanitize(customCategoryInput.value.trim());
  const dateInput = document.querySelector('input[type="date"]').value;
  const finalCategory = custom || selected;
  const finalDate = isValidDate(dateInput)
    ? dateInput
    : new Date().toISOString().slice(0, 10);

  if (!description || isNaN(amount) || amount <= 0 || !finalCategory) {
    alert("Please enter valid data.");
    return;
  }

  const expense = {
    id: Date.now(),
    description,
    amount: amount.toFixed(2),
    category: finalCategory,
    date: finalDate,
  };

  // Optional: Limit to 500 records
  expenses.push(expense);
  if (expenses.length > 500) expenses.shift();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  renderFilteredExpenses();
  updateChart();

  descriptionInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
  customCategoryInput.value = "";
  document.querySelector('input[type="date"]').value = "";
});

// Filter
filterInput.addEventListener("change", renderFilteredExpenses);
chartRangeInput.addEventListener("change", updateChart);

// Render expenses
function renderFilteredExpenses() {
  expenseList.innerHTML = "";
  const selected = filterInput.value;

  const filtered = selected === "all"
    ? expenses
    : expenses.filter(exp => exp.category === selected);

  filtered.forEach(renderExpense);
  updateTotal(filtered);
}

// Render row
function renderExpense(exp) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${exp.description}</td>
    <td>$${exp.amount}</td>
    <td>${exp.category}</td>
    <td>${exp.date}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;
  row.querySelector(".delete-btn").addEventListener("click", () => {
    expenses = expenses.filter(item => item.id !== exp.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    renderFilteredExpenses();
    updateChart();
  });
  expenseList.appendChild(row);
}

// Total
function updateTotal(list = expenses) {
  const total = list.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

// Chart
function updateChart() {
  const range = chartRangeInput.value;
  const filtered = getExpensesByRange(range);

  const categoryTotals = {};
  filtered.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (window.chart) window.chart.destroy();
  const ctx = document.getElementById("expenseChart").getContext("2d");

  window.chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#8bc34a', '#f39c12', '#9b59b6', '#e67e22'],
        borderColor: "#fff",
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

// Filter by date
function getExpensesByRange(range) {
  const now = new Date();
  return expenses.filter(exp => {
    const expDate = new Date(exp.date);
    if (range === "daily") {
      return expDate.toDateString() === now.toDateString();
    } else if (range === "weekly") {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      return expDate >= start && expDate <= now;
    } else if (range === "monthly") {
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

// Dark mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
});
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
});
