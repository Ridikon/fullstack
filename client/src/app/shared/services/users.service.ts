import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {User, Users} from "../interfaces";
import {map, tap} from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class UsersService {
	constructor(private http: HttpClient) {}

	fetch(): Observable<User[]> {
		return this.http.get<User[]>('/api/users')
			.pipe(
				map(response => response)
			)
	}

	getById(id: string): Observable<User> {
		return this.http.get<User>(`/api/users/${id}`)
	}

	update(user: User): Observable<User> {
		return this.http.patch<User>(`/api/users/${user._id}`, user)
	}
}
