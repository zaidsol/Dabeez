'use client';
import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import AddProductModal from "../components/AddProductModal";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { getToken } from "../lib/auth";

interface Product {
  _id: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
  color?: string;
  images?: string[];
  soldOut?: boolean;
}

interface ProductsPageProps {
  showNavbar?: boolean;
}

export default function ProductsPage({ showNavbar = true }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const { isAdmin, loading } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [fetchError, setFetchError] = useState("");

  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setFetchError("");
        console.log("🔄 Fetching products for PUBLIC view...");
        
        
        const res = await fetch("http://localhost:3001/products", {
          headers: {
            "Content-Type": "application/json",
            
          },
        });

        console.log("📡 Products API Response status:", res.status);

        if (!res.ok) {
          const errorMsg = `❌ Failed to load products: ${res.status}`;
          setFetchError(errorMsg);
          console.error(errorMsg);
          setProducts([]);
          return;
        }

        const data = await res.json();
        console.log("✅ Products fetched successfully:", data);
        
        if (!Array.isArray(data)) {
          console.error("❌ Expected array but got:", data);
          setFetchError("Invalid data format received from server");
          setProducts([]);
          return;
        }

        setProducts(data);
        console.log(`✅ Loaded ${data.length} products for public view`);

      } catch (err) {
        const errorMsg = "🔌 Network error: Failed to connect to server";
        console.error("Error fetching products:", err);
        setFetchError(errorMsg);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

 
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter((category): category is string => Boolean(category))))];
  
  // ADD: Filter products by category
  const filteredByCategory = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);
  
  
  const sortedProducts = [...filteredByCategory].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0; 
  });

  const handleUpload = async (productId: string, files: File[]) => {
    if (!files || files.length === 0) return;
    
    // ✅ Only admins can upload images
    if (!isAdmin) {
      alert("❌ Admin access required to upload images");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("❌ Please login to upload images");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("images", file));

    try {
      alert("🔄 Uploading images...");
      const res = await fetch(`http://localhost:3001/products/${productId}/upload-images`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("❌ Upload failed: Unauthorized. Please login again.");
          return;
        }
        throw new Error(`Upload failed: ${res.status}`);
      }

      const updatedProduct = await res.json();
      setProducts(prev => prev.map(p => (p._id === updatedProduct._id ? updatedProduct : p)));
      alert("✅ Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("❌ Failed to upload images");
    }
  };

  const handleToggleSoldOut = (productId: string, soldOut: boolean) => {
    setProducts(prev => prev.map(product => 
      product._id === productId ? { ...product, soldOut } : product
    ));
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen relative">
        {showNavbar && <Navbar />}
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center">
          <div className="text-xl">🔍 Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {showNavbar && <Navbar />}

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>
        
        {fetchError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            ⚠️ {fetchError}
          </div>
        )}

    

        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
     
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Price Sort */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Sort by Price:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="default">Default</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>

        {(selectedCategory !== 'All' || sortOrder !== 'default') && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700">
              Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
              {sortOrder !== 'default' && ` sorted by price ${sortOrder === 'asc' ? 'low to high' : 'high to low'}`}
            </p>
          </div>
        )}

   
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {sortedProducts && sortedProducts.length > 0 ? (
            sortedProducts.map(product => (
              product && product._id ? (
                <ProductCard
                  key={product._id}
                  product={product}
                  isAdmin={isAdmin} // Pass admin status for conditional features
                  onUpload={handleUpload}
                  onClick={() => setSelectedProduct(product)}
                  onToggleSoldOut={handleToggleSoldOut}
                />
              ) : null
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">
                {fetchError ? "❌ Failed to load products" : "📦 No products available"}
              </p>
              {!fetchError && (
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  🔄 Retry
                </button>
              )}
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-200"
            >
              ➕ Add New Product
            </button>
          </div>
        )}
      </main>

   
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdded={(newProduct) => {
            setProducts(prev => [...prev, newProduct]);
            alert("✅ Product added successfully!");
          }}
        />
      )}

      
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isAdmin={isAdmin} 
          onUpload={handleUpload}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}