import {Action} from "@ngrx/store";
import {StoredUser, User} from "../../interfaces";

export namespace USER_ACTION {
	export const SET_USER = 'SET_USER'
}

export class SetUser implements Action {
	readonly type = USER_ACTION.SET_USER;

	constructor(public payload: User) {
	}
}

export type UserActions = SetUser
