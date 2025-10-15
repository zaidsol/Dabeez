"use client";

import { useCart } from "../components/CartContext";
import { useState } from "react";
import Navbar from "../components/Navbar";

// Define proper TypeScript interfaces
interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  // Add other properties your cart items have
  image?: string;
  category?: string;
}

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [transactionId, setTransactionId] = useState("");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Save order to database
  const saveOrderToDatabase = async (transactionId: string = "") => {
    try {
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          email: formData.email || ""
        },
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          productId: item._id // Use _id since that's what your items have
        })),
        totalAmount: subtotal,
        paymentMethod: paymentMethod,
        transactionId: transactionId
      };

      console.log("📦 Sending order to API:", orderData);

      const response = await fetch('https://dabeez-backend.fly.dev/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log("📦 API Response:", result);

      if (result.success) {
        console.log("✅ Order saved to database:", result.order);
        return result.order;
      } else {
        throw new Error(result.message || 'Failed to save order');
      }
    } catch (error) {
      console.error("❌ Error saving order to database:", error);
      throw error;
    }
  };

  // Complete order function
  const completeOrder = async (txnId: string = "") => {
    try {
      const savedOrder = await saveOrderToDatabase(txnId);
      
      console.log("✅ Order completed and saved:", { 
        orderId: savedOrder.orderId,
        transactionId: txnId 
      });
      
      const successMessage = paymentMethod === "cash" 
        ? `✅ Order placed successfully!\n\nOrder ID: ${savedOrder.orderId}\nAmount: $${subtotal.toFixed(2)}\n\nYour order has been confirmed and will be shipped soon.`
        : `✅ Payment Successful!\n\nOrder ID: ${savedOrder.orderId}\nTransaction ID: ${txnId}\nAmount: $${subtotal.toFixed(2)}\n\nYour order has been confirmed and will be shipped soon.`;
      
      alert(successMessage);
      
      clearCart();
      setFormData({ name: "", phone: "", address: "", email: "" });
      setPaymentStatus("idle");
      
    } catch (error) {
      console.error("❌ Error completing order:", error);
      alert(`❌ Failed to place order: ${(error as Error).message}\n\nPlease try again or contact support.`);
      setPaymentStatus("failed");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert("❌ Please fill in all required fields: Name, Phone, and Address");
      return;
    }

    if (cartItems.length === 0) {
      alert("❌ Your cart is empty");
      return;
    }
    
    if (paymentMethod === "cash") {
      try {
        setPaymentStatus("processing");
        await completeOrder();
      } catch (error) {
        console.error("Cash order error:", error);
      }
    } else if (paymentMethod === "easypasa") {
      setPaymentStatus("processing");
      
      setTimeout(async () => {
        try {
          const simulatedTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await completeOrder(simulatedTransactionId);
        } catch (error) {
          console.error("EasyPasa order error:", error);
        }
      }, 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <ul className="divide-y">
              {cartItems.map((item: CartItem) => (
                <li
                  key={item._id}
                  className="flex justify-between py-3 text-gray-700"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between mt-6 text-lg font-bold">
            <span>Total</span>
            <span className="text-green-600">${subtotal.toFixed(2)}</span>
          </div>

          {/* Payment Status Display */}
          {paymentStatus === "processing" && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-700 font-medium">
                  {paymentMethod === "cash" ? "Placing Order..." : "Processing Payment..."}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name *"
              className="w-full border p-3 rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={paymentStatus === "processing"}
            />
            <input
              type="text"
              placeholder="Phone Number *"
              className="w-full border p-3 rounded-lg"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              disabled={paymentStatus === "processing"}
            />
            <input
              type="email"
              placeholder="Email (Optional)"
              className="w-full border p-3 rounded-lg"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={paymentStatus === "processing"}
            />
            <textarea
              placeholder="Delivery Address *"
              className="w-full border p-3 rounded-lg"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              disabled={paymentStatus === "processing"}
            />

            {/* Payment Method */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={paymentStatus === "processing"}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="payment"
                    value="easypasa"
                    checked={paymentMethod === "easypasa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={paymentStatus === "processing"}
                  />
                  <span>EasyPasa (Digital Payment)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={paymentStatus === "processing" || cartItems.length === 0}
              className={`w-full text-white font-semibold py-3 rounded-lg transition ${
                paymentStatus === "processing" || cartItems.length === 0
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {paymentStatus === "processing" ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : paymentMethod === "easypasa" ? (
                "Pay with EasyPasa"
              ) : (
                "Place Order (Cash)"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
