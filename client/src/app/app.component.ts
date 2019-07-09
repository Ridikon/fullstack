import {Component, OnInit} from '@angular/core';
import {Socket} from 'ngx-socket-io';

import {AuthService} from "./shared/services/auth.service";
import {MaterialService} from "./shared/classes/material.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(private auth: AuthService, private socket: Socket) {
	}

	ngOnInit(): void {
		const potentialToken = localStorage.getItem('auth-token')

		if (potentialToken !== null) {
			this.auth.setToken(potentialToken);
		}

		this.socket.on('newUser', data => {
			if (this.auth.permission.getValue() === 'super') {
				MaterialService.toast(`Зареєструвався новий користувач з ім'ям ${data.name}`)
			}
		})
	}
}
