import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useActor } from './hooks/useActor';
import LoginButton from './components/auth/LoginButton';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import Dashboard from './components/payments/Dashboard';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (isInitializing || actorFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/paymark-logo.dim_512x512.png" 
              alt="PayMark Logo" 
              className="h-10 w-10"
            />
            <h1 className="text-2xl font-bold text-foreground">PayMark</h1>
          </div>
          <LoginButton />
        </div>
      </header>

      <main className="flex-1">
        {!isAuthenticated ? (
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                    Send Money <span className="text-primary">Instantly</span>
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    A simple, secure way to send payments to anyone. Built on the Internet Computer for fast, reliable transactions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <LoginButton />
                    <div className="text-sm text-muted-foreground self-center">
                      Secure authentication with Internet Identity
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src="/assets/generated/payments-hero.dim_1600x900.png" 
                    alt="Payments illustration" 
                    className="w-full h-auto rounded-lg shadow-soft"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ProfileSetupModal />
            <Dashboard />
          </>
        )}
      </main>

      <footer className="border-t border-border bg-card/30 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} PayMark. Built with ❤️ using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

