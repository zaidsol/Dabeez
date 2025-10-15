// app/admin/dashboard/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

interface Order {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    phone: string;
    address?: string;
    email?: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    productId?: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'completed';
  paymentMethod: 'cash' | 'easypasa';
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  todaysOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todaysOrders: 0,
    totalRevenue: 0
  });
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [newOrderNotification, setNewOrderNotification] = useState<Order | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

 
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

 
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/orders/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };


  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'completed') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update order');
      
    
      setOrders(prev => 
        prev.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
     
      fetchStats();
      
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };


  useEffect(() => {
    if (!isAdmin) return;

    fetchOrders();
    fetchStats();


    const interval = setInterval(() => {
      fetchOrders();
      fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [isAdmin]);

 
  useEffect(() => {
    if (orders.length > 0) {
      const latestOrder = orders[0]; // Assuming sorted by newest first
      const isNewOrder = Date.now() - new Date(latestOrder.createdAt).getTime() < 15000;
      
      if (isNewOrder && latestOrder.status === 'pending') {
        setNewOrderNotification(latestOrder);
        setTimeout(() => setNewOrderNotification(null), 5000);
      }
    }
  }, [orders]);

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const completedOrders = orders.filter(order => order.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600 text-xl">Access Denied</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
     
      {newOrderNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-slide-in z-50">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div>
              <p className="font-semibold">New Order Received!</p>
              <p className="text-sm">#{newOrderNotification.orderId} - {newOrderNotification.customer.name}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Dashboard</h1>
          <p className="text-gray-600">Live order management system</p>
        </div>

        {/* Order Counters */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div 
            className={`bg-white rounded-2xl shadow-sm border-2 p-6 cursor-pointer transition-all ${
              activeTab === 'pending' ? 'border-blue-500 bg-blue-50' : 'border-gray-100'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div 
            className={`bg-white rounded-2xl shadow-sm border-2 p-6 cursor-pointer transition-all ${
              activeTab === 'completed' ? 'border-green-500 bg-green-50' : 'border-gray-100'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'pending' ? 'Pending Orders' : 'Order History'}
              </h2>
              <button
                onClick={() => {
                  setLoadingOrders(true);
                  fetchOrders();
                  fetchStats();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Refresh</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activeTab === 'pending' ? (
              <div className="space-y-4">
                {pendingOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-500 text-lg">No pending orders</p>
                    <p className="text-gray-400 text-sm">New orders will appear here automatically</p>
                  </div>
                ) : (
                  pendingOrders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              # {order.orderId}
                            </div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold text-gray-900">{order.customer.name}</p>
                              <p className="text-gray-600 text-sm">{order.customer.phone}</p>
                              {order.customer.email && (
                                <p className="text-gray-600 text-sm">{order.customer.email}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Payment: 
                                <span className={`ml-2 ${
                                  order.paymentMethod === 'cash' ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                  {order.paymentMethod === 'cash' ? '💵 Cash' : '📱 EasyPasa'}
                                </span>
                              </p>
                              <p className="text-lg font-bold text-green-600">
                                ${order.totalAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm text-gray-700 font-medium">Items:</p>
                            <div className="mt-1 space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm text-gray-600">
                                  {item.name} × {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="lg:ml-6">
                          <button
                            onClick={() => updateOrderStatus(order._id, 'completed')}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2"
                          >
                            <span>✅</span>
                            <span>Mark Complete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {completedOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-500 text-lg">No completed orders yet</p>
                  </div>
                ) : (
                  completedOrders.map((order) => (
                    <div key={order._id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            # {order.orderId}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{order.customer.name}</p>
                            <p className="text-gray-500 text-sm">
                              {new Date(order.createdAt).toLocaleDateString()} • 
                              ${order.totalAmount.toFixed(2)}
                            </p>
                            <p className="text-gray-400 text-xs">
                              Completed: {new Date(order.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 text-green-600">
                            <span>✅</span>
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                          <p className="text-gray-400 text-xs">
                            {order.paymentMethod === 'cash' ? '💵 Cash' : '📱 EasyPasa'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="fixed bottom-4 left-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}