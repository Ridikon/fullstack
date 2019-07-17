import {Action} from "@ngrx/store";
import {Conversation} from "../../interfaces";

export namespace CHAT_ACTION {
	export const SET_CONVERSATIONS = 'SET_CONVERSATIONS';
	export const DELETE_CONVERSATION = 'DELETE_CONVERSATION';
	export const FAVORITE_CONVERSATION = 'FAVORITE_CONVERSATION';
	export const NEW_CONVERSATION = 'NEW_CONVERSATION';
}

export class SetConversations implements Action {
	readonly type = CHAT_ACTION.SET_CONVERSATIONS;

	constructor(public payload: Conversation[]) {
	}
}

export class FavoriteConversation implements Action {
	readonly type = CHAT_ACTION.FAVORITE_CONVERSATION;

	constructor(public payload: {id: string, favorite: {author: boolean, recipient: boolean}}) {
	}
}

export class DeleteConversation implements Action {
	readonly type = CHAT_ACTION.DELETE_CONVERSATION;

	constructor(public payload: string) {
	}
}

export class NewConversation implements Action {
	readonly type = CHAT_ACTION.NEW_CONVERSATION;

	constructor(public payload: Conversation) {
	}
}

export type ChatAction = SetConversations | FavoriteConversation | DeleteConversation | NewConversation
