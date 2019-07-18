import {Categories, Conversation, User} from "../interfaces";

export interface AppState {
	categoriesPage: {
		categories: Categories
	},
	userPage: {
		user: User,
		users: User[]
	},
	chatPage: {
		conversations: Conversation[]
	}
}
