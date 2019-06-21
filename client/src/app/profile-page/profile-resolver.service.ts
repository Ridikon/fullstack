import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";

import {User} from "../shared/interfaces";
import {UsersService} from "../shared/services/users.service";
import {EMPTY, Observable, of} from "rxjs";
import {catchError, mergeMap} from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})
export class ProfileResolverService implements Resolve<User> {
	user: User;

	constructor(private usersService: UsersService) {
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Observable<never> {
		const id = localStorage.getItem('auth-id');

		return this.usersService.getById(id)
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
