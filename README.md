# Cryptocurrency Exchange Frontend

## Quick Setup

### Prerequisites

Node.js (v16+)
npm or yarn
Backend API running

### Installation

Install dependencies:

npm install

Configure environment:
cp .env.example .env

Edit .env file with your backend URL:

REACT_APP_API_URL=http://localhost:3001

Start server:

npm start

Application will run at: http://localhost:1234

### Features

Authentication with username only
Real-time order book (bid/ask)
Buy/sell BTC/USD trading pairs
Live market statistics
Trade history and active orders
WebSocket real-time updates

### Docker Support with Docker desktop

Run with Docker:
docker build -t crypto-exchange-frontend .
docker run -p 1234:80 crypto-exchange-frontend

