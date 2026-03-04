import { useGetCallerUserProfile } from '../../hooks/useQueries';
import BalanceCard from './BalanceCard';
import SendPaymentForm from './SendPaymentForm';
import TransactionHistoryList from './TransactionHistoryList';
import { Wallet } from 'lucide-react';

export default function Dashboard() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Wallet className="h-8 w-8 text-primary" />
            {userProfile ? `Welcome, ${userProfile.name}` : 'Your Wallet'}
          </h2>
          <p className="text-muted-foreground">
            Manage your balance and send payments securely
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BalanceCard />
            <SendPaymentForm />
          </div>
          <div className="lg:col-span-1">
            <TransactionHistoryList />
          </div>
        </div>
      </div>
    </div>
  );
}

