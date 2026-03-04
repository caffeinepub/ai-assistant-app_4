import { useListTransactions } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2, History, ArrowUpRight, ArrowDownLeft, Sparkles } from 'lucide-react';
import { formatAmount, formatPrincipal } from '../../utils/validation';
import type { Transaction } from '../../backend';

export default function TransactionHistoryList() {
  const { data: transactions, isLoading, error } = useListTransactions();
  const { identity } = useInternetIdentity();

  const currentPrincipal = identity?.getPrincipal().toString();

  const getTransactionType = (transaction: Transaction): 'sent' | 'received' | 'mint' => {
    const senderStr = transaction.sender.toString();
    const recipientStr = transaction.recipient.toString();
    
    if (senderStr === recipientStr && transaction.memo === 'Demo mint') {
      return 'mint';
    }
    
    return senderStr === currentPrincipal ? 'sent' : 'received';
  };

  const formatTimestamp = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>Your recent activity</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive text-sm">
            Failed to load transactions
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No transactions yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {transactions.slice().reverse().map((transaction) => {
                const type = getTransactionType(transaction);
                const counterparty = type === 'sent' 
                  ? transaction.recipient 
                  : transaction.sender;

                return (
                  <div
                    key={transaction.id.toString()}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${
                      type === 'mint' 
                        ? 'bg-accent/20 text-accent-foreground' 
                        : type === 'sent' 
                        ? 'bg-destructive/20 text-destructive' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {type === 'mint' ? (
                        <Sparkles className="h-4 w-4" />
                      ) : type === 'sent' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">
                            {type === 'mint' 
                              ? 'Demo Tokens' 
                              : type === 'sent' 
                              ? 'Sent' 
                              : 'Received'}
                          </p>
                          {type !== 'mint' && (
                            <p className="text-xs text-muted-foreground truncate">
                              {type === 'sent' ? 'To: ' : 'From: '}
                              {formatPrincipal(counterparty, 16)}
                            </p>
                          )}
                        </div>
                        <p className={`font-semibold text-sm whitespace-nowrap ${
                          type === 'mint' 
                            ? 'text-accent-foreground' 
                            : type === 'sent' 
                            ? 'text-destructive' 
                            : 'text-primary'
                        }`}>
                          {type === 'sent' ? '-' : '+'}
                          {formatAmount(transaction.amount)}
                        </p>
                      </div>
                      {transaction.memo && transaction.memo !== 'Demo mint' && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          "{transaction.memo}"
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(transaction.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

