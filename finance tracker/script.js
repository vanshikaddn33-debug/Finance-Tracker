/* =========================================================
   FINANCE TRACKER - SCRIPT.JS
   Works with your existing HTML + CSS
========================================================= */


/* =========================================================
   1. GET ELEMENTS
========================================================= */

// Add Transaction form
const transactionForm = document.querySelector(".transaction-form");

const nameInput = document.getElementById("transaction-name");
const amountInput = document.getElementById("transaction-amount");
const typeInput = document.getElementById("transaction-type");
const categoryInput = document.getElementById("transaction-category");
const dateInput = document.getElementById("transaction-date");
const notesInput = document.getElementById("transaction-notes");


// All Transactions table
const transactionTableBody = document.querySelector(
    ".all-transactions-table tbody"
);


// Dashboard cards
const totalBalance = document.getElementById("total-balance");
const totalExpenses = document.getElementById("total-expenses");
const totalIncome = document.getElementById("total-income");


// Recent Transactions
const recentTransactionsContainer =
    document.getElementById("recent-transaction");


// Expense chart
const chartTotal =
    document.getElementById("chart-total");

const categoryList =
    document.getElementById("categorylist");


/* =========================================================
   2. FILTER ELEMENTS
========================================================= */

const filterContainer =
    document.querySelector(".transaction-inputs");

const searchInput =
    filterContainer?.querySelector('input[type="text"]');

const filterSelects =
    filterContainer?.querySelectorAll("select");

const typeFilter =
    filterSelects ? filterSelects[0] : null;

const categoryFilter =
    filterSelects ? filterSelects[1] : null;

const dateFilter =
    filterContainer?.querySelector('input[type="date"]');


/* =========================================================
   3. TRANSACTION DATA
========================================================= */

let transactions = JSON.parse(
    localStorage.getItem("financeTransactions")
) || [];


/*
   If localStorage is empty, use the transactions
   already present in your HTML.
*/

if (transactions.length === 0) {

    transactions = [
        {
            id: 1,
            name: "Grocery Shopping",
            category: "Food",
            type: "Expense",
            date: "2025-05-31",
            amount: 1250,
            notes: ""
        },

        {
            id: 2,
            name: "Salary - May",
            category: "Salary",
            type: "Income",
            date: "2025-05-31",
            amount: 50000,
            notes: ""
        },

        {
            id: 3,
            name: "Electricity Bill",
            category: "Bills",
            type: "Expense",
            date: "2025-05-30",
            amount: 2300,
            notes: ""
        },

        {
            id: 4,
            name: "Uber Ride",
            category: "Travel",
            type: "Expense",
            date: "2025-05-29",
            amount: 350,
            notes: ""
        },

        {
            id: 5,
            name: "Freelance Project",
            category: "Freelance",
            type: "Income",
            date: "2025-05-28",
            amount: 10000,
            notes: ""
        }
    ];

    saveTransactions();
}


/* =========================================================
   4. SAVE DATA
========================================================= */

function saveTransactions() {

    localStorage.setItem(
        "financeTransactions",
        JSON.stringify(transactions)
    );
}


/* =========================================================
   5. FORMAT MONEY
========================================================= */

function formatMoney(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN");
}


/* =========================================================
   6. FORMAT DATE
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(dateString + "T00:00:00");

    const options = {
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    return date.toLocaleDateString("en-IN", options);
}


/* =========================================================
   7. CATEGORY CLASS
========================================================= */

function getCategoryClass(category) {

    return category
        .toLowerCase()
        .replace(/\s+/g, "-");
}


/* =========================================================
   8. CREATE TABLE ROW
========================================================= */

