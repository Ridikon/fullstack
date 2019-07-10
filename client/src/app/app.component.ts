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
		const potentialToken = localStorage.getItem('auth-token');
		const potentialUserId = localStorage.getItem('auth-id')

		const audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3');

		if (potentialToken !== null) {
			this.auth.setToken(potentialToken);
		}



		this.socket.on('newUser', data => {
			if (this.auth.permission.getValue() === 'super') {
				MaterialService.toast(`Зареєструвався новий користувач з ім'ям ${data.name}`)
			}
		});

		this.socket.on('message', data => {
			console.log(data)
			if (AppComponent.isCurrentReceiver(data, potentialUserId)) {
				audio.play();
				const name = data.message.conversationAuthor.name ? data.message.conversationAuthor.name : data.message.conversationName;
				MaterialService.toast(`Користувач з ім'ям ${name}, надіслав повідомлення`)
			}
		})
	}

	static isCurrentReceiver(data, id) {
		return ((data.message.conversationRecipient === id) || (data.message.conversationAuthor.id === id));
	}
}
