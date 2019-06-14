import {UserActions, USER_ACTION} from "./user.action";

const initialState = {
	user: {}
};

export function userReducer(state = initialState, action: UserActions) {
	switch (action.type) {
		case USER_ACTION.SET_USER:
			return {
				...state,
				user: action.payload
			};
		default:
			return state
	}
}