function createTableRow(transaction) {

    const row = document.createElement("tr");

    row.dataset.id = transaction.id;


    const categoryClass =
        getCategoryClass(transaction.category);


    const typeClass =
        transaction.type.toLowerCase() === "income"
            ? "income"
            : "expense";


    const amountClass =
        transaction.type.toLowerCase() === "income"
            ? "income-amount"
            : "expense-amount";


    const sign =
        transaction.type.toLowerCase() === "income"
            ? "+"
            : "-";


    row.innerHTML = `

        <td>
            ${escapeHTML(transaction.name)}
        </td>

        <td>
            <span class="category ${categoryClass}">
                ${escapeHTML(transaction.category)}
            </span>
        </td>

        <td>
            <span class="type ${typeClass}">
                ${transaction.type}
            </span>
        </td>

        <td>
            ${formatDate(transaction.date)}
        </td>

        <td class="amount ${amountClass}">
            ${sign} ${formatMoney(transaction.amount)}
        </td>

        <td>
            <div class="actions">

                <button
                    class="edit-btn"
                    data-id="${transaction.id}"
                    type="button">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="delete-btn"
                    data-id="${transaction.id}"
                    type="button">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>
        </td>

    `;

    return row;
}


/* =========================================================
   9. SECURITY - ESCAPE TEXT
========================================================= */

function escapeHTML(text) {

    const element =
        document.createElement("div");

    element.textContent = text;

    return element.innerHTML;
}


/* =========================================================
   10. DISPLAY ALL TRANSACTIONS
========================================================= */

function renderTransactions(list = transactions) {

    if (!transactionTableBody) {
        return;
    }


    transactionTableBody.innerHTML = "";


    if (list.length === 0) {

        transactionTableBody.innerHTML = `

            <tr>

                <td colspan="6"
                    style="text-align:center; padding:25px;">

                    No transactions found.

                </td>

            </tr>

        `;

        return;
    }


    list.forEach(transaction => {

        const row =
            createTableRow(transaction);

        transactionTableBody.appendChild(row);

    });
}


/* =========================================================
   11. ADD TRANSACTION
========================================================= */

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                nameInput.value.trim();

            const amount =
                Number(amountInput.value);

            const typeValue =
                typeInput.value;

            const categoryValue =
                categoryInput.value;

            const date =
                dateInput.value;

            const notes =
                notesInput.value.trim();


            /*
               Basic validation
            */

            if (
                !name ||
                !amount ||
                !typeValue ||
                !categoryValue ||
                !date
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            /*
               Convert values to display text
            */

            const type =
                typeValue === "income"
                    ? "Income"
                    : "Expense";


            const category =
                categoryValue.charAt(0).toUpperCase() +
                categoryValue.slice(1);


            /*
               Create transaction
            */

            const newTransaction = {

                id: Date.now(),

                name: name,

                amount: amount,

                type: type,

                category: category,

                date: date,

                notes: notes

            };


            /*
               Add to array
            */

            transactions.push(
                newTransaction
            );


            /*
               Save
            */

            saveTransactions();


            /*
               Update page
            */

            renderTransactions();

            updateDashboard();

            updateRecentTransactions();

            updateExpenseOverview();


            /*
               Clear form
            */

            transactionForm.reset();


            alert(
                "Transaction added successfully!"
            );

        }
    );

}


/* =========================================================
   12. CALCULATE TOTALS
========================================================= */

function calculateTotals() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "Income") {

            income += Number(
                transaction.amount
            );

        } else {

            expenses += Number(
                transaction.amount
            );

        }

    });


    const balance =
        income - expenses;


    return {
        income,
        expenses,
        balance
    };
}


/* =========================================================
   13. UPDATE DASHBOARD CARDS
========================================================= */

function updateDashboard() {

    const totals =
        calculateTotals();


    if (totalBalance) {

        totalBalance.textContent =
            "RS." +
            totals.balance.toLocaleString("en-IN");

    }


    if (totalExpenses) {

        totalExpenses.textContent =
            "RS." +
            totals.expenses.toLocaleString("en-IN");

    }


    if (totalIncome) {

        totalIncome.textContent =
            "RS." +
            totals.income.toLocaleString("en-IN");

    }
}


/* =========================================================
   14. UPDATE RECENT TRANSACTIONS
========================================================= */

