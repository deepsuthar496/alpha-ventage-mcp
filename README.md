# Alpha Vantage MCP Server 📈

A Model Context Protocol (MCP) server that provides seamless integration with Alpha Vantage's financial data API, enabling real-time stock market data, cryptocurrency prices, forex rates, and technical indicators.

## 🌟 Features

### Stock Market Data
- Real-time stock quotes from global markets
- Historical price data (daily, weekly)
- Comprehensive company information
- Support for multiple exchanges (NYSE, NASDAQ, BSE)

### Cryptocurrency Data
- Real-time crypto prices
- Digital currency exchange rates
- Major cryptocurrency market data

### Forex Trading
- Live foreign exchange rates
- Currency pair conversions
- Global forex market data

### Technical Analysis
- Advanced technical indicators
- Moving averages (SMA, EMA)
- Market momentum indicators
- Trading signals and patterns

## 🚀 Quick Start

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd alpha-vantage-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

### Configuration

Configure the server in your MCP settings file:

```json
{
  "mcpServers": {
    "alpha-vantage": {
      "command": "node",
      "args": ["path/to/alpha-vantage-server/build/index.js"],
      "env": {
        "ALPHA_VANTAGE_API_KEY": "your-api-key-here"
      },
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

## 🛠️ Available Tools

### Stock Market Tools

#### get_stock_price
```typescript
// Get real-time stock quotes
<use_mcp_tool>
<server_name>alpha-vantage</server_name>
<tool_name>get_stock_price</tool_name>
<arguments>
{
  "symbol": "AAPL"  // or "RELIANCE.BSE" for Indian stocks
}
</arguments>
</use_mcp_tool>
```

#### get_daily_time_series
```typescript
// Get daily stock price history
<use_mcp_tool>
<server_name>alpha-vantage</server_name>
<tool_name>get_daily_time_series</tool_name>
<arguments>
{
  "symbol": "MSFT",
  "outputsize": "compact"
}
</arguments>
</use_mcp_tool>
```

### Cryptocurrency Tools

#### get_crypto_price
```typescript
// Get cryptocurrency prices
<use_mcp_tool>
<server_name>alpha-vantage</server_name>
<tool_name>get_crypto_price</tool_name>
<arguments>
{
  "symbol": "BTC",
  "market": "USD"
}
</arguments>
</use_mcp_tool>
```

### Forex Tools

#### get_forex_rate
```typescript
// Get currency exchange rates
<use_mcp_tool>
<server_name>alpha-vantage</server_name>
<tool_name>get_forex_rate</tool_name>
<arguments>
{
  "from_currency": "USD",
  "to_currency": "EUR"
}
</arguments>
</use_mcp_tool>
```

## 📊 Technical Analysis

### get_technical_indicator
```typescript
// Get technical indicators
<use_mcp_tool>
<server_name>alpha-vantage</server_name>
<tool_name>get_technical_indicator</tool_name>
<arguments>
{
  "symbol": "AAPL",
  "indicator": "SMA",
  "interval": "daily"
}
</arguments>
</use_mcp_tool>
```

## 🔑 API Key

Sign up for an API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key). Free tier includes:
- 25 API calls per day
- Real-time and historical data access
- Global market coverage

## 🌐 Supported Markets

- US Stock Markets (NYSE, NASDAQ)
- Indian Stock Market (BSE)
- Global Cryptocurrency Markets
- Foreign Exchange Markets
- International Stock Markets

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📝 License

MIT

