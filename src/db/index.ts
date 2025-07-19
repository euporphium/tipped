import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { env } from '@/env';

/**
 * Database connection manager using singleton pattern
 * Provides centralized connection pool management with proper cleanup
 */
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: mysql.Pool | null = null;
  private isInitialized = false;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Initialize the connection pool with enhanced configuration
   */
  public initialize(): mysql.Pool {
    if (this.isInitialized && this.pool) {
      return this.pool;
    }

    try {
      this.pool = mysql.createPool({
        uri: env.DATABASE_URL,
        // Connection pool configuration
        connectionLimit: 10,
        queueLimit: 0,
        waitForConnections: true,
        // Enhanced stability settings
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });

      this.isInitialized = true;
      console.log('Database connection pool initialized successfully');
      return this.pool;
    } catch (error) {
      console.error('Failed to initialize database connection pool:', error);
      throw error;
    }
  }

  /**
   * Get the current connection pool
   */
  public getPool(): mysql.Pool {
    if (!this.pool || !this.isInitialized) {
      return this.initialize();
    }
    return this.pool;
  }

  /**
   * Test the database connection
   */
  public async testConnection(): Promise<{
    success: boolean;
    data?: any;
    error?: any;
  }> {
    try {
      const pool = this.getPool();
      const [rows] = await pool.execute('SELECT 1 as test');
      return { success: true, data: rows };
    } catch (error) {
      console.error('Database connection test failed:', error);
      return { success: false, error };
    }
  }

  /**
   * Get connection pool status and statistics
   */
  public getConnectionStatus() {
    if (!this.pool) {
      return { error: 'Connection pool not initialized' };
    }

    return {
      connectionLimit: this.pool.config.connectionLimit,
      isInitialized: this.isInitialized,
    };
  }

  /**
   * Gracefully close the connection pool
   */
  public async closeConnection(): Promise<void> {
    if (this.pool && this.isInitialized) {
      try {
        await this.pool.end();
        this.pool = null;
        this.isInitialized = false;
        console.log('Database connection pool closed successfully');
      } catch (error) {
        console.error('Error closing database connection pool:', error);
        throw error;
      }
    }
  }

  /**
   * Check if the connection pool is healthy
   */
  public isHealthy(): boolean {
    return this.isInitialized && this.pool !== null;
  }
}

// Create singleton instance
const dbConnection = DatabaseConnection.getInstance();

// Initialize the connection pool
const pool = dbConnection.initialize();

// Create drizzle instance with the connection pool
const db = drizzle(pool);

// Export the database instance
export { db };

// Export utility functions
export const testConnection = () => dbConnection.testConnection();
export const closeConnection = () => dbConnection.closeConnection();
export const getConnectionStatus = () => dbConnection.getConnectionStatus();

// Export the repository
export { shiftsRepository } from './shiftsRepository';
