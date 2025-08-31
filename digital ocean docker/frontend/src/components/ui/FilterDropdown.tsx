'use client';

import { Filter, Square, CheckSquare } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent, Portal } from '@radix-ui/react-popover';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  title: string;
  placeholder?: string;
}

export function FilterDropdown({ 
  options, 
  selectedValues, 
  onSelectionChange, 
  title, 
  placeholder 
}: FilterDropdownProps) {
  const { language, isRTL } = useLanguage();

  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className={`p-1 rounded transition-all ${
            selectedValues.length > 0 
              ? 'text-primary hover:bg-primary/10' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
          title={selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
        >
          <Filter className="w-3 h-3" />
        </button>
      </PopoverTrigger>

      <Portal>
        <PopoverContent
          side="bottom"
          align={isRTL ? "end" : "start"}
          collisionPadding={8}
          className="z-[1000] w-[260px] max-h-[60dvh] overflow-auto rounded-xl border bg-popover p-3 shadow-lg"
          dir={isRTL ? "rtl" : "ltr"}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">{title}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onSelectionChange([]); }}
                className="p-1 hover:bg-muted/50 rounded transition-colors"
                title={language === 'fa' ? 'پاک کردن' : 'Clear'}
              >
                <Square className="w-3 h-3 text-primary" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onSelectionChange(options.map(opt => opt.value)); }}
                className="p-1 hover:bg-muted/50 rounded transition-colors"
                title={language === 'fa' ? 'انتخاب همه' : 'Select All'}
              >
                <CheckSquare className="w-3 h-3 text-primary" />
              </button>
            </div>
          </div>
          {options.map(option => (
            <label key={option.value} className="flex items-center gap-2 p-1 hover:bg-muted/50 rounded cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={(e) => {
                  e.stopPropagation();
                  if (e.target.checked) {
                    onSelectionChange([...selectedValues, option.value]);
                  } else {
                    onSelectionChange(selectedValues.filter(v => v !== option.value));
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-3 h-3 text-primary border-border rounded focus:ring-primary"
              />
              <span className={`text-xs ${option.color || 'text-foreground'}`}>{option.label}</span>
            </label>
          ))}
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
