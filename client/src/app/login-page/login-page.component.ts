import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";

import {AuthService} from "../shared/services/auth.service";
import {MaterialService} from "../shared/classes/material.service";

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
	form: FormGroup;
	aSub: Subscription;

	constructor(
		private fb: FormBuilder,
		private auth: AuthService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnDestroy(): void {
		if (this.aSub) {
			this.aSub.unsubscribe();
		}
	}

	ngOnInit() {
		this.form = this.fb.group({
			email: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required, Validators.minLength(6)]]
		});

		this.route.queryParams.subscribe((params: Params) => {
			if (params['registered']) {
				// Now you can enter in system
				MaterialService.toast('Тепер ви можете зайти в систему використовуючи свої данні');
			} else if (params['accessDenied']) {
				// Please authorize
				MaterialService.toast('У вас немає доступу! Будь ласка зареєструйтесь в системі');
			} else if (params['sessionFailed']) {
				MaterialService.toast('Будь ласка ввійдіть в систему знову');
			}
		})
	}

	onSubmit() {
		this.form.disable();

		this.aSub = this.auth.login(this.form.value).subscribe(
			() => {
				console.log('login success')
				this.router.navigate(['/overview'])
			},
			error => {
				MaterialService.toast(error.error.message);
				this.form.enable();
			}
		);
	}

}
