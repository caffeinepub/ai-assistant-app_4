import { useState } from 'react';
import { useTransferFunds, useGetBalance } from '../../hooks/useQueries';
import { validatePrincipal, validateAmount } from '../../utils/validation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

export default function SendPaymentForm() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ recipient?: string; amount?: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{ recipient: string; amount: string } | null>(null);

  const transferFunds = useTransferFunds();
  const { data: balance } = useGetBalance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setShowSuccess(false);

    const principalValidation = validatePrincipal(recipient);
    const amountValidation = validateAmount(amount);

    const errors: { recipient?: string; amount?: string } = {};
    if (!principalValidation.valid) {
      errors.recipient = principalValidation.error;
    }
    if (!amountValidation.valid) {
      errors.amount = amountValidation.error;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (balance !== undefined && amountValidation.amount! > balance) {
      setValidationErrors({ amount: 'Insufficient balance' });
      return;
    }

    try {
      await transferFunds.mutateAsync({
        recipient: principalValidation.principal!,
        amount: amountValidation.amount!,
        memo: memo.trim(),
      });

      setSuccessDetails({
        recipient: recipient.trim(),
        amount: amount,
      });
      setShowSuccess(true);
      setRecipient('');
      setAmount('');
      setMemo('');
      
      setTimeout(() => setShowSuccess(false), 8000);
    } catch (error: any) {
      console.error('Transfer error:', error);
    }
  };

  const getErrorMessage = (error: any): string => {
    const message = error?.message || '';
    if (message.includes('Insufficient balance')) {
      return 'Insufficient balance for this transfer';
    }
    if (message.includes('Unauthorized')) {
      return 'You must be logged in to send payments';
    }
    return 'Transfer failed. Please try again.';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Send Payment
        </CardTitle>
        <CardDescription>Transfer tokens to another user</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Principal</Label>
            <Input
              id="recipient"
              placeholder="Enter recipient's principal ID"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={transferFunds.isPending}
              className={validationErrors.recipient ? 'border-destructive' : ''}
            />
            {validationErrors.recipient && (
              <p className="text-sm text-destructive">{validationErrors.recipient}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="text"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={transferFunds.isPending}
              className={validationErrors.amount ? 'border-destructive' : ''}
            />
            {validationErrors.amount && (
              <p className="text-sm text-destructive">{validationErrors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">Memo (optional)</Label>
            <Textarea
              id="memo"
              placeholder="Add a note for this payment"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={transferFunds.isPending}
              rows={3}
            />
          </div>

          {transferFunds.isError && (
            <Alert variant="destructive">
              <AlertDescription>{getErrorMessage(transferFunds.error)}</AlertDescription>
            </Alert>
          )}

          {showSuccess && successDetails && (
            <Alert className="border-primary/50 bg-primary/10">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                Successfully sent {successDetails.amount} tokens to {successDetails.recipient.slice(0, 15)}...
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={transferFunds.isPending} className="w-full">
            {transferFunds.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Payment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

