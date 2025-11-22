export interface Translation {
  // App Info
  appName: string;
  appDescription: string;
  
  // Language
  language: string;
  switchLanguage: string;
  
  // Main UI
  uploadReceipt: string;
  snapYourReceipt: string;
  tapToPhoto: string;
  gallery: string;
  camera: string;
  processing: string;
  aiReading: string;
  optimizing: string;
  pleaseWait: string;
  
  // Success Messages
  successFound: string;
  successExtracted: string;
  
  // Actions
  tryAgain: string;
  startOver: string;
  newBill: string;
  processAnother: string;
  history: string;
  cancel: string;
  
  // File Info
  fileSize: string;
  originalSize: string;
  compressed: string;
  supports: string;
  
  // General Errors
  noItemsFound: string;
  failedToExtract: string;
  
  // Errors
  errors: {
    network: {
      title: string;
      description: string;
      suggestions: string[];
    };
    file: {
      title: string;
      description: string;
      suggestions: string[];
    };
    processing: {
      title: string;
      description: string;
      suggestions: string[];
    };
    validation: {
      title: string;
      description: string;
      suggestions: string[];
    };
    rateLimit: {
      title: string;
      description: string;
      suggestions: string[];
    };
    general: {
      title: string;
      description: string;
      suggestions: string[];
    };
  };
  
  // History
  noBills: string;
  uploadFirst: string;
  billHistory: string;
  clearHistory: string;
  loadBill: string;
  date: string;
  total: string;
  items: string;
  currency: string;
  
  // Bill Items
  quantity: string;
  price: string;
  subtotal: string;
  
  // Progress Messages
  progress: {
    serverSleeping: string;
    takingLonger: string;
    almostDone: string;
    processing: string;
    extracting: string;
    analyzing: string;
    finishing: string;
  };
  
  // Calculator
  selectedItems: string;
  vat: string;
  service: string;
  grandTotal: string;
  
  // Bill Summary
  billSummary: string;
  selectedItemsSubtotal: string;
  itemsSelected: string;
  selectItemsMessage: string;
  
  // Item count and selection text
  itemsCount: string; // "{selected} of {total} items selected"
  
  // Common bill item mappings for LLM responses
  itemMappings: {
    // English to localized mapping
    coffee: string;
    tea: string;
    water: string;
    juice: string;
    soda: string;
    burger: string;
    pizza: string;
    salad: string;
    sandwich: string;
    soup: string;
    rice: string;
    bread: string;
    chicken: string;
    beef: string;
    fish: string;
    vegetables: string;
    fruit: string;
    dessert: string;
    cake: string;
    iceCream: string;
    fries: string;
    pasta: string;
    noodles: string;
    steak: string;
    shrimp: string;
    lamb: string;
    cheese: string;
    eggs: string;
    milk: string;
    yogurt: string;
  };
  
  // Upload session restrictions
  sessionComplete: string;
  oneFilePerSession: string;
  startNewSession: string;
  
  // Footer
  builtWithLove: string;
  by: string;
  
  // Technical details
  showTechnicalDetails: string;
  
  // Common
  loading: string;
  done: string;
  close: string;
  save: string;
  delete: string;
  edit: string;
  back: string;
  next: string;
  
  // Units
  mb: string;
  kb: string;
  seconds: string;
  minutes: string;
}

