import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {User} from "../interfaces";
import {tap} from "rxjs/operators";
import {SetUser} from "../redux/user/user.action";
import {Store} from "@ngrx/store";
import {AppState} from "../redux/app.state";
import {MaterialService} from "../classes/material.service";

@Injectable({
	providedIn: "root"
})
export class UsersService {
	constructor(private http: HttpClient, private store: Store<AppState>) {
	}

	fetch(): Observable<User[]> {
		return this.http.get<User[]>('/api/users')
	}

	getById(id: string): Observable<User> {
		return this.http.get<User>(`/api/users/${id}`)
			.pipe(
				tap(user => {
					this.store.dispatch(new SetUser(user));
				})
			)
	}

	update(user: User) {
		this.http.patch<User>(`/api/users/${user._id}`, user)
			.pipe(
				tap(user => {
					this.store.dispatch(new SetUser(user));
				})
			)
			.subscribe(
				() => {
					MaterialService.toast('Зміни збережені');
				},
				error => MaterialService.toast(error.error.massage
				)
			)
	}

	getUserFromStore() {
		return
	}
}
