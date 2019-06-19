import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanLoad,
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
		return of(this.hasPermission())
	}

	canLoad(): Observable<boolean> | Promise<boolean> | boolean {
		if (this.auth.permission.getValue() === 'super') {
			return true;
		}

		this.router.navigate(['overview']);
	}

	hasPermission(): boolean {
		if (this.auth.permission.getValue() === 'super' || this.auth.permission.getValue() === 'admin') {
			return true;
		}

		MaterialService.toast('У Вас немає прав на перегляд цієї сторінки!')

		this.router.navigate(['overview']);
	}
}
