import type { BillItem } from '@/components/BillItemsList';

export interface BillHistoryEntry {
  id: string;
  timestamp: number;
  fileName: string;
  items: BillItem[];
  currency: string;
  vatPercentage: number;
  serviceChargePercentage: number;
  originalImageUrl?: string;
  totalAmount: number;
}

const STORAGE_KEY = 'bill-history';
const MAX_HISTORY_ENTRIES = 50; // Limit storage to prevent excessive data

export class BillStorage {
  static saveBill(
    fileName: string,
    items: BillItem[],
    currency: string,
    vatPercentage: number,
    serviceChargePercentage: number,
    imageFile?: File
  ): string {
    const id = `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate total amount
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal || item.quantity * item.unitPrice), 0);
    const vatAmount = subtotal * (vatPercentage / 100);
    const serviceAmount = (subtotal + vatAmount) * (serviceChargePercentage / 100);
    const totalAmount = subtotal + vatAmount + serviceAmount;

    const entry: BillHistoryEntry = {
      id,
      timestamp: Date.now(),
      fileName,
      items: items.map(item => ({
        ...item,
        subtotal: item.subtotal || item.quantity * item.unitPrice
      })),
      currency,
      vatPercentage,
      serviceChargePercentage,
      totalAmount: Math.round(totalAmount * 100) / 100
    };

    // Store image as base64 if provided (for small images only)
    if (imageFile && imageFile.size < 500000) { // 500KB limit
      const reader = new FileReader();
      reader.onload = (e) => {
        entry.originalImageUrl = e.target?.result as string;
        this.saveToStorage(entry);
      };
      reader.readAsDataURL(imageFile);
    } else {
      this.saveToStorage(entry);
    }

    return id;
  }

  private static saveToStorage(entry: BillHistoryEntry): void {
    try {
      const existing = this.getHistory();
      const updated = [entry, ...existing].slice(0, MAX_HISTORY_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save bill to storage:', error);
      // Clear storage if it's full and try again
      this.clearHistory();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([entry]));
      } catch (retryError) {
        console.error('Failed to save even after clearing storage:', retryError);
      }
    }
  }

  static getHistory(): BillHistoryEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to load bill history:', error);
      return [];
    }
  }

  static getBill(id: string): BillHistoryEntry | null {
    const history = this.getHistory();
    return history.find(entry => entry.id === id) || null;
  }

  static deleteBill(id: string): boolean {
    try {
      const history = this.getHistory();
      const filtered = history.filter(entry => entry.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete bill:', error);
      return false;
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  static getStorageStats(): { count: number; sizeKB: number } {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const count = this.getHistory().length;
      const sizeKB = stored ? Math.round(stored.length / 1024 * 100) / 100 : 0;
      return { count, sizeKB };
    } catch {
      return { count: 0, sizeKB: 0 };
    }
  }
}