function updateRecentTransactions() {

    if (!recentTransactionsContainer) {
        return;
    }


    /*
       Sort newest first
    */

    const recent =
        [...transactions]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            )
            .slice(0, 5);


    recentTransactionsContainer.innerHTML = "";


    recent.forEach(transaction => {

        const item =
            document.createElement("div");

        item.className =
            "transaction-item";


        /*
           Choose icon based on category
        */

        let icon =
            "fa-wallet";

        let iconClass =
            "income-icon";


        if (transaction.type === "Expense") {

            iconClass =
                getCategoryIconClass(
                    transaction.category
                );

            icon =
                getCategoryIcon(
                    transaction.category
                );

        }


        if (
            transaction.type === "Income" &&
            transaction.category === "Freelance"
        ) {

            iconClass =
                "freelance-icon";

            icon =
                "fa-briefcase";

        }


        if (
            transaction.type === "Income" &&
            transaction.category === "Salary"
        ) {

            iconClass =
                "income-icon";

            icon =
                "fa-wallet";

        }


        const amountClass =
            transaction.type === "Income"
                ? "income"
                : "expense";


        const sign =
            transaction.type === "Income"
                ? "+"
                : "-";


        item.innerHTML = `

            <div class="transaction-icon ${iconClass}">
                <i class="fa-solid ${icon}"></i>
            </div>

            <div class="transaction-details">

                <strong>
                    ${escapeHTML(transaction.name)}
                </strong>

                <span>
                    ${escapeHTML(transaction.category)}
                </span>

            </div>

            <div class="transaction-date">

                ${formatDate(transaction.date)}

            </div>

            <strong class="transaction-amount ${amountClass}">

                ${sign} RS.${Number(
                    transaction.amount
                ).toLocaleString("en-IN")}

            </strong>

        `;


        recentTransactionsContainer
            .appendChild(item);

    });
}


/* =========================================================
   15. CATEGORY ICON
========================================================= */

function getCategoryIcon(category) {

    const icons = {

        Food: "fa-cart-shopping",

        Travel: "fa-car",

        Shopping: "fa-bag-shopping",

        Bills: "fa-file-invoice",

        Entertainment: "fa-film",

        Salary: "fa-wallet",

        Freelance: "fa-briefcase"

    };


    return icons[category] ||
        "fa-wallet";
}


/* =========================================================
   16. CATEGORY ICON CSS CLASS
========================================================= */

function getCategoryIconClass(category) {

    const classes = {

        Food: "food-icon",

        Travel: "travel-icon",

        Shopping: "shopping-icon",

        Bills: "bills-icon",

        Entertainment: "entertainment-icon"

    };


    return classes[category] ||
        "food-icon";
}


/* =========================================================
   17. EXPENSE OVERVIEW
========================================================= */

function updateExpenseOverview() {

    if (!categoryList) {
        return;
    }


    /*
       Only expenses are included
       in the expense overview.
    */

    const expenseCategories = {

        Food: 0,

        Travel: 0,

        Shopping: 0,

        Bills: 0,

        Entertainment: 0

    };


    transactions.forEach(transaction => {

        if (
            transaction.type === "Expense" &&
            expenseCategories
                .hasOwnProperty(
                    transaction.category
                )
        ) {

            expenseCategories[
                transaction.category
            ] += Number(
                transaction.amount
            );

        }

    });


    const totalExpense =
        Object.values(
            expenseCategories
        ).reduce(
            (sum, value) =>
                sum + value,
            0
        );


    /*
       Update center number
    */

    if (chartTotal) {

        chartTotal.textContent =
            "RS. " +
            totalExpense.toLocaleString(
                "en-IN"
            );

    }


    /*
       Update category numbers
    */

    const listItems =
        categoryList.querySelectorAll(
            ".list-item"
        );


    listItems.forEach(item => {

        const category =
            item.children[1]
                ?.textContent
                .trim();


        const amountElement =
            item.querySelector("strong");


        if (
            category &&
            amountElement &&
            expenseCategories
                .hasOwnProperty(category)
        ) {

            amountElement.textContent =
                "RS." +
                expenseCategories[
                    category
                ].toLocaleString(
                    "en-IN"
                );

        }

    });
}


/* =========================================================
   18. SEARCH + FILTER
========================================================= */

