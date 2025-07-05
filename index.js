const expenseForm = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const customCategoryInput = document.getElementById("custom-category");
const dateInput = document.getElementById("expense-date");

const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total-display");
const filterInput = document.getElementById("filter");

const chartRangeInput = document.getElementById("chart-range");
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");
const customRangeDiv = document.getElementById("custom-date-range");

const themeToggle = document.getElementById("toggle-theme");

let chart;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Initial render
renderFilteredExpenses();
updateChart();

// Handle form submit
expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value).toFixed(2);
  const dropdownCategory = categoryInput.value;
  const customCategory = customCategoryInput.value.trim();
  const date = dateInput.value || new Date().toISOString().slice(0, 10);

  const finalCategory = customCategory || dropdownCategory;

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

  // Clear inputs
  descriptionInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
  customCategoryInput.value = "";
  dateInput.value = "";
});

// Filter by category
filterInput.addEventListener("change", renderFilteredExpenses);

// Chart range selector
chartRangeInput.addEventListener("change", () => {
  if (chartRangeInput.value === "custom") {
    customRangeDiv.style.display = "block";
  } else {
    customRangeDiv.style.display = "none";
  }
  updateChart();
});

// Render expense list
function renderFilteredExpenses() {
  expenseList.innerHTML = "";
  const selected = filterInput.value;

  const filtered = selected === "all"
    ? expenses
    : expenses.filter(exp => exp.category === selected);

  filtered.forEach(renderExpense);
  updateTotal(filtered);
}

// Render single row
function renderExpense(exp) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${exp.description}</td>
    <td>$${exp.amount}</td>
    <td>${exp.category}</td>
    <td>${exp.date}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;

  row.querySelector(".delete-btn").addEventListener("click", function () {
    expenses = expenses.filter(e => e.id !== exp.id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderFilteredExpenses();
    updateChart();
  });

  expenseList.appendChild(row);
}

// Total calculation
function updateTotal(list = expenses) {
  const total = list.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

// Chart rendering
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
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#8bc34a', '#a56cc1', '#f77f00'],
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

// Get expenses by range
function getExpensesByRange(range) {
  const now = new Date();
  return expenses.filter(exp => {
    const expDate = new Date(exp.date);
    if (range === "daily") {
      return expDate.toDateString() === now.toDateString();
    } else if (range === "weekly") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return expDate >= startOfWeek && expDate <= now;
    } else if (range === "monthly") {
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    } else if (range === "custom") {
      const start = new Date(startDateInput.value);
      const end = new Date(endDateInput.value);
      return expDate >= start && expDate <= end;
    } else {
      return true;
    }
  });
}

// Dark mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
});

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
});
