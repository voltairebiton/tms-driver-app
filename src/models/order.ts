export interface Order {
    id?: string;
    client_id?: string;
    driver_ids?: Array<string>;
    truck_id?: string;
    trailer_id?: string;
    pickups?: Array<any>;
    dropoffs?: Array<any>;
    dispatcher?: string;
    enable?: boolean;
    checked?: boolean;
    order_no?: string;
    is_deleted?: number;
    comments?: Array<any>;
}