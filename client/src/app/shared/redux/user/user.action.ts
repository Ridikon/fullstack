import {Action} from "@ngrx/store";
import {StoredUser} from "../../interfaces";

export namespace USER_ACTION {
	export const SET_USER = 'SET_USER'
}

export class SetUser implements Action {
	readonly type = USER_ACTION.SET_USER;

	constructor(public payload: StoredUser) {
	}
}

export type UserActions = SetUser
