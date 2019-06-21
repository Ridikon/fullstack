import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {tap} from "rxjs/operators";

import {User} from '../interfaces';
import {Store} from "@ngrx/store";
import {AppState} from "../redux/app.state";
import {SetUser} from "../redux/user/user.action";

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private token = null;

	permission = new BehaviorSubject(localStorage.getItem('permission'));

	constructor(private http: HttpClient, private store: Store<AppState>) {
	}

	register(user: User): Observable<User> {
		return this.http.post<User>('/api/auth/register', user);
	}

	login(user: User): Observable<User> {
		return this.http.post<User>('/api/auth/login', user)
			.pipe(
				tap(
					(response) => {
						console.log('response', response)
						this.permission.next(response.permission);
						this.store.dispatch(new SetUser(response));
						localStorage.setItem('auth-token', response.token);
						localStorage.setItem('permission', response.permission);
						localStorage.setItem('auth-id', response.userId);
						this.setToken(response.token);
					}
				)
			)
	}

	setToken(token: string) {
		this.token = token;
	}

	getToken(): string {
		return this.token;
	}

	isAuthenticated(): boolean {
		return !!this.token;
	}

	logout() {
		this.setToken(null);
		localStorage.clear();
	}
}
