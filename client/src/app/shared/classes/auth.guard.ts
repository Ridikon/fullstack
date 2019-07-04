import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanLoad, Params,
	Router,
	RouterStateSnapshot
} from "@angular/router";
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {MaterialService} from "./material.service";

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
	constructor(private auth: AuthService, private router: Router) {

	}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		if (this.auth.isAuthenticated()) {
			return of(true);
		} else {
			this.router.navigate(['/login'], {
				queryParams: {
					accessDenied: true
				}
			});

			return of(false);
		}
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		const url = state.url;

		return of(this.hasPermission(url))
	}

	canLoad(): Observable<boolean> | Promise<boolean> | boolean {
		if (this.auth.permission.getValue() === 'super') {
			return true;
		}

		MaterialService.toast('У Вас немає прав на перегляд цієї сторінки!');

		this.router.navigate(['overview']);

		return false;
	}

	hasPermission(url: string): boolean {
		if (this.auth.permission.getValue() !== 'basic' && this.hasAccessToCategories(url)) {
			return true;
		}

		MaterialService.toast('У Вас немає прав на перегляд цієї сторінки!');

		this.router.navigate(['overview']);

		return false;
	}

	hasAccessToCategories(url) {
		if (url === '/categories' && this.auth.permission.getValue() === 'user') {
			return false;
		}

		if (url === '/chat' && this.auth.permission.getValue() === 'basic') {
			return false;
		}

		return true;
	}
}
