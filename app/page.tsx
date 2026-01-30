import { sql } from "@vercel/postgres";
import Link from "next/link";

// Force dynamic rendering to ensure we always get the latest data
export const dynamic = 'force-dynamic';

export default async function Home() {
  let rows = [];
  try {
    // Try to fetch data. If table doesn't exist, this might fail or return empty.
    // We'll handle the table creation in the API route or manual setup, 
    // but here we just want to display what's there.
    const result = await sql`SELECT * FROM portfolio ORDER BY created_at DESC`;
    rows = result.rows;
  } catch (error) {
    console.error("Database error (table might not exist yet):", error);
    // Fallback or empty state
  }

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          My Portfolio
        </h1>
        <p className="text-xl text-gray-600">
          Welcome to my digital showcase
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rows.length > 0 ? (
          rows.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {item.image_url && (
                <div className="h-64 w-full overflow-hidden relative">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 text-gray-800">
                  {item.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-100 rounded-xl">
            <h3 className="text-2xl font-semibold text-gray-500 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-400">
              Check back soon for amazing content!
            </p>
          </div>
        )}
      </div>

      <footer className="mt-20 text-center text-gray-400 border-t pt-8">
        <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        <Link 
          href="/admin" 
          className="inline-block mt-4 text-sm hover:text-gray-600 transition-colors"
        >
          Admin Login
        </Link>
      </footer>
    </main>
  );
}
