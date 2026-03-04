import { Principal } from '@dfinity/principal';

export function validatePrincipal(principalText: string): { valid: boolean; error?: string; principal?: Principal } {
  if (!principalText || principalText.trim() === '') {
    return { valid: false, error: 'Principal is required' };
  }

  try {
    const principal = Principal.fromText(principalText.trim());
    return { valid: true, principal };
  } catch (error) {
    return { valid: false, error: 'Invalid principal format' };
  }
}

export function validateAmount(amountText: string): { valid: boolean; error?: string; amount?: bigint } {
  if (!amountText || amountText.trim() === '') {
    return { valid: false, error: 'Amount is required' };
  }

  const trimmed = amountText.trim();
  
  // Check if it's a valid number
  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, error: 'Amount must be a positive whole number' };
  }

  try {
    const amount = BigInt(trimmed);
    
    if (amount <= 0n) {
      return { valid: false, error: 'Amount must be greater than zero' };
    }

    return { valid: true, amount };
  } catch (error) {
    return { valid: false, error: 'Invalid amount' };
  }
}

export function formatAmount(amount: bigint): string {
  return amount.toString();
}

export function formatPrincipal(principal: Principal, maxLength: number = 20): string {
  const text = principal.toString();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, 10)}...${text.slice(-6)}`;
}

