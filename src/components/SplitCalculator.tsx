import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calculator } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { BillItem } from './BillItemsList';

interface SplitCalculatorProps {
  items: BillItem[];
  selectedItems: boolean[];
  currency: string;
  vatPercentage: number;
  serviceChargePercentage: number;
  onVatChange: (percentage: number) => void;
  onServiceChange: (percentage: number) => void;
}

export function SplitCalculator({
  items,
  selectedItems,
  currency,
  vatPercentage,
  serviceChargePercentage,
  onVatChange,
  onServiceChange,
}: SplitCalculatorProps) {
  const { t } = useTranslation();

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

  const roundToNearest = (num: number, decimals = 2): number => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  };

  // Calculate selected items subtotal using real-time quantities
  const subtotal = items
    .filter((_, index) => selectedItems[index])
    .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  // Calculate VAT and service charges
  const vatAmount = roundToNearest(subtotal * (vatPercentage / 100));
  const serviceAmount = roundToNearest(subtotal * (serviceChargePercentage / 100));
  const total = roundToNearest(subtotal + vatAmount + serviceAmount);

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {t.billSummary}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t.selectedItemsSubtotal}:</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          {/* VAT Controls - Show when vatPercentage > 0 or user wants to add VAT */}
          {vatPercentage > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{t.vat}:</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={vatPercentage}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        onVatChange(value);
                      }
                    }}
                    className="w-16 h-8 text-center text-sm"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <span className="font-medium">{formatCurrency(vatAmount)}</span>
            </div>
          )}

          {/* Service Charge Controls - Show when serviceChargePercentage > 0 or user wants to add service */}
          {serviceChargePercentage > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{t.service}:</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={serviceChargePercentage}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        onServiceChange(value);
                      }
                    }}
                    className="w-16 h-8 text-center text-sm"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <span className="font-medium">{formatCurrency(serviceAmount)}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 pt-3 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-900">{t.grandTotal}:</span>
            <span className="text-xl sm:text-lg font-bold text-blue-600">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-sm text-gray-600">{t.itemsSelected}</div>
          <div className="text-lg font-semibold text-gray-900" dir='ltr'>
            {`${selectedItems.filter(Boolean).length} of ${items.length}`}
          </div>
        </div>

        {subtotal === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            {t.selectItemsMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}