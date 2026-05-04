"use client";

import React, { useState, ChangeEvent } from 'react';
import { Plus, X, Maximize2 } from 'lucide-react'; 

interface PortfolioImage {
  id: string;
  url: string;
}

export default function PortfolioUpload() {
  const [images, setImages] = useState<PortfolioImage[]>([]);
 
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file), 
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <section className="mt-12 border-t border-gray-100 pt-10 pb-20">
      <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">Portfolio</h3>

      <div className="max-w-5xl mx-auto px-4">
       
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {images.map((image) => (
            <div 
              key={image.id} 
              onClick={() => setSelectedImage(image.url)} 
              className="relative group aspect-[3/4] rounded-2xl overflow-hidden border border-gray-200 shadow-md cursor-zoom-in transition-transform hover:scale-[1.02]"
            >
              <img 
                src={image.url} 
                alt="preview" 
                className="w-full h-full object-cover" 
              />
              
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Maximize2 className="text-white" size={32} />
              </div>

              <button 
                onClick={(e) => removeImage(image.id, e)}
                className="absolute top-1 right-2 p-1 bg-[#FF6B35] text-white rounded-full shadow-lg z-10"
              >
                <X size={15} />
              </button>
            </div>
          ))}

          <label className="flex flex-col items-center justify-center aspect-[3/4] border-2 border-solid border-gray-300 rounded-2xl hover:border-[#FF6B35] transition-all cursor-pointer group">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <div className="bg-gray-100 p-4 rounded-full group-hover:bg-blue-100 transition-colors">
              <Plus className="text-gray-500 group-hover:text-[#FF6B35]" size={32} />
            </div>
            <span className="mt-3 text-base font-semibold text-[#FF6B35] group-hover:text-[#FF6B35]">
              Add Project Image
            </span>
          </label>
        </div>

        {images.length === 0 && (
          <p className="text-center text-gray-400 mt-8">No images added yet.</p>
        )}
      </div>

      {/* Preview Modal (Popup) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-5 right-5 text-white p-2 hover:bg-white/10 rounded-full">
            <X size={40} />
          </button>
          
          <img 
            src={selectedImage} 
            alt="Preview Large" 
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain animate-in zoom-in duration-200"
          />
        </div>
      )}
    </section>
  );
}