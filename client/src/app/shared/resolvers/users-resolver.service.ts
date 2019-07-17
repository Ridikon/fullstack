import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";

import {User} from "../interfaces";
import {UsersService} from "../services/users.service";
import {EMPTY, Observable, of} from "rxjs";
import {catchError, mergeMap} from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class UsersResolverService implements Resolve<User[]> {

	constructor(private usersService: UsersService) {
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]> | Observable<never> {
		return this.usersService.fetch()
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
