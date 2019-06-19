export interface User {
	email: string;
	password: string;
	name?: string;
	permission?: string;
	_id?: string;
	token?: string;
}

export interface Users {
	users: User[]
}

export interface StoredUser {
	name: string;
}

export interface Category {
	name: string;
	imageSrc?: string;
	user?: string;
	_id?: string;
}

export interface Categories {
	categories: Category[]
}

export interface Message {
	message: string
}

export interface Position {
	name: string;
	cost: number;
	category: string;
	user?: string;
	_id?: string;
	quantity?: number;
}

export interface Order {
	date?: Date;
	order?: number;
	user?: string;
	list: any[];
	_id?: string;
}

export interface OrderPosition {
	name: string;
	cost: number;
	quantity: number;
	_id?: string;
}

export interface Filter {
	start?: Date;
	end?: Date;
	order?: number;
}

export interface OverviewPage {
	orders: OverviewPageItem;
	gain: OverviewPageItem;
}

export interface OverviewPageItem {
	percent: number;
	compare: number;
	yesterday: number;
	isHigher: boolean;
}

export interface AnalyticsPage {
	average: number;
	chart: AnalyticsChartItem;
}

export interface AnalyticsChartItem {
	gain: number;
	order: number;
	label: string;

	map(param: (item) => any): any;
}
