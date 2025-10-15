"use client";
import React, { useState } from "react";
import { getToken } from "../lib/auth";

interface AddProductModalProps {
  onClose: () => void;
  onAdded: (product: any) => void;
}

export default function AddProductModal({ onClose, onAdded }: AddProductModalProps) {
  const [formData, setFormData] = useState({ name: "", price: "", category: "", description: "", color: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      alert("❌ Name & Price are required!");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("❌ Please login to add products");
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    files.forEach(file => data.append("images", file));

    try {
      console.log("🔄 Adding new product...");
      
      const res = await fetch("https://dabeez-backend.fly.dev/products", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });

      console.log("➕ Add product response status:", res.status);

      if (!res.ok) {
        if (res.status === 401) {
          alert("❌ Unauthorized! Please login again.");
          return;
        }
        throw new Error(`Failed to add product: ${res.status}`);
      }

      const result = await res.json();
      console.log("✅ Product added successfully:", result);
      
      onAdded(result.product);
      alert("✅ Product added successfully!");
      onClose();
    } catch (err) {
      console.error("Add product error:", err);
      alert("❌ Failed to add product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

        <input type="text" name="name" placeholder="Product Name *"
          value={formData.name} onChange={handleChange}
          className="w-full border rounded p-2 mb-3" />

        <input type="number" name="price" placeholder="Price *"
          value={formData.price} onChange={handleChange}
          className="w-full border rounded p-2 mb-3" />

        <input type="text" name="category" placeholder="Category"
          value={formData.category} onChange={handleChange}
          className="w-full border rounded p-2 mb-3" />

        <input type="text" name="color" placeholder="Color"
          value={formData.color} onChange={handleChange}
          className="w-full border rounded p-2 mb-3" />

        <textarea name="description" placeholder="Description"
          value={formData.description} onChange={handleChange}
          className="w-full border rounded p-2 mb-3" />

        <input type="file" multiple onChange={handleFileChange} className="mb-3" />

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
