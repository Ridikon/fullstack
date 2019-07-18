import {Injectable} from "@angular/core";
import {Socket} from 'ngx-socket-io';
import {User} from "../interfaces";

@Injectable({
	providedIn: "root"
})
export class WebsocketService {
	constructor(private socket: Socket) {
	}

	newUserEvent(user: User) {
		this.socket.emit('newUser', {user})
	}
}
