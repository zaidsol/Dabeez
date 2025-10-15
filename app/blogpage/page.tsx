'use client';
import React from "react";

const BlogPage = () => {
  const images = [
    "/assets/a1.jpeg",
    "/assets/a2.jpeg",
    "/assets/a3.jpeg",
    "/assets/a4.jpeg",
    "/assets/a5.jpeg",
    "/assets/a6.jpeg",
    "/assets/a7.jpeg",
    "/assets/a8.jpeg",
    "/assets/a9.jpeg",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Stylish Header */}
      <header className="text-center py-20 relative">
        {/* Green background behind heading */}
        <div className="absolute inset-0 bg-green-500 -skew-y-6 z-0"></div>
        <h1 className="relative z-10 text-6xl md:text-7xl font-extrabold tracking-wide bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
          Darbeezo Atlas
        </h1>
        <p className="relative z-10 mt-4 text-xl md:text-2xl font-light tracking-wider text-white">
          A visual journey through our curated gallery
        </p>
      </header>

      {/* Blog Intro Text */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <section className="space-y-6 text-gray-800 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl md:text-4xl font-bold bg-green-200 inline-block px-4 py-2 rounded-md text-yellow-600">
            Explore the beauty captured in every frame
          </h2>
          <p>
            Darbeezo Atlas brings you closer to breathtaking landscapes, vibrant cultures, and unforgettable moments. Every image tells a story, and every story is unique.
          </p>
          <p>
            Scroll down to dive into our gallery, where each photograph is carefully curated to inspire, inform, and amaze.
          </p>
        </section>

        {/* Masonry Gallery */}
        <section className="mt-12">
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {images.map((src, index) => (
              <div key={index} className="break-inside-avoid rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition duration-300">
                <img
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </section>

        {/* More Stylish Text */}
        <section className="mt-16 space-y-6 text-gray-700 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl md:text-4xl font-bold bg-green-200 inline-block px-4 py-2 rounded-md text-yellow-600">
            Each photograph tells a story
          </h2>
          <p className="font-medium text-gray-800">
            Each photograph in Darbeezo Atlas is a testament to the beauty of the world around us. We capture not just images but emotions and experiences.
          </p>
          <p>
            Our goal is to inspire exploration, creativity, and appreciation for the wonders we often overlook. The Darbeezo Atlas gallery is a space where stories unfold with every scroll.
          </p>
        </section>
      </main>
    </div>
  );
};

export default BlogPage;
