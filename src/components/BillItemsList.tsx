import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Check, Utensils, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export interface BillItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  // Optional bilingual labels returned by the LLM
  itemLabel?: {
    en?: string;
    ar?: string;
  };
}

interface BillItemsListProps {
  items: BillItem[];
  selectedItems: boolean[];
  currency: string;
  onToggleItem: (index: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
}

export function BillItemsList({ items, selectedItems, currency, onToggleItem, onQuantityChange }: BillItemsListProps) {
  const { t, language } = useTranslation();

  // Function to get the appropriate item name based on available labels and current language
  const getItemDisplayName = (item: BillItem) => {
    // If AI provided bilingual labels, use the appropriate one for current language
    if (item.itemLabel) {
      if (language === 'ar' && item.itemLabel.ar) {
        return item.itemLabel.ar;
      }
      if (language === 'en' && item.itemLabel.en) {
        return item.itemLabel.en;
      }
      // Fallback to available label if current language not available
      if (item.itemLabel.en) return item.itemLabel.en;
      if (item.itemLabel.ar) return item.itemLabel.ar;
    }

    // Fallback to original scanned name
    return item.name;
  };
  if (items.length === 0) {
    return null;
  }

  // Currency formatter based on detected currency
  const formatCurrency = (amount: number) => {
    // Map common currencies to their locale codes
    const currencyLocaleMap: Record<string, string> = {
      'EGP': 'ar-EG',
      'USD': 'en-US',
      'EUR': 'en-EU',
      'GBP': 'en-GB',
      'SAR': 'ar-SA',
      'AED': 'ar-AE',
      'QAR': 'ar-QA',
    };

    const locale = currencyLocaleMap[currency] || 'en-US';

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch {
      // Fallback if currency is not supported
      return `${amount.toFixed(2)} ${currency}`;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          {t.items}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className={`p-3 sm:p-4 rounded-lg border transition-colors ${selectedItems[index]
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
                }`}
            >
              {/* Mobile Layout: Two-line design */}
              <div className="block sm:hidden">
                {/* First line: Checkbox + Item name */}
                <div className="flex items-center space-x-3 mb-3">
                  <Checkbox
                    id={`item-${index}`}
                    checked={selectedItems[index]}
                    onCheckedChange={() => onToggleItem(index)}
                    className="large-checkbox data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <label htmlFor={`item-${index}`} className="font-medium text-gray-900 flex-1">
                    {getItemDisplayName(item)}
                  </label>
                  {selectedItems[index] && (
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      <span className="hidden xs:inline">{t.selectedItems}</span>
                    </div>
                  )}
                </div>

                {/* Second line: Controls + Price + Subtotal */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Unit Price */}
                    <div className="text-sm text-gray-500 number-display">
                      {formatCurrency(item.unitPrice)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => onQuantityChange(index, Math.max(0, item.quantity - 1))}
                        disabled={item.quantity <= 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            onQuantityChange(index, value);
                          }
                        }}
                        className="w-12 h-7 text-center text-sm"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => onQuantityChange(index, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="font-semibold text-gray-900 text-right">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </div>
                </div>
              </div>

              {/* Desktop Layout: visible on sm and up */}
              <div className="hidden sm:flex items-start gap-4">
                {/* Checkbox */}
                <Checkbox
                  id={`item-${index}-desktop`}
                  checked={selectedItems[index]}
                  onCheckedChange={() => onToggleItem(index)}
                  className="large-checkbox data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 mt-1"
                />

                {/* Item details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <label htmlFor={`item-${index}-desktop`} className="font-medium text-gray-900 cursor-pointer">
                        {getItemDisplayName(item)}
                      </label>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatCurrency(item.unitPrice)} each
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onQuantityChange(index, Math.max(0, item.quantity - 1))}
                          disabled={item.quantity <= 0}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value) && value >= 0) {
                              onQuantityChange(index, value);
                            }
                          }}
                          className="w-16 h-8 text-center text-sm"
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onQuantityChange(index, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price Display */}
                      <div className="text-right min-w-0">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </div>
                        {selectedItems[index] && (
                          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <Check className="h-3 w-3" />
                            {t.selectedItems}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              {t.itemsCount
                .replace('{selected}', selectedItems.filter(Boolean).length.toString())
                .replace('{total}', items.length.toString())}
            </span>
            <span>
              {t.subtotal}: {formatCurrency(
                items
                  .filter((_, index) => selectedItems[index])
                  .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}