import {ChatAction, CHAT_ACTION} from "./chat.action";

const initialState = {
	conversations: []
};

export function chatReducer(state = initialState, action: ChatAction) {
	switch (action.type) {
		case CHAT_ACTION.SET_CONVERSATIONS:
			return {
				...state,
				conversations: action.payload
			};
		case CHAT_ACTION.FAVORITE_CONVERSATION:
			const updatedData = state.conversations.map(conversation => {
				if (conversation.conversationId === action.payload.id) {
					conversation.favorite = action.payload.favorite
				}

				return conversation
			});

			return {
				...state,
				conversations: [...updatedData]
			};
		case CHAT_ACTION.DELETE_CONVERSATION:
			const newData = state.conversations.filter(conversation => {
				if (conversation.conversationId !== action.payload) {
					return conversation
				}
			});

			return {
				...state,
				conversations: [...newData]
			};
		case CHAT_ACTION.NEW_CONVERSATION:
			return {
				...state,
				conversations: [...state.conversations, action.payload]
			};
		default:
			return state
	}
}
