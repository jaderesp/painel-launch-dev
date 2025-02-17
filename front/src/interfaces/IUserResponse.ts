export interface IUserResponse {
    id: number;
    name: string;
    thumb: string | null;
    status: string;
    mesg: string | null;
    lastSeenDate: Date;
    onlineStatus: boolean;
    typing: boolean;
}