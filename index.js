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

let chart;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// 🔐 Sanitize input to prevent HTML/script injection
const sanitizeInput = (text) => {
  const temp = document.createElement("div");
  temp.textContent = text;
  return temp.innerHTML.substring(0, 100); // Max 100 characters
};

// Initial render
renderFilteredExpenses();
updateChart();

// Submit form
expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = sanitizeInput(descriptionInput.value.trim());
  const amount = parseFloat(amountInput.value).toFixed(2);
  const selectedDropdown = categoryInput.value;
  const customCategory = sanitizeInput(customCategoryInput.value.trim());
  const date = document.querySelector('input[type="date"]').value;
  const today = new Date().toISOString().slice(0, 10);

  const finalCategory = customCategory !== "" ? customCategory : selectedDropdown;

  if (!description || isNaN(amount) || amount <= 0 || !finalCategory) {
    alert("Please enter valid data.");
    return;
  }

  if (date > today) {
    alert("You cannot set a future date.");
    return;
  }

  if (expenses.length >= 500) {
    alert("You’ve reached the maximum number of expenses allowed.");
    return;
  }

  const expense = {
    id: Date.now(),
    description,
    amount,
    category: finalCategory,
    date: date || today
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderFilteredExpenses();
  updateChart();

  descriptionInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
  customCategoryInput.value = "";
  document.querySelector('input[type="date"]').value = "";
});

// Filter dropdown
filterInput.addEventListener("change", renderFilteredExpenses);
chartRangeInput.addEventListener("change", updateChart);

// Render expenses
function renderFilteredExpenses() {
  expenseList.innerHTML = "";

  const selectedCategory = filterInput.value;
  const filtered = selectedCategory === "all"
    ? expenses
    : expenses.filter(exp => exp.category === selectedCategory);

  filtered.forEach(renderExpense);
  updateTotal(filtered);
}

// Render one expense row
function renderExpense(expense) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${expense.description}</td>
    <td>$${expense.amount}</td>
    <td>${expense.category}</td>
    <td>${expense.date || "N/A"}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;

  row.querySelector(".delete-btn").addEventListener("click", function () {
    expenses = expenses.filter(item => item.id !== expense.id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderFilteredExpenses();
    updateChart();
  });

  expenseList.appendChild(row);
}

// Update total
function updateTotal(list = expenses) {
  const total = list.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

// Update chart
function updateChart() {
  const range = chartRangeInput.value;
  const filteredExpenses = getExpensesByRange(range);

  const categoryTotals = {};

  filteredExpenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy();

  const ctx = document.getElementById("expenseChart").getContext("2d");
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#8bc34a'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

// Get expenses by date range
function getExpensesByRange(range) {
  const now = new Date();
  return expenses.filter(exp => {
    if (!exp.date) return false;

    const expDate = new Date(exp.date);
    if (range === "daily") {
      return expDate.toDateString() === now.toDateString();
    } else if (range === "weekly") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return expDate >= startOfWeek && expDate <= now;
    } else if (range === "monthly") {
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    } else {
      return true; // custom or all
    }
  });
}

// Dark mode toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
});

// Load dark mode
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
});
