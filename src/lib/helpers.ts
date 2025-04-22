export function generateGroupNumber(): string {
    const timestamp = Date.now().toString().slice(-5);
    const random = Math.floor(100 + Math.random() * 900); // 3-digit random
    return `GRP-${timestamp}-${random}`;
  }
  