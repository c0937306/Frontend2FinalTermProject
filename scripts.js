// JavaScript for Functionality
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const CURRENCY = 'usd';
const MAX_COMPARISON = 5;

const cryptoTable = document.getElementById('crypto-table').querySelector('tbody');
const comparisonTable = document.getElementById('comparison-table').querySelector('tbody');
const refreshButton = document.getElementById('refresh-data');

let comparisonList = JSON.parse(localStorage.getItem('comparisonList')) || [];

// Fetch Cryptocurrency Data
async function fetchCryptoData() {
    try {
        const response = await fetch(`${API_URL}?vs_currency=${CURRENCY}&order=market_cap_desc&per_page=50&page=1`);
        const data = await response.json();
        renderCryptoList(data);
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
    }
}

// Render Cryptocurrency List
function renderCryptoList(data) {
    cryptoTable.innerHTML = '';
    data.forEach((crypto) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crypto.name}</td>
            <td>${crypto.symbol.toUpperCase()}</td>
            <td>$${crypto.current_price.toFixed(2)}</td>
            <td>${crypto.price_change_percentage_24h.toFixed(2)}%</td>
            <td>$${crypto.market_cap.toLocaleString()}</td>
            <td><button onclick="addToComparison('${crypto.id}', '${crypto.name}', '${crypto.symbol}', ${crypto.current_price}, ${crypto.price_change_percentage_24h}, ${crypto.market_cap})">Add</button></td>
        `;
        cryptoTable.appendChild(row);
    });
}

// Add Cryptocurrency to Comparison
function addToComparison(id, name, symbol, price, change, marketCap) {
    if (comparisonList.length >= MAX_COMPARISON) {
        alert('You can only compare up to 5 cryptocurrencies.');
        return;
    }

    const exists = comparisonList.find((item) => item.id === id);
    if (exists) {
        alert('This cryptocurrency is already in the comparison list.');
        return;
    }

    const crypto = { id, name, symbol, price, change, marketCap };
    comparisonList.push(crypto);
    localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
    renderComparisonList();
}

// Render Comparison List
function renderComparisonList() {
    comparisonTable.innerHTML = '';
    comparisonList.forEach((crypto, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crypto.name}</td>
            <td>${crypto.symbol.toUpperCase()}</td>
            <td>$${crypto.price.toFixed(2)}</td>
            <td>${crypto.change.toFixed(2)}%</td>
            <td>$${crypto.marketCap.toLocaleString()}</td>
            <td><button onclick="removeFromComparison(${index})">Remove</button></td>
        `;
        comparisonTable.appendChild(row);
    });
}

// Remove Cryptocurrency from Comparison
function removeFromComparison(index) {
    comparisonList.splice(index, 1);
    localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
    renderComparisonList();
}

// Event Listeners
refreshButton.addEventListener('click', fetchCryptoData);

// Initialize App
fetchCryptoData();
renderComparisonList();