function filterTransactions() {

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    let selectedType =
        typeFilter
            ? typeFilter.value
                .toLowerCase()
            : "";


    let selectedCategory =
        categoryFilter
            ? categoryFilter.value
                .toLowerCase()
            : "";


    const selectedDate =
        dateFilter
            ? dateFilter.value
            : "";


    /*
       "All" means no type filter
    */

    if (selectedType === "all") {

        selectedType = "";

    }


    /*
       "Expenses" should match "Expense"
    */

    if (selectedType === "expenses") {

        selectedType = "expense";

    }


    const filtered =
        transactions.filter(transaction => {


            const matchesSearch =

                transaction.name
                    .toLowerCase()
                    .includes(search)

                ||

                transaction.category
                    .toLowerCase()
                    .includes(search);


            const matchesType =

                !selectedType

                ||

                transaction.type
                    .toLowerCase()
                    === selectedType;


            const matchesCategory =

                !selectedCategory

                ||

                transaction.category
                    .toLowerCase()
                    === selectedCategory;


            const matchesDate =

                !selectedDate

                ||

                transaction.date
                    === selectedDate;


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory &&
                matchesDate
            );

        });


    renderTransactions(filtered);
}


/* =========================================================
   19. FILTER EVENT LISTENERS
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterTransactions
    );

}


if (typeFilter) {

    typeFilter.addEventListener(
        "change",
        filterTransactions
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterTransactions
    );

}


if (dateFilter) {

    dateFilter.addEventListener(
        "change",
        filterTransactions
    );


}


/* =========================================================
   20. DELETE TRANSACTION
========================================================= */

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete "${transaction.name}"?`
        );


    if (!confirmDelete) {
        return;
    }


    transactions =
        transactions.filter(
            item => item.id !== id
        );


    saveTransactions();


    renderTransactions();

    updateDashboard();

    updateRecentTransactions();

    updateExpenseOverview();


    /*
       Reapply filters
    */

    filterTransactions();

}


/* =========================================================
   21. EDIT TRANSACTION
========================================================= */

function editTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) {
        return;
    }


    /*
       Put existing data into form
    */

    nameInput.value =
        transaction.name;


    amountInput.value =
        transaction.amount;


    typeInput.value =
        transaction.type.toLowerCase();


    categoryInput.value =
        transaction.category.toLowerCase();


    dateInput.value =
        transaction.date;


    notesInput.value =
        transaction.notes || "";


    /*
       Remove old transaction.

       When the user submits the form,
       the updated version will be added.
    */

    transactions =
        transactions.filter(
            item => item.id !== id
        );


    saveTransactions();


    renderTransactions();

    updateDashboard();

    updateRecentTransactions();

    updateExpenseOverview();


    /*
       Scroll to Add Transaction section
    */

    const addSection =
        document.getElementById(
            "add-transactions"
        );


    if (addSection) {

        addSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================================
   22. EDIT / DELETE BUTTONS
========================================================= */

/*
   Event delegation is used here.

   This is important because JavaScript creates
   new rows dynamically.
*/

if (transactionTableBody) {

    transactionTableBody.addEventListener(
        "click",
        function(event) {

            const editButton =
                event.target.closest(
                    ".edit-btn"
                );


            const deleteButton =
                event.target.closest(
                    ".delete-btn"
                );


            if (editButton) {

                const id =
                    Number(
                        editButton.dataset.id
                    );

                editTransaction(id);

            }


            if (deleteButton) {

                const id =
                    Number(
                        deleteButton.dataset.id
                    );

                deleteTransaction(id);

            }

        }
    );

}


/* =========================================================
   23. INITIAL LOAD
========================================================= */

renderTransactions();

updateDashboard();

updateRecentTransactions();

updateExpenseOverview();


/* =========================
   SIDEBAR NAVIGATION
========================= */

const sidebarItems = document.querySelectorAll(".nav-item");

sidebarItems.forEach(item => {

    item.addEventListener("click", function () {

        // Remove active class from all sidebar items
        sidebarItems.forEach(nav => {
            nav.classList.remove("active");
        });

        // Add active class to clicked item
        this.classList.add("active");

        // Get section name
        const sectionName = this.dataset.section;

        // Find section
        const section = document.getElementById(sectionName);

        // Scroll to section if it exists
        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });

});
const sectionName = this.dataset.section;
const section = document.getElementById(sectionName);

if (section) {
    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}