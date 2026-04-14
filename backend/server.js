const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const yahooFinance = require('yahoo-finance2').default;

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Helper to read DB
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
// Helper to write DB
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Get User Account Info
app.get('/api/account', (req, res) => {
  try {
    const db = readDB();
    res.json(db);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read account data' });
  }
});

// Search Stock Price
app.get('/api/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const result = await yahooFinance.quote(symbol);
    if (!result) return res.status(404).json({ error: 'Stock not found' });
    
    res.json({
      symbol: result.symbol,
      price: result.regularMarketPrice,
      change: result.regularMarketChangePercent,
      name: result.shortName,
      currency: result.currency
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Buy Stock
app.post('/api/buy', async (req, res) => {
  const { symbol, shares } = req.body;
  if (!symbol || !shares || shares <= 0) {
    return res.status(400).json({ error: 'Invalid trade data' });
  }

  try {
    const stock = await yahooFinance.quote(symbol);
    const price = stock.regularMarketPrice;
    const cost = price * shares;

    const db = readDB();
    if (db.balance < cost) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    db.balance -= cost;
    const existingPosition = db.portfolio.find(p => p.symbol === symbol);
    if (existingPosition) {
      const totalShares = existingPosition.shares + shares;
      existingPosition.avgPrice = (existingPosition.avgPrice * existingPosition.shares + cost) / totalShares;
      existingPosition.shares = totalShares;
    } else {
      db.portfolio.push({ symbol, shares, avgPrice: price });
    }

    writeDB(db);
    res.json(db);
  } catch (error) {
    res.status(500).json({ error: 'Trade failed' });
  }
});

// Sell Stock
app.post('/api/sell', async (req, res) => {
  const { symbol, shares } = req.body;
  if (!symbol || !shares || shares <= 0) {
    return res.status(400).json({ error: 'Invalid trade data' });
  }

  try {
    const db = readDB();
    const position = db.portfolio.find(p => p.symbol === symbol);
    if (!position || position.shares < shares) {
      return res.status(400).json({ error: 'Insufficient shares' });
    }

    const stock = await yahooFinance.quote(symbol);
    const price = stock.regularMarketPrice;
    const gain = price * shares;

    db.balance += gain;
    position.shares -= shares;
    if (position.shares === 0) {
      db.portfolio = db.portfolio.filter(p => p.symbol !== symbol);
    }

    writeDB(db);
    res.json(db);
  } catch (error) {
    res.status(500).json({ error: 'Trade failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
