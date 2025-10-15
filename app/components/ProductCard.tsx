"use client";
import React, { useState } from "react";
import ProductModal from "./ProductModal";
import { useCart } from "./CartContext";
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

interface Props {
  product: Product;
  isAdmin: boolean;
  onUpload: (productId: string, files: File[]) => void;
  onClick?: () => void;
  onToggleSoldOut?: (productId: string, soldOut: boolean) => void;
}

const ProductCard: React.FC<Props> = ({ product, isAdmin, onUpload, onClick, onToggleSoldOut }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  const firstImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.png";

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this product?")) return;

    try {
      const token = getToken();
      if (!token) {
        alert("❌ Please login to delete products");
        return;
      }

      console.log("🔄 Attempting to delete product:", product._id);
      
      const res = await fetch(`https://dabeez-backend.fly.dev/products/${product._id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      console.log("🗑️ Delete response status:", res.status);

      if (res.ok) {
        alert("✅ Product deleted successfully!");
        window.location.reload();
      } else {
        if (res.status === 401) {
          alert("❌ Unauthorized! Please login again.");
        } else {
          alert(`❌ Delete failed: ${res.status}`);
        }
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("❌ Network error: Failed to delete product");
    }
  };

  const handleToggleSoldOut = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSoldOutStatus = !product.soldOut;
    
    try {
      const token = getToken();
      if (!token) {
        alert("❌ Please login to update product status");
        return;
      }

      console.log("🔄 Toggling sold out status:", product._id, newSoldOutStatus);
      
      const res = await fetch(`https://dabeez-backend.fly.dev/products/${product._id}`, {
        method: "PUT",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ soldOut: newSoldOutStatus })
      });

      console.log("🏷️ Toggle response status:", res.status);
      
      if (res.ok) {
        if (onToggleSoldOut) {
          onToggleSoldOut(product._id, newSoldOutStatus);
        }
        alert(`✅ Product ${newSoldOutStatus ? 'marked as Sold Out' : 'marked as Available'}`);
      } else {
        if (res.status === 401) {
          alert("❌ Unauthorized: Please login as admin again");
        } else {
          alert(`❌ Failed to update: ${res.status}`);
        }
      }
    } catch (err) {
      console.error("Toggle sold out failed", err);
      alert("❌ Network error: Failed to update product status");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (product.soldOut) {
      alert("❌ This product is sold out and cannot be added to cart");
      return;
    }
    
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: firstImage,
    });
    alert("🛒 Product added to cart!");
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col w-72 relative ${
          product.soldOut ? 'opacity-70' : ''
        }`}
        onClick={() => {
          setIsModalOpen(true);
          if (onClick) onClick();
        }}
      >
        {product.soldOut && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
            SOLD OUT
          </div>
        )}
        
        <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={firstImage}
            alt={product.name}
            className={`h-full w-full object-contain transition-transform duration-300 hover:scale-105 ${
              product.soldOut ? 'opacity-80' : ''
            }`}
          />
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-xl font-semibold mb-1 text-gray-800">{product.name}</h3>
          {product.category && <p className="text-gray-500">{product.category}</p>}
          {product.color && <p className="text-gray-500">Color: {product.color}</p>}
          <p className="text-gray-900 font-bold text-xl mb-4">${product.price}</p>

          <div className="flex gap-2 mt-auto">
            <button
              className={`flex-1 font-medium py-2 px-4 rounded-lg transition ${
                product.soldOut 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              onClick={handleAddToCart}
              disabled={product.soldOut}
            >
              {product.soldOut ? 'Sold Out' : 'Add to Cart'}
            </button>

            {isAdmin && (
              <div className="flex gap-1">
                <button
                  className={`px-3 rounded-lg ${
                    product.soldOut 
                      ? 'bg-yellow-500 hover:bg-yellow-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                  onClick={handleToggleSoldOut}
                  title={product.soldOut ? 'Mark as Available' : 'Mark as Sold Out'}
                >
                  {product.soldOut ? '🔄' : '🏷️'}
                </button>
                
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg"
                  onClick={handleDelete}
                >
                  🗑
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal
          product={product}
          isAdmin={isAdmin}
          onUpload={onUpload}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
