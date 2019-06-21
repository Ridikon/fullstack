import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";
import {UsersService} from "../shared/services/users.service";

@Component({
	selector: 'app-profile-page',
	templateUrl: './profile-page.component.html',
	styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, AfterViewInit {
	form: FormGroup;

	constructor(private fb: FormBuilder, private route: ActivatedRoute, private usersService: UsersService) {
	}

	ngOnInit() {
		this.route.data.subscribe(
			data => {
				this.form = this.fb.group({
					name: [data.user.name, [Validators.required]],
					email: [data.user.email, [Validators.required, Validators.email]]
				})
			},
			error => {
				this.form = this.fb.group({
					name: [null, [Validators.required]],
					email: [null, [Validators.required, Validators.email]]
				})
			});
	}

	ngAfterViewInit(): void {
		MaterialService.updateTextInputs();
	}

	onSubmit() {
		const newUser = {
			...this.form.value,
			_id: localStorage.getItem('auth-id')
		};

		this.usersService.update(newUser);
	}

}
