// ✅ Select elements
const expenseForm = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const categoryInput = document.getElementById("category");
const customCategoryInput = document.getElementById("custom-category");
const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total-display");
const filterInput = document.getElementById("filter");
const chartRangeInput = document.getElementById("chart-range");
const themeToggle = document.getElementById("toggle-theme");

let chart;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// ✅ Initial render
renderFilteredExpenses();
updateChart();

// ✅ Sanitize helper
function sanitize(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ✅ Handle form submission
expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = sanitize(descriptionInput.value.trim());
  const amount = parseFloat(amountInput.value).toFixed(2);
  const date = dateInput.value || new Date().toISOString().split("T")[0];
  const selectedDropdown = categoryInput.value;
  const customCategory = sanitize(customCategoryInput.value.trim());

  const finalCategory = customCategory !== "" ? customCategory : selectedDropdown;

  if (!description || isNaN(amount) || amount <= 0 || !finalCategory) {
    alert("Please enter valid data.");
    return;
  }

  const expense = {
    id: Date.now(),
    description,
    amount,
    category: finalCategory,
    date
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderFilteredExpenses();
  updateChart();

  // ✅ Reset form
  expenseForm.reset();
});

// ✅ Filter by dropdown category
filterInput.addEventListener("change", renderFilteredExpenses);

// ✅ Filter chart range
chartRangeInput.addEventListener("change", updateChart);

// ✅ Render filtered expenses
function renderFilteredExpenses() {
  expenseList.innerHTML = "";

  const selectedCategory = filterInput.value;
  const filtered = selectedCategory === "all"
    ? expenses
    : expenses.filter(exp => exp.category === selectedCategory);

  filtered.forEach(renderExpense);
  updateTotal(filtered);
}

// ✅ Render one row
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

// ✅ Update total amount
function updateTotal(list = expenses) {
  const total = list.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

// ✅ Update Chart
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

// ✅ Get expenses by selected range
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
      return true; // all
    }
  });
}

// ✅ Dark Mode Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
});

// ✅ Load saved theme
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
});
