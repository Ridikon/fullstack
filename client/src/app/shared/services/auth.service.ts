import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

import {User} from '../interfaces';
import {AppState} from "../redux/app.state";
import {SetUser} from "../redux/user/user.action";

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private token = null;

	constructor(private http: HttpClient, private store: Store<AppState>) {
	}

	register(user: User): Observable<User> {
		return this.http.post<User>('/api/auth/register', user);
	}

	login(user: User): Observable<{token: string, name: string}> {
		return this.http.post<{token: string, name: string}>('/api/auth/login', user)
			.pipe(
				tap(
					({token, name}) => {
						this.store.dispatch(new SetUser({name}));
						localStorage.setItem('auth-token', token);
						localStorage.setItem('company-name', name);
						this.setToken(token);
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
