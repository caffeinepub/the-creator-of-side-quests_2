import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Testimonial {
    id: string;
    content: string;
    createdAt: Time;
    author: string;
    rating: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface Policies {
    serviceArea: string;
    returnPolicy: string;
    shippingPolicy: string;
}
export interface GiveawayEntrant {
    principal: Principal;
    displayName: string;
    enteredAt: Time;
}
export interface SocialMediaLink {
    url: string;
    platform: string;
}
export interface FulfillmentOptions {
    dropoff: boolean;
    pickup: boolean;
    shippingEnabled: boolean;
    delivery: boolean;
}
export interface ContactRequest {
    id: string;
    status: string;
    projectType?: string;
    name: string;
    submittedAt: Time;
    submittedBy: Principal;
    description: string;
    productId?: string;
    email: string;
    budget?: string;
    timeline?: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type LoyaltyAction = {
    __kind__: "visit";
    visit: null;
} | {
    __kind__: "share";
    share: null;
} | {
    __kind__: "signup";
    signup: null;
} | {
    __kind__: "purchase";
    purchase: bigint;
};
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Coupon {
    active: boolean;
    validFrom: Time;
    code: string;
    discountType: CouponType;
    usageCount: bigint;
    usageLimit?: bigint;
    validUntil: Time;
}
export interface GiveawayWinner {
    giveawayId: string;
    entrant: GiveawayEntrant;
    wonAt: Time;
}
export interface Giveaway {
    id: string;
    active: boolean;
    name: string;
    description: string;
    entrants: Array<GiveawayEntrant>;
    winners: Array<GiveawayWinner>;
}
export type CouponType = {
    __kind__: "fixed";
    fixed: bigint;
} | {
    __kind__: "percentage";
    percentage: bigint;
};
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    category?: string;
    image: ExternalBlob;
}
export interface LoyaltyReward {
    id: string;
    active: boolean;
    pointsRequired: bigint;
    rewardValue: string;
    name: string;
    rewardType: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    loyaltyPoints: bigint;
}
export interface Product {
    id: string;
    requiresQuote: boolean;
    inStock: boolean;
    name: string;
    description: string;
    category?: string;
    image: ExternalBlob;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGiveawayEntrant(giveawayId: string, displayName: string): Promise<void>;
    addGiveawayEntrantByAdmin(giveawayId: string, userPrincipal: Principal, displayName: string): Promise<void>;
    addLoyaltyPoints(action: LoyaltyAction): Promise<bigint>;
    addPortfolioItem(item: PortfolioItem): Promise<void>;
    addProduct(product: Product): Promise<void>;
    addSocialMediaLink(platform: string, url: string): Promise<void>;
    addTestimonial(testimonial: Testimonial): Promise<void>;
    applyCoupon(code: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createCoupon(coupon: Coupon): Promise<void>;
    createGiveaway(giveaway: Giveaway): Promise<void>;
    createLoyaltyReward(reward: LoyaltyReward): Promise<void>;
    getActiveGiveaways(): Promise<Array<Giveaway>>;
    getAdminVerificationStatus(): Promise<{
        failed_attempts: bigint;
        remaining_attempts?: bigint;
        permanently_locked: boolean;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactRequests(): Promise<Array<ContactRequest>>;
    getCoupons(): Promise<Array<Coupon>>;
    getFulfillmentOptions(): Promise<FulfillmentOptions>;
    getGiveaway(id: string): Promise<Giveaway | null>;
    getLoyaltyPoints(): Promise<bigint>;
    getLoyaltyRewards(): Promise<Array<LoyaltyReward>>;
    getMyContactRequests(): Promise<Array<ContactRequest>>;
    getPolicies(): Promise<Policies>;
    getPortfolioItem(id: string): Promise<PortfolioItem | null>;
    getPortfolioItems(): Promise<Array<PortfolioItem>>;
    getProduct(id: string): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getSocialMediaLinks(): Promise<Array<SocialMediaLink>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTestimonial(id: string): Promise<Testimonial | null>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantUserAccess(user: Principal): Promise<void>;
    hasValidAdminSession(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isPermanentlyLocked(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listAdminUsers(): Promise<Array<Principal>>;
    redeemLoyaltyReward(rewardId: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    selectGiveawayWinner(giveawayId: string, winnerIndex: bigint): Promise<GiveawayWinner | null>;
    setFulfillmentOptions(options: FulfillmentOptions): Promise<void>;
    setPolicies(newPolicies: Policies): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitContactRequest(request: ContactRequest): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateContactRequestStatus(id: string, status: string): Promise<void>;
    updateMasterOverride(currentMasterOverride: string, newMasterOverride: string): Promise<void>;
    updateWithMasterOverride(masterOverride: string, newCode1: string, newCode2: string, newCode3: string): Promise<void>;
    validateCoupon(code: string): Promise<Coupon | null>;
    verifyAdminCodeStep1(code: string): Promise<boolean>;
    verifyAdminCodeStep2(code: string): Promise<boolean>;
    verifyAdminCodeStep3(code: string): Promise<boolean>;
    verifyAdminMasterOverride(code: string): Promise<boolean>;
}
