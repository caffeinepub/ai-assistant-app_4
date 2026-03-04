import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Transaction {
    id: bigint;
    memo: string;
    recipient: Principal;
    sender: Principal;
    timestamp: bigint;
    amount: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getBalance(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listTransactions(): Promise<Array<Transaction>>;
    mintForDemo(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transferFunds(recipient: Principal, amount: bigint, memo: string): Promise<void>;
}
