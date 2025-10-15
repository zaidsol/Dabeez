import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import ProductsPage from "../product/page";

const featuredProducts = [
  { id: 1, name: "T-Shirt", price: 25, image: "https://via.placeholder.com/400x500?text=T-Shirt" },
  { id: 2, name: "Jeans", price: 40, image: "https://via.placeholder.com/400x500?text=Jeans" },
  { id: 3, name: "Jacket", price: 60, image: "https://via.placeholder.com/400x500?text=Jacket" },
  { id: 4, name: "Sneakers", price: 70, image: "https://via.placeholder.com/400x500?text=Sneakers" },
];

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-100">
      <Navbar />
      <Hero />
    <ProductsPage showNavbar={false} />  {/* Navbar skipped here */}

      <Footer />
    </div>
  );
};

export default LandingPage;
