export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponseDTO {
    isAuthenticated: boolean;
    message?: string;
    userName?: string;
    email?: string;
    token?: string;
    expiresOn?: Date;
} 