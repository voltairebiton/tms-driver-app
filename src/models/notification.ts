
export interface Notification {
    id?: string;
    type: string;
    title?: string;
    body: string;
    from: string;
    user_id: string;
    source_id?: string;
    date_created?: Date;
    seen?: boolean;
}
