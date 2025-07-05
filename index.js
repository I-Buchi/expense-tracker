// Select elements
const expenseForm = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const customCategoryInput = document.getElementById("custom-category"); // ✅ NEW
const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total-display");
const filterInput = document.getElementById("filter");
const themeToggle = document.getElementById("toggle-theme");

let chart;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Initial render
renderFilteredExpenses();
updateChart();

// Submit form
expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value).toFixed(2);
  const selectedDropdown = categoryInput.value;
  const customCategory = customCategoryInput.value.trim();

  const finalCategory = customCategory !== "" ? customCategory : selectedDropdown; // ✅ Use custom if available

  if (!description || isNaN(amount) || amount <= 0 || !finalCategory) {
    alert("Please enter valid data.");
    return;
  }

  const expense = {
    id: Date.now(),
    description,
    amount,
    category: finalCategory,
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderFilteredExpenses();
  updateChart();

  // Reset form fields
  descriptionInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
  customCategoryInput.value = ""; // ✅ Clear custom input
});

// Filter dropdown
filterInput.addEventListener("change", renderFilteredExpenses);

// Render filtered expenses
function renderFilteredExpenses() {
  expenseList.innerHTML = "";

  const selectedCategory = filterInput.value;
  const filtered = selectedCategory === "all"
    ? expenses
    : expenses.filter(exp => exp.category === selectedCategory);

  filtered.forEach(renderExpense);
  updateTotal(filtered);
}

// Render one expense
function renderExpense(expense) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${expense.description}</td>
    <td>$${expense.amount}</td>
    <td>${expense.category}</td>
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

// Chart.js update
function updateChart() {
  const categoryTotals = {};

  expenses.forEach(exp => {
    if (categoryTotals[exp.category]) {
      categoryTotals[exp.category] += parseFloat(exp.amount);
    } else {
      categoryTotals[exp.category] = parseFloat(exp.amount);
    }
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

// 🌙 Toggle dark mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
});

// ✅ Load dark mode if saved
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
});
