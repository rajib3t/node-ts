export interface IUser{
    id?: number;
    uuid: string;
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    password?: string;
    is_admin?: boolean
    created_at?: Date;
    updated_at?: Date;
}