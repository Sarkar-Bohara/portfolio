import { sql } from '@vercel/postgres';

export async function getPortfolioItems() {
  try {
    const { rows } = await sql`SELECT * FROM portfolio ORDER BY created_at DESC`;
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    // If table doesn't exist, return empty array (handling first run)
    return [];
  }
}

export async function createPortfolioTable() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS portfolio (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                image_url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
    } catch (error) {
        console.error('Failed to create table:', error);
    }
}
