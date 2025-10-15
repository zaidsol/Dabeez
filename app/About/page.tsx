'use client';
import React from "react";
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen">
        <Navbar></Navbar>
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">About Our Brand</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            At Trendy Threads, we believe in fashion that is both timeless and affordable. Our mission is to provide high-quality clothing for everyone.
          </p>
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <img
            src="/assets/hero3.jpg"
            alt="About us"
            className="rounded-lg w-full object-cover shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2025, Trendy Threads started with a vision to redefine fashion for modern individuals. We focus on sustainable materials, ethical production, and timeless designs.
            </p>
            <p className="text-gray-600">
              From casual wear to formal outfits, we carefully curate every collection to inspire confidence and style.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-white p-10 rounded-lg shadow-md text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            To empower individuals to express themselves through fashion while maintaining sustainable practices that respect our planet.
          </p>
        </section>
      </main>
    </div>
  );
}
