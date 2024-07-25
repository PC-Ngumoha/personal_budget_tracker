// Contains the code for behavious of the app
// Currency: ₦

const expenseBoard = document.querySelector('#expenses .value');
const balanceBoard = document.querySelector('#remaining .value');
const totalBoard = document.querySelector('#total .value');
const addButton = document.getElementById('add-button');
const clearButton = document.getElementById('clear-button');
const recordsTable = document.getElementById('records');
const totalIncomeField = document.getElementById('total-income');
const descriptionField = document.getElementById('description');
const amountField = document.getElementById('amount');

let data;
let count = 0;


document.addEventListener('DOMContentLoaded', function() {
  data = retrieveData();
  if (data) {
    calculateAndUpdateBoards(data);
    updateRecords(data);
    totalIncomeField.value = `${data.total}`;
  } else {
    data = {
      total: 0,
      transactions: []
    };
  }
});


clearButton.addEventListener('click', function() {
  clearData();
  data = {
    total: 0,
    transactions: []
  }
  calculateAndUpdateBoards(data);
  totalIncomeField.value = '';
});


addButton.addEventListener('click', function(evt) {
  evt.preventDefault();
  data.total = parseFloat(totalIncomeField.value);
  const description = descriptionField.value;
  const amount = parseFloat(amountField.value);

  count += 1;

  data.transactions.push({
    id: count,
    description,
    amount
  });

  calculateAndUpdateBoards(data);
  updateRecords(data);
  saveData(data);
});


function calculateAndUpdateBoards(data) {
  const sum = data.transactions.reduce(
    (sum, trans) => sum + trans.amount,
    0
  );
  // Updating the Boards
  const totalString = data.total.toLocaleString();
  const expenseString = sum.toLocaleString();
  const balanceString = (data.total - sum).toLocaleString();

  totalBoard.innerHTML = `₦ ${totalString}`;
  expenseBoard.innerHTML = `₦ ${expenseString}`;
  balanceBoard.innerHTML = `₦ ${balanceString}`;
}


function updateRecords(data) {
  const tbody = document.createElement('tbody');

  data.transactions.forEach((trans) => {
    const row = createAndPopulateRow(trans);
    tbody.appendChild(row);
  });
  if (recordsTable.children.length >= 2) {
    const prevTbody = recordsTable.children[1];
    recordsTable.replaceChild(tbody, prevTbody);
  } else {
    recordsTable.appendChild(tbody);
  }
}


function createAndPopulateRow(transaction) {
  const row = document.createElement('tr');
  const descriptionCell = document.createElement('td');
  const amountCell = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Delete';
  deleteButton.classList.add('deleteButton');
  deleteButton.setAttribute('data-ID', transaction.id);

  deleteButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    const button = evt.target;
    const itemId = button.getAttribute('data-ID');
    data.transactions.splice(itemId - 1, 1);
    saveData(data);
    this.parentElement.parentElement.removeChild(this.parentElement);
    calculateAndUpdateBoards(data);
  });

  descriptionCell.innerHTML = transaction.description;
  amountCell.innerHTML = transaction.amount;

  row.append(descriptionCell, amountCell, deleteButton);
  return row;
}


function saveData(data) {
  if (localStorage.getItem('data')) {
    localStorage.removeItem('data');
  }
  localStorage.setItem('data', JSON.stringify(data));
}


function retrieveData() {
  if (localStorage.getItem('data')) {
    const data = JSON.parse(localStorage.getItem('data'));
    return data;
  }
}

function clearData() {
  if (localStorage.getItem('data')) {
    localStorage.removeItem('data');
  }
}