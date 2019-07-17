import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import {Store} from "@ngrx/store";

import {Conversation} from "../interfaces";
import {SetConversations, FavoriteConversation} from "../redux/chat/chat.action";
import {AppState} from "../redux/app.state";

@Injectable({
	providedIn: "root"
})
export class ChatService {
	constructor(private http: HttpClient, private store: Store<AppState>) {
	}

	getConversation(id: string) {
		return this.http.get(`/api/chat/${id}`)
			.pipe(
				switchMap(response => {
					let messages = response['conversation'];
					return of(messages)
				})
			);
	}

	getConversations(): Observable<Conversation[]> {
		return this.http.get<Conversation[]>(`/api/chat`)
			.pipe(
				switchMap(response => {
					let conversations = response['conversations'].map(item => item[0]);
					this.store.dispatch(new SetConversations(conversations));
					return of(conversations)
				})
			);
	}

	newConversation(user, message: string): Observable<any> {
		return this.http.post(`/api/chat/new/${user._id}`, {...user, message});
	}

	setFavoriteConversation(conversationId: string, favorite: boolean): Observable<any> {
		return this.http.patch(`/api/chat/${conversationId}`, {favorite})
			.pipe(
				tap(response => {
					this.store.dispatch(new FavoriteConversation({id: conversationId, favorite}))
				})
			)
	}

	sendReply(conversation, message: string): Observable<any> {
		return this.http.post<any>(`/api/chat/${conversation.conversationId}`, {...conversation, message})
	}

	deleteConversation(conversationId: string) {
		return this.http.delete(`/api/chat/${conversationId}`)
	}
}