// English translations (friendly tone)
export const en: Translation = {
  appName: "Sharkny",
  appDescription: "✨ AI-powered receipt magic at your fingertips",
  
  language: "Language",
  switchLanguage: "Switch to Arabic",
  
  uploadReceipt: "Upload Receipt",
  snapYourReceipt: "📸 Snap Your Receipt",
  tapToPhoto: "Tap to take a photo or upload from gallery",
  gallery: "Gallery",
  camera: "Camera", 
  processing: "Processing...",
  aiReading: "🤖 AI is reading your receipt...",
  optimizing: "📸 Optimizing image...",
  pleaseWait: "This usually takes 5-15 seconds",
  
  successFound: "🎉 Found {count} items on your receipt!",
  successExtracted: "✅ Successfully extracted {count} items!",
  
  tryAgain: "Try Again",
  startOver: "Start Over", 
  newBill: "New Bill",
  processAnother: "Process Another Bill",
  history: "History",
  cancel: "Cancel",
  
  fileSize: "File size",
  originalSize: "Original",
  compressed: "Compressed to",
  supports: "Supports JPG, PNG, WebP up to 10MB",
  
  noItemsFound: "No items found in the bill. Please try a clearer image.",
  failedToExtract: "Failed to extract bill",
  
  errors: {
    network: {
      title: "🌐 Connection Problem",
      description: "Oops! We're having trouble connecting to our servers.",
      suggestions: [
        "Check your internet connection",
        "Try again in a few moments", 
        "Switch to mobile data if using WiFi"
      ]
    },
    file: {
      title: "📸 File Issue",
      description: "There was a problem with your image file.",
      suggestions: [
        "Try a different photo",
        "Make sure it's an image (JPG, PNG, WebP)",
        "Check if the image is clear and readable"
      ]
    },
    processing: {
      title: "🤖 Processing Error", 
      description: "Our AI had trouble reading your receipt.",
      suggestions: [
        "Make sure the receipt is clearly visible",
        "Try better lighting or different angle",
        "Check if all text is readable"
      ]
    },
    validation: {
      title: "📄 Not a Receipt",
      description: "This doesn't look like a bill or receipt.",
      suggestions: [
        "Upload a clear photo of a receipt",
        "Make sure it shows items and prices",
        "Include store name and transaction details"
      ]
    },
    rateLimit: {
      title: "⏰ Daily Limit Reached",
      description: "You've used up your daily processing quota.",
      suggestions: [
        "Come back tomorrow for more processing",
        "Each user gets 5 free uploads per day", 
        "Try again after 24 hours"
      ]
    },
    general: {
      title: "😅 Something Went Wrong",
      description: "We encountered an unexpected issue.",
      suggestions: [
        "Please try again",
        "If the problem continues, try refreshing",
        "Contact support if you keep seeing this"
      ]
    }
  },
  
  noBills: "No bills processed yet",
  uploadFirst: "Upload your first receipt to start building your history",
  billHistory: "Bill History",
  clearHistory: "Clear All History",
  loadBill: "Load This Bill",
  date: "Date",
  total: "Total",
  items: "items",
  currency: "Currency",
  
  quantity: "Qty",
  price: "Price", 
  subtotal: "Subtotal",
  
  selectedItems: "Selected Items",
  vat: "VAT",
  service: "Service",
  grandTotal: "Grand Total",
  
  loading: "Loading...",
  done: "Done",
  close: "Close",
  save: "Save", 
  delete: "Delete",
  edit: "Edit",
  back: "Back",
  next: "Next",
  
  mb: "MB",
  kb: "KB", 
  seconds: "seconds",
  minutes: "minutes",
  
  // Progress Messages
  progress: {
    serverSleeping: "🌙 The server seems to be napping...",
    takingLonger: "⏳ This is taking a bit longer than usual...",
    almostDone: "🎯 Almost there! Just a few more moments...",
    processing: "🤖 Processing your receipt...",
    extracting: "📊 Extracting bill information...",
    analyzing: "🔍 Analyzing the items...",
    finishing: "✨ Putting the finishing touches..."
  },
  
  // Upload session restrictions
  sessionComplete: "Session Complete",
  oneFilePerSession: "One bill per session for best accuracy",
  startNewSession: "Start New Session",
  
  // Footer
  builtWithLove: "Built with ❤️ by",
  by: "by",
  
  // Technical details
  showTechnicalDetails: "Show technical details",
  
  // Bill Summary
  billSummary: "Bill Summary",
  selectedItemsSubtotal: "Selected Items Subtotal",
  itemsSelected: "Items Selected",
  selectItemsMessage: "Select items above to see split calculation",
  
  // Item count and selection text
  itemsCount: "{selected} of {total} items selected",
  
  // Common bill item mappings for LLM responses
  itemMappings: {
    coffee: "Coffee",
    tea: "Tea",
    water: "Water",
    juice: "Juice",
    soda: "Soda",
    burger: "Burger",
    pizza: "Pizza",
    salad: "Salad",
    sandwich: "Sandwich",
    soup: "Soup",
    rice: "Rice",
    bread: "Bread",
    chicken: "Chicken",
    beef: "Beef",
    fish: "Fish",
    vegetables: "Vegetables",
    fruit: "Fruit",
    dessert: "Dessert",
    cake: "Cake",
    iceCream: "Ice Cream",
    fries: "Fries",
    pasta: "Pasta",
    noodles: "Noodles",
    steak: "Steak",
    shrimp: "Shrimp",
    lamb: "Lamb",
    cheese: "Cheese",
    eggs: "Eggs",
    milk: "Milk",
    yogurt: "Yogurt"
  }
};

