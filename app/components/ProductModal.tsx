'use client';
import React, { useState } from "react";
import { getToken } from "../lib/auth";

interface Product {
  _id: string;
  name: string;
  price?: number;
  category?: string;
  images?: string[];
}

interface ProductModalProps {
  product: Product;
  isAdmin: boolean;
  onUpload: (productId: string, files: File[]) => void;
  onClose: () => void;
}

export default function ProductModal({ product, isAdmin, onUpload, onClose }: ProductModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  };

  const handleUploadClick = async () => {
    if (selectedFiles.length === 0) {
      alert("❌ Please select at least one file!");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("❌ Please login to upload images");
      return;
    }

    setUploading(true);
    try {
      console.log("🔄 Uploading images for product:", product._id);
      await onUpload(product._id, selectedFiles);
      setSelectedFiles([]);
      alert("✅ Images uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = (img: string) => {
    setSelectedImage(img);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded p-6 w-[80%] max-w-3xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">{product.name}</h2>

          {/* Images Gallery */}
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {(product.images || []).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`product-${idx}`}
                className="w-32 h-32 object-cover rounded cursor-pointer transition-transform hover:scale-105 shadow-md"
                onClick={() => handleImageClick(img)}
              />
            ))}
            {(!product.images || product.images.length === 0) && (
              <p className="text-gray-500">No images available</p>
            )}
          </div>

          {/* Admin Upload Section */}
          {isAdmin && (
            <div className="mb-4 flex flex-col items-center">
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                className="mb-3" 
                disabled={uploading}
              />
              <button
                onClick={handleUploadClick}
                disabled={uploading || selectedFiles.length === 0}
                className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Images"}
              </button>
              {selectedFiles.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected {selectedFiles.length} file(s)
                </p>
              )}
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="mt-4 bg-red-500 text-white py-2 px-6 rounded hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={handleCloseImageModal}
        >
          <div className="relative w-[90%] max-w-5xl mx-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="zoomed-product"
              className="w-full h-auto max-h-[85vh] object-contain rounded shadow-lg"
            />
            <button
              onClick={handleCloseImageModal}
              className="absolute -top-8 right-0 text-white text-4xl font-bold hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}