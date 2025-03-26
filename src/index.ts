#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosInstance } from 'axios';

interface AlphaVantageConfig {
  apiKey: string;
}

class AlphaVantageServer {
  private server: Server;
  private axiosInstance: AxiosInstance;

  constructor(config: AlphaVantageConfig) {
    this.server = new Server(
      {
        name: 'alpha-ventage-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      baseURL: 'https://www.alphavantage.co/query',
      params: {
        apikey: config.apiKey,
      },
    });

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'get_stock_price':
            return await this.getStockPrice(request.params.arguments);
          case 'get_company_overview':
            return await this.getCompanyOverview(request.params.arguments);
          case 'get_daily_time_series':
            return await this.getDailyTimeSeries(request.params.arguments);
          case 'get_weekly_time_series':
            return await this.getWeeklyTimeSeries(request.params.arguments);
          case 'get_forex_rate':
            return await this.getForexRate(request.params.arguments);
          case 'get_crypto_price':
            return await this.getCryptoPrice(request.params.arguments);
          case 'get_technical_indicator':
            return await this.getTechnicalIndicator(request.params.arguments);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            content: [
              {
                type: 'text',
                text: `Alpha Vantage API error: ${
                  error.response?.data.message ?? error.message
                }`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    });

    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_stock_price',
          description: 'Get real-time stock price information',
          inputSchema: {
            type: 'object',
            properties: {
              symbol: {
                type: 'string',
                description: 'The stock symbol (e.g., AAPL)',
              },
            },
            required: ['symbol'],
          },
        },
        {
          name: 'get_company_overview',
          description: 'Get company information and key metrics',
          inputSchema: {
            type: 'object',
            properties: {
              symbol: {
                type: 'string',
                description: 'The stock symbol (e.g., AAPL)',
              },
            },
            required: ['symbol'],
          },
        },
        {
          name: 'get_daily_time_series',
          description: 'Get daily time series data for a stock',
          inputSchema: {
            type: 'object',
            properties: {
              symbol: {
                type: 'string',
                description: 'The stock symbol (e.g., AAPL)',
              },
              outputsize: {
                type: 'string',
                description: 'Amount of data to return (compact/full)',
                enum: ['compact', 'full'],
                default: 'compact',
              },
            },
            required: ['symbol'],
          },
        },
        {
          name: 'get_weekly_time_series',
          description: 'Get weekly time series data for a stock',
          inputSchema: {
            type: 'object',
            properties: {
              symbol: {
                type: 'string',
                description: 'The stock symbol (e.g., AAPL)',
              },
            },
            required: ['symbol'],
          },
        },
        {
          name: 'get_forex_rate',
          description: 'Get exchange rate for currency pairs',
          inputSchema: {
            type: 'object',
            properties: {
              from_currency: {
                type: 'string',
                description: 'From currency (e.g., USD)',
              },
              to_currency: {
                type: 'string',
                description: 'To currency (e.g., EUR)',
              },
            },
            required: ['from_currency', 'to_currency'],
          },
        },
        {
          name: 'get_crypto_price',
          description: 'Get cryptocurrency prices',
          inputSchema: {
            type: 'object',
            properties: {
              symbol: {
                type: 'string',
                description: 'The crypto symbol (e.g., BTC)',
              },
              market: {
                type: 'string',
                description: 'Market currency (e.g., USD)',
              },
            },
            required: ['symbol', 'market'],
          },
        },
        {
          name: 'get_technical_indicator',
          description: 'Get technical indicators for a stock',
          inputSchema: {
            type: 'object',
            properties: {
              symbol: {
                type: 'string',
                description: 'The stock symbol (e.g., AAPL)',
              },
              indicator: {
                type: 'string',
                description: 'Technical indicator (e.g., SMA, EMA, RSI)',
              },
              interval: {
                type: 'string',
                description: 'Time interval',
                enum: ['1min', '5min', '15min', '30min', '60min', 'daily', 'weekly', 'monthly'],
                default: 'daily',
              },
            },
            required: ['symbol', 'indicator'],
          },
        },
      ],
    }));
  }

  private async getStockPrice(args: any) {
    const response = await this.axiosInstance.get('', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: args.symbol,
      },
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getCompanyOverview(args: any) {
    const response = await this.axiosInstance.get('', {
      params: {
        function: 'OVERVIEW',
        symbol: args.symbol,
      },
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getDailyTimeSeries(args: any) {
    const response = await this.axiosInstance.get('', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: args.symbol,
        outputsize: args.outputsize || 'compact',
      },
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getWeeklyTimeSeries(args: any) {
    const response = await this.axiosInstance.get('', {
      params: {
        function: 'TIME_SERIES_WEEKLY',
        symbol: args.symbol,
      },
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getForexRate(args: any) {
    const response = await this.axiosInstance.get('', {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: args.from_currency,
        to_currency: args.to_currency,
      },
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getCryptoPrice(args: any) {
    const response = await this.axiosInstance.get('', {
      params: {
        function: 'CRYPTO_INTRADAY',
        symbol: args.symbol,
        market: args.market,
      },
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getTechnicalIndicator(args: any) {
    const response = await this.axiosInstance.get('', {
      params: {
        function: args.indicator,
        symbol: args.symbol,
        interval: args.interval || 'daily',
      },
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Alpha Vantage MCP server running on stdio');
  }
}

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
if (!API_KEY) {
  throw new Error('ALPHA_VANTAGE_API_KEY environment variable is required');
}

const server = new AlphaVantageServer({
  apiKey: API_KEY,
});
server.run().catch(console.error);
