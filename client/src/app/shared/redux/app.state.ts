import {Categories, StoredUser} from "../interfaces";

export interface AppState {
	categoriesPage: {
		categories: Categories
	},
	userPage: {
		user: StoredUser
	}
}
