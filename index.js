const expenseForm = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const customCategoryInput = document.getElementById("custom-category");
const dateInput = document.getElementById("date");
const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total-display");
const filterInput = document.getElementById("filter");
const chartRangeInput = document.getElementById("chart-range");
const themeToggle = document.getElementById("toggle-theme");

let chart;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
  renderFilteredExpenses();
  updateChart();
});

expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value).toFixed(2);
  const dropdown = categoryInput.value;
  const custom = customCategoryInput.value.trim();
  const date = dateInput.value;

  const category = custom !== "" ? custom : dropdown;

  if (!description || isNaN(amount) || amount <= 0 || !category) {
    alert("Please enter valid data.");
    return;
  }

  const expense = {
    id: Date.now(),
    description,
    amount,
    category,
    date: date || new Date().toISOString().slice(0, 10)
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderFilteredExpenses();
  updateChart();

  // Clear inputs
  descriptionInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
  customCategoryInput.value = "";
  dateInput.value = "";
});

filterInput.addEventListener("change", renderFilteredExpenses);
chartRangeInput.addEventListener("change", updateChart);

function renderFilteredExpenses() {
  expenseList.innerHTML = "";
  const selected = filterInput.value;
  const filtered = selected === "all" ? expenses : expenses.filter(e => e.category === selected);
  filtered.forEach(renderExpense);
  updateTotal(filtered);
}

function renderExpense(expense) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${expense.description}</td>
    <td>$${expense.amount}</td>
    <td>${expense.category}</td>
    <td>${expense.date || "N/A"}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;

  row.querySelector(".delete-btn").addEventListener("click", () => {
    expenses = expenses.filter(item => item.id !== expense.id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderFilteredExpenses();
    updateChart();
  });

  expenseList.appendChild(row);
}

function updateTotal(list = expenses) {
  const total = list.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

function updateChart() {
  const range = chartRangeInput.value;
  const filtered = getExpensesByRange(range);

  const categoryTotals = {};
  filtered.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy();

  const ctx = document.getElementById("expenseChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#ff6384', '#36a2eb', '#ffce56',
          '#8bc34a', '#f06292', '#4dd0e1',
          '#ffd54f', '#a1887f'
        ],
        borderColor: "#fff",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

function getExpensesByRange(range) {
  const now = new Date();
  return expenses.filter(exp => {
    if (!exp.date) return false;
    const date = new Date(exp.date);

    if (range === "daily") {
      return date.toDateString() === now.toDateString();
    } else if (range === "weekly") {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      return date >= start && date <= now;
    } else if (range === "monthly") {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
});
