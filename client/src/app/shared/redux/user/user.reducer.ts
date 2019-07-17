import {UserActions, USER_ACTION} from "./user.action";

const initialState = {
	user: {},
	users: []
};

export function userReducer(state = initialState, action: UserActions) {
	switch (action.type) {
		case USER_ACTION.SET_USER:
			return {
				...state,
				user: action.payload
			};
		case USER_ACTION.GET_USERS:
			return {
				...state,
				users: action.payload
			};
		case USER_ACTION.NEW_USER:
			return {
				...state,
				users: [...state.users, action.payload]
			};
		default:
			return state
	}
}
