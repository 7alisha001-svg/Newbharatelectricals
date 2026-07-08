import React, { useRef, useState } from 'react';
import { Upload, X, GripVertical, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../../lib/upload';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Max 5MB allowed.`);
          continue;
        }
        const url = await uploadImage(file);
        newImages.push(url);
      }
      onChange(newImages);
    } catch (err) {
      console.error("Upload error", err);
      alert("Failed to upload some images.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (idxToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== idxToRemove));
  };

  const makePrimary = (idxToPrimary: number) => {
    if (idxToPrimary === 0) return;
    const newImages = [...images];
    const [item] = newImages.splice(idxToPrimary, 1);
    newImages.unshift(item);
    onChange(newImages);
  };

  // Drag and drop to reorder
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    const newImages = [...images];
    const [item] = newImages.splice(draggedIdx, 1);
    newImages.splice(targetIdx, 0, item);
    onChange(newImages);
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-sm font-semibold text-gray-700">Click to upload images</p>
        <p className="text-xs text-gray-500 mt-1">Select multiple files (JPG, PNG, WEBP)</p>
        <input 
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        {uploading && <div className="mt-3 text-brand-green font-semibold text-sm animate-pulse">Uploading images...</div>}
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-700">Uploaded Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((imgUrl, idx) => (
              <div 
                key={`${imgUrl}-${idx}`} 
                className={`relative group bg-white border rounded-xl overflow-hidden flex flex-col cursor-grab ${idx === 0 ? 'border-brand-green ring-1 ring-brand-green' : 'border-gray-200'}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={() => setDraggedIdx(null)}
              >
                <div className="h-32 bg-gray-50 flex items-center justify-center p-2">
                  <img src={imgUrl} alt={`Product ${idx}`} className="max-h-full max-w-full object-contain" />
                </div>
                
                {idx === 0 && (
                  <div className="absolute top-2 left-2 bg-brand-green text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    PRIMARY
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                    className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md shadow-md"
                    title="Remove Image"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="p-2 border-t border-gray-100 bg-white flex justify-between items-center">
                  <GripVertical size={16} className="text-gray-400 cursor-grab" />
                  {idx !== 0 && (
                    <button 
                      type="button"
                      onClick={() => makePrimary(idx)}
                      className="text-[10px] font-semibold text-gray-500 hover:text-brand-green uppercase tracking-wider"
                    >
                      Make Primary
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
