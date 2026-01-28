import React from 'react';
import { X } from 'lucide-react';
import { ImageAsset } from '../types';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: ImageAsset | null;
  title: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, image, title }) => {
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-200">{title}</h3>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>
        <div className="p-8 flex items-center justify-center bg-black/50">
            <img 
                src={image.url} 
                alt={image.alt} 
                className="max-h-[70vh] rounded-lg shadow-lg" 
            />
        </div>
        <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                Confidential Project Artifact
            </p>
        </div>
      </div>
    </div>
  );
};