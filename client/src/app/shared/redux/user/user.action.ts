import {Action} from "@ngrx/store";
import {User} from "../../interfaces";

export namespace USER_ACTION {
	export const SET_USER = 'SET_USER';
	export const GET_USERS = 'GET_USERS';
	export const NEW_USER = 'NEW_USER';
}

export class SetUser implements Action {
	readonly type = USER_ACTION.SET_USER;

	constructor(public payload: User) {
	}
}

export class GetUsers implements Action {
	readonly type = USER_ACTION.GET_USERS;

	constructor(public payload: User[]) {
	}
}

export class NewUser implements Action {
	readonly type = USER_ACTION.NEW_USER;

	constructor(public payload: User) {
	}
}

export type UserActions = SetUser | GetUsers | NewUser
