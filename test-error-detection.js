// Quick test to verify error type detection
console.log('Testing error detection...');

function getErrorType(error: string) {
  const lowerError = error.toLowerCase();

  if (lowerError.includes('network') || lowerError.includes('fetch') || lowerError.includes('connection')) {
    return 'network';
  }
  if (lowerError.includes('file') || lowerError.includes('image') || lowerError.includes('upload')) {
    return 'file';
  }
  if (lowerError.includes('processing') || lowerError.includes('ai') || lowerError.includes('extract')) {
    return 'processing';
  }
  if (lowerError.includes('not_a_bill') || lowerError.includes('validation') ||
    lowerError.includes('does not appear to be a bill') ||
    lowerError.includes('not a receipt') ||
    lowerError.includes('bill or receipt')) {
    return 'validation';
  }
  if (lowerError.includes('rate') || lowerError.includes('limit') || lowerError.includes('quota')) {
    return 'rate-limit';
  }
  return 'general';
}

// Test cases
const testErrors = [
  "This image does not appear to be a bill or receipt. Please upload a valid receipt with transaction details.",
  "NOT_A_BILL",
  "Network error occurred",
  "File upload failed",
  "Processing error",
  "Rate limit exceeded"
];

testErrors.forEach(error => {
  console.log(`Error: "${error}" -> Type: ${getErrorType(error)}`);
});