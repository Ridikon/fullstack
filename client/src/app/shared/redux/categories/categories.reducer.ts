import {CategoryActions, CATEGORY_ACTION} from "./categories.action";

const initialState = {
	categories: []
};

export function categoriesReducer(state = initialState, action: CategoryActions) {
	switch (action.type) {
		case CATEGORY_ACTION.GET_CATEGORIES:
			return {
				...state,
				categories: [...action.payload]
			};
		case CATEGORY_ACTION.ADD_CATEGORY:
			return {
				...state,
				categories: [...state.categories, action.payload]
			};
		case CATEGORY_ACTION.UPDATE_CATEGORY:
			const categoryIndex = state.categories.findIndex(i => i._id === action.payload._id);
			state.categories[categoryIndex] = action.payload;
			return {
				...state,
				categories: [...state.categories]
			};
		case CATEGORY_ACTION.DELETE_CATEGORY:
			const idx = state.categories.findIndex(i => i._id === action.payload);
			return {
				...state,
				categories: [...state.categories.slice(1, idx)]
			};
		default:
			return state
	}
}
