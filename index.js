// Select DOM Elements
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const categorySelect = document.getElementById("category");
const customCategoryInput = document.getElementById("custom-category");
const addExpenseBtn = document.getElementById("add-expense");
const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total");
const filterCategory = document.getElementById("filter-category");
const chartRange = document.getElementById("chart-range");
const themeToggle = document.getElementById("toggle-dark-mode");
const chartCanvas = document.getElementById("expenseChart");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let chart = null;

// Helper: Sanitize input
function sanitize(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

// Load dark mode
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
  renderExpenses();
  updateChart();
});

// Dark mode toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
});

// Add expense
addExpenseBtn.addEventListener("click", () => {
  const description = sanitize(descriptionInput.value.trim());
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value || new Date().toISOString().split("T")[0];
  const selected = categorySelect.value;
  const custom = sanitize(customCategoryInput.value.trim());

  const category = custom || selected;

  if (!description || isNaN(amount) || amount <= 0 || !category) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const expense = {
    id: Date.now(),
    description,
    amount,
    category,
    date
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  descriptionInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
  categorySelect.value = "";
  customCategoryInput.value = "";

  renderExpenses();
  updateChart();
});

// Render expense rows
function renderExpenses() {
  const selectedCategory = filterCategory.value;
  const filtered = selectedCategory === "All"
    ? expenses
    : expenses.filter(exp => exp.category === selectedCategory);

  expenseList.innerHTML = "";

  filtered.forEach(exp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.description}</td>
      <td>$${exp.amount.toFixed(2)}</td>
      <td>${exp.category}</td>
      <td>${exp.date}</td>
      <td><button data-id="${exp.id}" class="delete-btn">Delete</button></td>
    `;

    row.querySelector(".delete-btn").addEventListener("click", () => {
      expenses = expenses.filter(e => e.id !== exp.id);
      localStorage.setItem("expenses", JSON.stringify(expenses));
      renderExpenses();
      updateChart();
    });

    expenseList.appendChild(row);
  });

  updateTotal(filtered);
}

// Update total amount
function updateTotal(list) {
  const total = list.reduce((sum, exp) => sum + exp.amount, 0);
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

// Filter list by category
filterCategory.addEventListener("change", () => {
  renderExpenses();
});

// Filter chart by range
chartRange.addEventListener("change", updateChart);

// Get filtered expenses by chart range
function getExpensesByRange(range) {
  const now = new Date();
  return expenses.filter(exp => {
    const expDate = new Date(exp.date);
    switch (range) {
      case "daily":
        return expDate.toDateString() === now.toDateString();
      case "weekly":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return expDate >= startOfWeek && expDate <= now;
      case "monthly":
        return expDate.getMonth() === now.getMonth() &&
               expDate.getFullYear() === now.getFullYear();
      case "custom":
      default:
        return true;
    }
  });
}

// Update chart
function updateChart() {
  const range = chartRange.value;
  const filtered = getExpensesByRange(range);

  const categoryTotals = {};
  filtered.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy();

  const ctx = chartCanvas.getContext("2d");
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        label: "Expenses by Category",
        data,
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56",
          "#4CAF50", "#FF9800", "#9C27B0",
          "#795548", "#607D8B", "#03A9F4", "#8BC34A"
        ],
        borderColor: "#fff",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}
