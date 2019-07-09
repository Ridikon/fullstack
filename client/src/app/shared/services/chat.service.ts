import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {switchMap} from "rxjs/operators";
import {Conversation} from "../interfaces";

@Injectable({
	providedIn: "root"
})
export class ChatService {
	constructor(private http: HttpClient) {
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
					return of(conversations)
				})
			);
	}

	newConversation(user, message: string): Observable<any> {
		return this.http.post(`/api/chat/new/${user._id}`, {...user, message});
	}

	sendReply(conversation, message: string): Observable<any> {
		return this.http.post<any>(`/api/chat/${conversation.conversationId}`, {...conversation, message})
	}

	deleteConversation(conversationId: string) {
		return this.http.delete(`/api/chat/${conversationId}`);
	}
}
