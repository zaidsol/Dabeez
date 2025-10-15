"use client";
import React from "react";
import { useCart } from "../components/CartContext";
import Link from "next/link";
import Navbar from "../components/Navbar";

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
          <Navbar></Navbar>
    
    <div className="max-w-6xl mx-auto px-6 py-10">
      
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b pb-4"
              >
             
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shadow"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>

           
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

           
                <p className="text-lg font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                {/* Delete */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="ml-4 text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-8 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Subtotal:</h2>
            <p className="text-2xl font-bold text-green-600">
              ${subtotal.toFixed(2)}
            </p>
          </div>

          <div className="mt-6 text-right">
            
        <Link href="/checkout">
  <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition">
    Proceed to Checkout
  </button>
</Link>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default CartPage;