// Arabic translations (Jordanian dialect) 
export const ar: Translation = {
  appName: "شاركني",
  appDescription: "✨ سحر الذكاء الاصطناعي لقراءة الفواتير بلمسة زر",
  
  language: "اللغة",
  switchLanguage: "التبديل للإنجليزية",
  
  uploadReceipt: "ارفع الفاتورة",
  snapYourReceipt: "📸 صور فاتورتك",
  tapToPhoto: "اضغط عشان تصور أو ارفع صورة من الاستوديو",
  gallery: "الاستوديو",
  camera: "الكاميرا",
  processing: "عم بشتغل...",
  aiReading: "🤖 الذكي عم بيقرأ فاتورتك...",
  optimizing: "📸 عم بحسن الصورة...",
  pleaseWait: "عادة بياخد من 5 لـ 15 ثانية",
  
  successFound: "🎉 لقيت {count} قطع بالفاتورة!",
  successExtracted: "✅ نجحت استخرج {count} قطع!",
  
  tryAgain: "حاول تاني",
  startOver: "ابدأ من جديد",
  newBill: "فاتورة جديدة", 
  processAnother: "اشتغل على فاتورة ثانية",
  history: "التاريخ",
  cancel: "إلغاء",
  
  fileSize: "📊 حجم الملف",
  originalSize: "الحجم الأصلي", 
  compressed: "مضغوط",
  supports: "يدعم JPG و PNG و WebP لحد 10 ميجا (يضغط تلقائياً)",
  
  noItemsFound: "ما لقيت أشياء بالفاتورة. جرب صورة أوضح.",
  failedToExtract: "فشل استخراج الفاتورة",
  
  errors: {
    network: {
      title: "🌐 مشكلة بالاتصال",
      description: "يخرب بيتها! في مشكلة بالاتصال مع السيرفرات.",
      suggestions: [
        "تأكد من الإنترنت تبعك",
        "حاول تاني بعد شوي",
        "جرب الموبايل داتا إذا بتستعمل واي فاي"
      ]
    },
    file: {
      title: "📸 مشكلة بالملف",
      description: "في مشكلة بملف الصورة تبعك.",
      suggestions: [
        "جرب صورة ثانية",
        "تأكد إنها صورة (JPG، PNG، WebP)",
        "شوف إذا الصورة واضحة ومقروءة"
      ]
    },
    processing: {
      title: "🤖 خطأ بالمعالجة",
      description: "الذكي الاصطناعي ما قدر يقرأ فاتورتك منيح.",
      suggestions: [
        "تأكد إن الفاتورة واضحة ومرئية",
        "جرب إضاءة أحسن أو زاوية مختلفة", 
        "تأكد إن كل النص مقروء"
      ]
    },
    validation: {
      title: "📄 مش فاتورة",
      description: "هاي ما بتشبه فاتورة أو ايصال.",
      suggestions: [
        "ارفع صورة واضحة لفاتورة",
        "تأكد إنها تطلع أغراض وأسعار",
        "حط اسم المحل وتفاصيل العملية"
      ]
    },
    rateLimit: {
      title: "⏰ وصلت للحد اليومي",
      description: "خلصت كوتا المعالجة اليومية تبعتك.",
      suggestions: [
        "تعال بكرا لمعالجة أكثر",
        "كل مستخدم بياخد 5 رفعات مجانية باليوم",
        "حاول تاني بعد 24 ساعة"
      ]
    },
    general: {
      title: "😅 صار شي غلط",
      description: "واجهنا مشكلة ما متوقعناها.",
      suggestions: [
        "جرب تاني لو سمحت",
        "إذا المشكلة ضلت، حاول تحديث الصفحة",
        "تواصل مع الدعم إذا ضلت تطلع"
      ]
    }
  },
  
  noBills: "ما في فواتير لسا",
  uploadFirst: "ارفع أول فاتورة تبعك عشان نبدأ نعمل تاريخ",
  billHistory: "تاريخ الفواتير",
  clearHistory: "امسح كل التاريخ",
  loadBill: "احمل هاي الفاتورة",
  date: "التاريخ",
  total: "المجموع",
  items: "قطع",
  currency: "العملة",
  
  quantity: "الكمية",
  price: "السعر",
  subtotal: "المجموع الفرعي",
  
  selectedItems: "الأغراض المختارة",
  vat: "الضريبة", 
  service: "الخدمة",
  grandTotal: "المجموع الكلي",
  
  loading: "عم بحمل...",
  done: "خلص",
  close: "سكر", 
  save: "احفظ",
  delete: "احذف",
  edit: "عدل",
  back: "ارجع",
  next: "التالي",
  
  mb: "ميجا",
  kb: "كيلو",
  seconds: "ثانية", 
  minutes: "دقيقة",
  
  // رسائل التقدم (بالعامية الأردنية)
  progress: {
    serverSleeping: "🌙 زي شكلو السيرفر نام...",
    takingLonger: "⏳ وراك اشي شكلها مطولة...",
    almostDone: "🎯 خلصنا تقريباً! شوي وبنخلص...",
    processing: "🤖 عم نعالج الفاتورة...",
    extracting: "📊 عم نسحب المعلومات...",
    analyzing: "🔍 عم نحلل الأصناف...",
    finishing: "✨ عم نخلص اللمسات الأخيرة..."
  },
  
  // قيود جلسة الرفع
  sessionComplete: "انتهت الجلسة",
  oneFilePerSession: "فاتورة واحدة بكل جلسة عشان أحسن دقة",
  startNewSession: "ابدا جلسة جديدة",
  
  // تذييل الصفحة
  builtWithLove: "صُنع بـ ❤️ من",
  by: "من",
  
  // التفاصيل التقنية
  showTechnicalDetails: "إظهار التفاصيل التقنية",
  
  // ملخص الفاتورة
  billSummary: "ملخص الفاتورة",
  selectedItemsSubtotal: "مجموع الأصناف المختارة",
  itemsSelected: "أصناف مختارة",
  selectItemsMessage: "اختار أصناف من فوق عشان تشوف الحساب",
  
  // عدد الأصناف ونص الاختيار
  itemsCount: "{selected} من {total} صنف مختار",
  
  // خريطة أسماء الأصناف للاستجابات من الذكي الاصطناعي
  itemMappings: {
    coffee: "قهوة",
    tea: "شاي",
    water: "ماي",
    juice: "عصير",
    soda: "مشروب غازي",
    burger: "برغر",
    pizza: "بيتزا",
    salad: "سلطة",
    sandwich: "ساندوتش",
    soup: "شوربة",
    rice: "رز",
    bread: "خبز",
    chicken: "دجاج",
    beef: "لحمة",
    fish: "سمك",
    vegetables: "خضار",
    fruit: "فواكه",
    dessert: "حلا",
    cake: "كيكة",
    iceCream: "آيس كريم",
    fries: "بطاطا مقلية",
    pasta: "معكرونة",
    noodles: "نودلز",
    steak: "ستيك",
    shrimp: "جمبري",
    lamb: "لحم خروف",
    cheese: "جبنة",
    eggs: "بيض",
    milk: "حليب",
    yogurt: "لبن"
  }
};

export const translations = { ar, en };