export type AuthResponse = {
    accessToken: string;
    expiredAt: number;
    refreshToken?: string;
    userId: string;
    role: string
}