
export interface Driver {
	id: string;
	_id: any;
	last_name?: string;
	first_name?: string;
	dob?: Date;
	gender?: string;
	mobile?: string;
	land_line?: string;
	address?: string;
	email?: string;
	phone?: string;
	last_drug_test?: Date;
	physical_exp?: Date;
	cdl_exp?: Date;
	drv_license?: string ;
	hazmat?: string;
	checked: boolean;
	enable?: boolean;
	is_deleted?: number;
	cdl_notified?: boolean;
	drug_notified?: boolean;
	physical_notified?: boolean;
}