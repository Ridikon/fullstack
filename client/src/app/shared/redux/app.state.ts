import {Categories, User} from "../interfaces";

export interface AppState {
	categoriesPage: {
		categories: Categories
	},
	userPage: {
		user: User
	}
}
