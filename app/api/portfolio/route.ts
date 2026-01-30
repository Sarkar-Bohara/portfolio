import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Ensure table exists
    await sql`CREATE TABLE IF NOT EXISTS portfolio (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`;

    const { rows } = await sql`SELECT * FROM portfolio ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, image_url } = await request.json();
    
    // Simple validation
    if (!title || !description) {
        return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const { rows } = await sql`
      INSERT INTO portfolio (title, description, image_url)
      VALUES (${title}, ${description}, ${image_url})
      RETURNING *;
    `;
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await sql`DELETE FROM portfolio WHERE id = ${id}`;
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
