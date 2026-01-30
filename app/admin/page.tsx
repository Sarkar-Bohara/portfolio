"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    // Check local storage for session
    const session = localStorage.getItem("admin_session");
    if (session === "true") {
      setIsLoggedIn(true);
      fetchItems();
    }
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Hardcoded credentials for demonstration (Change in production!)
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true);
      localStorage.setItem("admin_session", "true");
      fetchItems();
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_session");
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async () => {
    if (!newTitle || !newDesc) {
        alert("Please fill in title and description");
        return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          image_url: newImage,
        }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewDesc("");
        setNewImage("");
        fetchItems();
        alert("Item added successfully!");
      } else {
        alert("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/portfolio?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchItems();
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
            <div className="text-center mt-4">
                 <Link href="/" className="text-sm text-gray-500 hover:underline">← Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                View Site
            </Link>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Item Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border rounded-md p-2"
                  placeholder="Project Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full border rounded-md p-2 h-32"
                  placeholder="Project Description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {newImage && (
                  <div className="mt-2 h-40 w-full overflow-hidden rounded bg-gray-100">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={newImage} alt="Preview" className="h-full w-full object-contain" />
                  </div>
                )}
              </div>
              <button
                onClick={handleAddItem}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Add Project"}
              </button>
            </div>
          </div>

          {/* List of Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Existing Projects</h2>
            {items.length === 0 ? (
                <p className="text-gray-500 italic">No items found.</p>
            ) : (
                items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-start">
                    {item.image_url && (
                    <div className="h-24 w-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    )}
                    <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Delete"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    </button>
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
