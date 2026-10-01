import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Check } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  cartCount: number;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onSelect,
  cartCount
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      className="group bg-neutral-800/90 rounded-2xl border border-neutral-700/80 overflow-hidden cursor-pointer hover:border-amber-500/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-400 p-4 text-center">
            <span className="text-3xl mb-1">🥤</span>
            <span className="text-sm font-medium text-neutral-200">{item.name}</span>
          </div>
        )}

        {/* Tag badge */}
        <div className="absolute top-3 left-3 bg-neutral-900/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-400 border border-neutral-700/60 shadow-sm">
          {item.tag}
        </div>

        {/* In-cart indicator */}
        {cartCount > 0 && (
          <div className="absolute top-3 right-3 bg-amber-500 text-neutral-950 font-bold text-xs px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{cartCount}잔 담김</span>
          </div>
        )}

        {/* Price sticker on image corner */}
        <div className="absolute bottom-3 right-3 bg-neutral-950/85 backdrop-blur-md px-3 py-1 rounded-lg border border-neutral-700/70 text-right shadow-md">
          <span className="text-amber-400 font-bold text-base tabular-nums">
            {item.price.toLocaleString()}
          </span>
          <span className="text-xs text-neutral-300 ml-0.5">원</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
              {item.name}
            </h3>
            <span className="text-xs text-neutral-400 shrink-0 font-medium">
              단일가
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 mb-4">
            {item.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-neutral-700/60 flex items-center justify-between">
          <span className="text-xs text-amber-400 font-medium">
            터치하여 옵션 선택
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-neutral-950 flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
