import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MaterialService} from "../shared/classes/material.service";

@Component({
	selector: 'app-register-page',
	templateUrl: './register-page.component.html',
	styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {
	form: FormGroup;
	aSub: Subscription;
	loader = false;

	constructor(
		private fb: FormBuilder,
		private auth: AuthService,
		private router: Router
	) {}

	ngOnDestroy(): void {
		if (this.aSub) {
			this.aSub.unsubscribe();
		}
	}

	ngOnInit() {
		this.form = this.fb.group({
			name: [null, [Validators.required]],
			email: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required, Validators.minLength(6)]]
		})
	}

	onSubmit() {
		this.form.disable();
		this.loader = true;

		this.aSub = this.auth.register(this.form.value).subscribe(
			() => {
				this.router.navigate(['/login'], {
					queryParams: {
						reqistered: true
					}
				})
			},
			error => {
				this.loader = false;
				MaterialService.toast(error.error.message);
				this.form.enable();
			},
			() => this.loader = false
		);
	}

}
