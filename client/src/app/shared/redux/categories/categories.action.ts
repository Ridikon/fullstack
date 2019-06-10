import {Action} from "@ngrx/store";
import {Category} from "../../interfaces";

export namespace CATEGORY_ACTION {
	export const ADD_CATEGORY = 'ADD_CATEGORY';
	export const GET_CATEGORIES = 'GET_CATEGORIES';
	export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
	export const DELETE_CATEGORY = 'DELETE_CATEGORY';
}

export class GetCategories implements Action {
	readonly type = CATEGORY_ACTION.GET_CATEGORIES;

	constructor(public payload: Category[]) {
	}
}

export class AddCategory implements Action {
	readonly type = CATEGORY_ACTION.ADD_CATEGORY;

	constructor(public payload: Category) {
	}
}

export class UpdateCategory implements Action {
	readonly type = CATEGORY_ACTION.UPDATE_CATEGORY;

	constructor(public payload: Category) {
	}
}

export class DeleteCategory implements Action {
	readonly type = CATEGORY_ACTION.DELETE_CATEGORY;

	constructor(public payload: string) {
	}
}

export type CategoryActions = AddCategory | GetCategories | DeleteCategory | UpdateCategory
