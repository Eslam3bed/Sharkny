import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BillStorage, type BillHistoryEntry } from '@/lib/storage';
import { History, Receipt, Trash2, Clock, DollarSign, FileImage } from 'lucide-react';

interface BillHistoryProps {
  onLoadBill: (entry: BillHistoryEntry) => void;
}

export function BillHistory({ onLoadBill }: BillHistoryProps) {
  const [history, setHistory] = useState<BillHistoryEntry[]>(BillStorage.getHistory());
  const [selectedEntry, setSelectedEntry] = useState<BillHistoryEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const refreshHistory = () => {
    setHistory(BillStorage.getHistory());
  };

  const handleDeleteBill = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this bill from history?')) {
      BillStorage.deleteBill(id);
      refreshHistory();
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
    }
  };

  const handleLoadBill = (entry: BillHistoryEntry) => {
    onLoadBill(entry);
    setIsDialogOpen(false);
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  const stats = BillStorage.getStorageStats();

  if (history.length === 0) {
    return null; // Don't show floating button if no history
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="gap-3 shadow-xl touch-target rounded-full bg-primary hover:bg-primary/90 border-2 border-primary-foreground/20"
        >
          <History className="h-5 w-5" />
          {history.length}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Bill History
            <span className="text-sm font-normal text-gray-500">
              ({stats.count} bills, {stats.sizeKB}KB used)
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {/* History List */}
          <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
            {history.map((entry) => (
              <Card
                key={entry.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                onClick={() => setSelectedEntry(entry)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Receipt className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium truncate max-w-xs" title={entry.fileName}>
                            {entry.fileName}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(entry.timestamp)}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(entry.totalAmount, entry.currency)}
                            </span>
                            <span className="text-xs">
                              {entry.items.length} items
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteBill(entry.id, e)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Entry Details */}
          {selectedEntry && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Bill Details</h3>
                <Button onClick={() => handleLoadBill(selectedEntry)}>
                  Load This Bill
                </Button>
              </div>

              <div className="space-y-4">
                {/* Bill Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">File:</span> {selectedEntry.fileName}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {formatDate(selectedEntry.timestamp)}
                  </div>
                  <div>
                    <span className="font-medium">Currency:</span> {selectedEntry.currency}
                  </div>
                  <div>
                    <span className="font-medium">Total:</span> {formatCurrency(selectedEntry.totalAmount, selectedEntry.currency)}
                  </div>
                  {selectedEntry.vatPercentage > 0 && (
                    <div>
                      <span className="font-medium">VAT:</span> {selectedEntry.vatPercentage}%
                    </div>
                  )}
                  {selectedEntry.serviceChargePercentage > 0 && (
                    <div>
                      <span className="font-medium">Service:</span> {selectedEntry.serviceChargePercentage}%
                    </div>
                  )}
                </div>

                {/* Original Image */}
                {selectedEntry.originalImageUrl && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileImage className="h-4 w-4" />
                      Original Receipt
                    </h4>
                    <img
                      src={selectedEntry.originalImageUrl}
                      alt="Original receipt"
                      className="max-w-full max-h-48 object-contain border rounded"
                    />
                  </div>
                )}

                {/* Items List */}
                <div>
                  <h4 className="font-medium mb-2">Items ({selectedEntry.items.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedEntry.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                        <span>{item.name}</span>
                        <span>
                          {item.quantity} × {selectedEntry.currency} {item.unitPrice.toFixed(2)} = {selectedEntry.currency} {(item.subtotal || item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clear History */}
          {history.length > 0 && (
            <div className="mt-6 pt-4 border-t text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm('Clear all bill history? This cannot be undone.')) {
                    BillStorage.clearHistory();
                    refreshHistory();
                    setSelectedEntry(null);
                  }
                }}
                className="text-red-600 hover:text-red-700"
              >
                Clear All History
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}