# Specification

## Summary
**Goal:** Build a simple in-app payments app where authenticated users can view a balance, send funds to other users by principal, and review a transaction ledger.

**Planned changes:**
- Add Internet Identity login/logout and session-aware UI that shows the current user and blocks payment actions when signed out.
- Implement backend stable data models for accounts, balances, and an immutable transaction ledger (sender, recipient, amount, timestamp, memo, unique id).
- Expose backend APIs to get caller balance, transfer to a recipient principal, list caller transactions (sent/received) with capped/paginated results, and a controlled one-time initial balance grant for new users (demo).
- Build frontend dashboard showing current balance and transaction history with clear loading/empty/error states and sent vs received distinction.
- Build a “Send payment” form with recipient/amount/memo inputs, client-side validation, and clear success/error feedback; refresh balance/history after successful send.
- Apply a consistent finance-themed visual design system (colors/typography/spacing/components) with a non-blue/non-purple primary color.
- Add and use generated static assets (logo + hero/background illustration) from `frontend/public/assets/generated` in the header and signed-out landing state.

**User-visible outcome:** Users can sign in with Internet Identity, receive a one-time demo starting balance, send payments to another principal with confirmation/errors, and see an updated balance and transaction history; signed-out users see a landing screen with branding and cannot send payments.
