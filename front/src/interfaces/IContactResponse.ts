export interface IContactResponse {
    id: number;
    name: string;
    thumb: string | null;
    status: string;
    mesg: string | null;
    lastSeenDate: string;
    onlineStatus: string;
    typing: boolean;
}
