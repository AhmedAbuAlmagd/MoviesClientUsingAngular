export interface Review {
    id?: number;
    movieId: number;
    userId?: string;
    userName?: string;
    rating: number;
    comment: string;
}

export interface AddReviewDTO {
    movieId: number;
    rating: number;
    comment: string;
}

export interface UpdateReviewDTO {
    id: number;
    rating: number;
    comment: string;
} 