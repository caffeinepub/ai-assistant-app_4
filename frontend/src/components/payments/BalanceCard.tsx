import { useGetBalance, useMintForDemo } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, Coins, Sparkles } from 'lucide-react';
import { formatAmount } from '../../utils/validation';
import { useState } from 'react';
import { Alert, AlertDescription } from '../ui/alert';

export default function BalanceCard() {
  const { data: balance, isLoading, error } = useGetBalance();
  const mintForDemo = useMintForDemo();
  const [showMintSuccess, setShowMintSuccess] = useState(false);

  const handleMint = async () => {
    try {
      await mintForDemo.mutateAsync();
      setShowMintSuccess(true);
      setTimeout(() => setShowMintSuccess(false), 5000);
    } catch (error: any) {
      console.error('Mint error:', error);
    }
  };

  const getMintErrorMessage = (error: any): string => {
    const message = error?.message || '';
    if (message.includes('Minting limit reached')) {
      return 'You have already claimed your demo tokens';
    }
    return 'Failed to mint tokens. Please try again.';
  };

  return (
    <Card className="border-primary/20 shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          Current Balance
        </CardTitle>
        <CardDescription>Your available funds</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading balance...
          </div>
        ) : error ? (
          <div className="text-destructive text-sm">Failed to load balance</div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl font-bold text-primary">
              {formatAmount(balance || 0n)} <span className="text-2xl text-muted-foreground">tokens</span>
            </div>
            
            {balance === 0n && (
              <div className="space-y-3">
                <Alert className="border-accent/50 bg-accent/10">
                  <Sparkles className="h-4 w-4 text-accent-foreground" />
                  <AlertDescription className="text-sm">
                    Get started with 1,000 demo tokens to try sending payments!
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={handleMint}
                  disabled={mintForDemo.isPending}
                  variant="outline"
                  className="w-full border-accent text-accent-foreground hover:bg-accent/20"
                >
                  {mintForDemo.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Claim Demo Tokens
                    </>
                  )}
                </Button>
                {mintForDemo.isError && (
                  <p className="text-sm text-destructive">{getMintErrorMessage(mintForDemo.error)}</p>
                )}
              </div>
            )}

            {showMintSuccess && (
              <Alert className="border-primary/50 bg-primary/10">
                <AlertDescription className="text-sm text-primary-foreground">
                  Successfully minted 1,000 tokens!
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

