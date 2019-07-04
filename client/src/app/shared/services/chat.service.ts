import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
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
					console.log('response', response)
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

	newConversation(id: string, message: string, name: string): Observable<any> {
		return this.http.post(`/api/chat/new/${id}`, {message, name});
	}

	sendReply(conversationId: string, message: string, name: string, recipient: string): Observable<any> {
		return this.http.post<any>(`/api/chat/${conversationId}`, {message, name, recipient})
			.pipe(
				tap(res => console.log('sendReply', res))
			);
	}

	deleteConversation(conversationId: string) {
		return this.http.delete(`/api/chat/${conversationId}`);
	}
}
