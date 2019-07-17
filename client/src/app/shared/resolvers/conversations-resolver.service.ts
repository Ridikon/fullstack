import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";

import {Conversation} from "../interfaces";
import {ChatService} from "../services/chat.service";
import {EMPTY, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {catchError, mergeMap} from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class ConversationsResolverService implements Resolve<Conversation[]> {
	constructor(private chatService: ChatService) {
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Conversation[]> | Observable<never> {
		return this.chatService.getConversations()
			.pipe(
				catchError(error => {
					return EMPTY
				}),
				mergeMap(response => {
					if (response) {
						return of(response)
					} else {
						return EMPTY
					}
				})
			)
	}
}
