import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {UsersService} from "../../shared/services/users.service";
import {User} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";
import {AuthService} from "../../shared/services/auth.service";

@Component({
	selector: 'app-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
	@ViewChild('modal') modalRef: ElementRef;
	users: User[];
	modal: MaterialInstance;
	selectedUser: User;
	permission: string;

	constructor(private usersService: UsersService, private auth: AuthService) {
	}

	ngOnInit() {
		this.usersService.fetch()
			.subscribe(response => {
				this.users = response.filter(user => user.permission !== this.auth.permission.getValue());
			})
	}

	ngOnDestroy(): void {
		this.modal.destroy();
	}

	ngAfterViewInit(): void {
		this.modal = MaterialService.initModal(this.modalRef);
	}

	selectUser(user: User) {
		this.selectedUser = user;
		this.permission = user.permission;
		this.modal.open();
	}

	saveUser() {
		this.selectedUser.permission = this.permission;
		this.usersService.update(this.selectedUser);
		this.modal.close();
	}

	closeModal() {
		this.modal.close();
	}

}
