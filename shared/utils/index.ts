export default interface BackendResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
}