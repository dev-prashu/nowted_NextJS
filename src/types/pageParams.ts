export interface pageParams{
    page: number;
    limit: number;
    folderId?:string,
    favorite?:boolean,
    deleted?:boolean,
    archived?:boolean
}