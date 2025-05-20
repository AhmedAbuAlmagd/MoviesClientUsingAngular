export interface Movie {
    id?: number;
    title: string;
    description?: string;
    releaseDate?: Date;
    poster?: string;
    trailer?: string;
    rating?: number;
    categories?: Category[];
}

export interface Category {
    id?: number;
    name: string;
}

export interface Pagination<T> {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    data: T[];
} 