import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { BillItemsList, type BillItem } from '@/components/BillItemsList';
import { SplitCalculator } from '@/components/SplitCalculator';
import { BillHistory } from '@/components/BillHistory';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Footer } from '@/components/Footer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { BillStorage, type BillHistoryEntry } from '@/lib/storage';
import { Receipt, RefreshCw } from 'lucide-react';
import { I18nProvider, useTranslation } from '@/hooks/useTranslation';

interface BillData {
  items: BillItem[];
  currency: string;
  vatPercentage: number;
  serviceChargePercentage: number;
  total: number;
}

function AppContent() {
  const { t, direction } = useTranslation();
  const [billData, setBillData] = useState<BillData | null>(null);
  const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      // Call our Netlify function
      const response = await fetch('/api/extract-bill', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific NOT_A_BILL error
        if (errorData.error === 'NOT_A_BILL') {
          throw new Error(errorData.message || 'This image does not appear to be a bill or receipt.');
        }

        throw new Error(errorData.message || errorData.error || t.failedToExtract);
      }

      const extractedData: BillData = await response.json();

      // Validate the response
      if (!Array.isArray(extractedData.items) || extractedData.items.length === 0) {
        throw new Error(t.noItemsFound);
      }

      // Save to history
      BillStorage.saveBill(
        file.name || `Receipt-${new Date().toISOString().split('T')[0]}`,
        extractedData.items,
        extractedData.currency || 'USD',
        extractedData.vatPercentage || 0,
        extractedData.serviceChargePercentage || 0,
        file
      );

      setBillData(extractedData);
      // Initialize all items as selected
      setSelectedItems(extractedData.items.map(() => true));

    } catch (err) {
      console.error('Error extracting bill:', err);
      setError(err instanceof Error ? err.message : t.failedToExtract);
      setBillData(null);
      setSelectedItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleItem = (index: number) => {
    setSelectedItems(prev => {
      const newSelected = [...prev];
      newSelected[index] = !newSelected[index];
      return newSelected;
    });
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setBillData(prev => {
      if (!prev) return prev;

      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        quantity: quantity,
        subtotal: Math.round(quantity * newItems[index].unitPrice * 100) / 100
      };

      return {
        ...prev,
        items: newItems
      };
    });
  };

  const handleVatChange = (percentage: number) => {
    setBillData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        vatPercentage: percentage
      };
    });
  };

  const handleServiceChange = (percentage: number) => {
    setBillData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        serviceChargePercentage: percentage
      };
    });
  };

  const handleReset = () => {
    setBillData(null);
    setSelectedItems([]);
    setError(null);
  };

  const handleLoadFromHistory = (entry: BillHistoryEntry) => {
    setBillData({
      items: entry.items,
      currency: entry.currency,
      vatPercentage: entry.vatPercentage,
      serviceChargePercentage: entry.serviceChargePercentage,
      total: entry.totalAmount
    });
    setSelectedItems(entry.items.map(() => true));
    setError(null);
  };

  return (
    <div dir={direction} className="min-h-screen art-deco-bg">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 fade-in">
          {/* Language Switcher */}
          <div className="flex justify-end mb-4 sm:mb-6">
            <LanguageSwitcher />
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 bounce-in">
            <div className="p-3 sm:p-4 bg-primary rounded-2xl shadow-lg">
              <Receipt className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight">
              {t.appName}
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed px-4 sm:px-0">
            {t.appDescription}
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Error Display */}
          {error && !billData && (
            <ErrorDisplay
              error={error}
              onRetry={() => {
                setError(null);
                // Trigger file input if there was an upload error
              }}
              onClear={() => {
                setError(null);
                setBillData(null);
                setSelectedItems([]);
              }}
              showUploadButton={true}
              onUpload={() => {
                setError(null);
                // Scroll to upload section or trigger file input
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                fileInput?.click();
              }}
            />
          )}

          {/* Single Upload Button - Mobile First */}
          {!billData && !error && (
            <div className="text-center space-y-4">
              <ImageUpload
                onImageUpload={handleImageUpload}
                isLoading={isLoading}
                error={null} // We handle errors separately now
              />
            </div>
          )}

          {/* Floating History Button */}
          <div className="fixed bottom-6 left-6 z-50">
            <BillHistory onLoadBill={handleLoadFromHistory} />
          </div>

          {/* Results Section */}
          {billData && (
            <div className="space-y-6 bounce-in">
              {/* Success Message */}
              <Alert className="border-accent bg-accent/20 shadow-md">
                <AlertDescription className="text-accent-foreground text-center py-2">
                  {t.successFound.replace('{count}', billData.items.length.toString())}
                </AlertDescription>
              </Alert>

              {/* Bill Items with Large Checkboxes */}
              <BillItemsList
                items={billData.items}
                selectedItems={selectedItems}
                currency={billData.currency}
                onToggleItem={handleToggleItem}
                onQuantityChange={handleQuantityChange}
              />

              {/* Split Calculator */}
              <SplitCalculator
                items={billData.items}
                selectedItems={selectedItems}
                currency={billData.currency}
                vatPercentage={billData.vatPercentage}
                serviceChargePercentage={billData.serviceChargePercentage}
                onVatChange={handleVatChange}
                onServiceChange={handleServiceChange}
              />

              {/* New Bill Button */}
              <div className="text-center pt-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="gap-3 touch-target shadow-md"
                >
                  <RefreshCw className="h-5 w-5" />
                  {t.processAnother}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
