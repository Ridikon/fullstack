import {
	AfterViewInit,
	Component,
	ElementRef, OnDestroy, OnInit,
	ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {select, Store} from "@ngrx/store";
import {switchMap} from "rxjs/operators";
import {Socket} from "ngx-socket-io";

import {AuthService} from "../../services/auth.service";
import {MaterialInstance, MaterialService} from "../../classes/material.service";
import {AppState} from "../../redux/app.state";
import {UsersService} from "../../services/users.service";
import {CategoriesService} from "../../services/categories.service";
import {GetUsers, NewUser} from "../../redux/user/user.action";

@Component({
	selector: 'app-site-layout',
	templateUrl: './site-layout.component.html',
	styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements AfterViewInit, OnInit, OnDestroy {
	@ViewChild('floating') floatingRef: ElementRef;
	@ViewChild('sidebar') sidebarRef: ElementRef;

	sidebarInstance: MaterialInstance;
	isDesktopWidth: boolean;
	user$ = this.store.pipe(select('userPage'));
	audio = new Audio('../../assets/audio/ICQ-bip.mp3');

	links = [
		{url: '/profile', name: 'Профіль'},
		{url: '/overview', name: 'Огляд'},
		{url: '/analytics', name: 'Аналітика'},
		{url: '/history', name: 'Історія'},
		{url: '/order', name: 'Добавлення замовлення'},
	];

	constructor(
		private auth: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<AppState>,
		private usersService: UsersService,
		private categoriesService: CategoriesService,
		private socket: Socket) {
	}

	ngOnInit(): void {
		const userId = localStorage.getItem('auth-id');

		this.route.data.subscribe(
			data => {
				this.store.dispatch(new GetUsers(data.users));
			});

		this.isDesktopWidth = SiteLayoutComponent.isDesktop();

		if (this.auth.permission.getValue() !== 'user') {
			this.links.push({url: '/categories', name: 'Ассортимент'})
		}

		if (this.auth.permission.getValue() === 'super') {
			this.links.push({url: '/users', name: 'Користувачі'})
		}

		this.links.push({url: '/chat', name: 'Чат'});

		if (userId !== null) {
			this.usersService.getById(userId)
				.pipe(
					switchMap(() => this.categoriesService.fetch())
				)
				.subscribe();
		}

		this.socket.on('newUser', data => {
			if (this.auth.permission.getValue() === 'super') {
				this.store.dispatch(new NewUser(data.user));
				MaterialService.toast(`Зареєструвався новий користувач з ім'ям ${data.user.name}`);
			}
		});

		this.socket.on('message', data => {
			this.newSocketAction(data, userId);
		});

		this.socket.on('newConversation', data => {
			this.newSocketAction(data, userId);
		});

		this.socket.on('deleteConversation', data => {
			this.newSocketAction(data, userId);
		});
	}

	static isCurrentReceiver(data, id) {
		return ((data.conversationRecipient === id) || (data.conversationAuthor.id === id));
	}

	newSocketAction(data, id) {
		if (data.hasOwnProperty('conversation') && SiteLayoutComponent.isCurrentReceiver(data.conversation, id)) {
			const name = data.conversation.conversationAuthor.name;
			MaterialService.toast(`Користувач ${name} створив з вами розмову`);
			this.audio.play();
		}

		if (data.hasOwnProperty('message') && SiteLayoutComponent.isCurrentReceiver(data.message, id)) {
			const name = data.message.conversationRecipient === id ? data.message.conversationAuthor.name : data.message.conversationName;
			MaterialService.toast(`Користувач ${name}, надіслав вам повідомлення`);
			this.audio.play();
		}

		if (data.hasOwnProperty('deletedConversation') && SiteLayoutComponent.isCurrentReceiver(data.deletedConversation, id)) {
			const name = data.deletedConversation.conversationRecipient === id ? data.deletedConversation.conversationAuthor.name : data.deletedConversation.conversationName;
			MaterialService.toast(`Користувач ${name} видалив розмову`);
			this.audio.play();
		}
	}

	ngAfterViewInit(): void {
		MaterialService.initializeFloatingButton(this.floatingRef);

		if (!this.isDesktopWidth && this.sidebarRef) {
			this.sidebarInstance = MaterialService.initSidebar(this.sidebarRef)
		}
	}

	ngOnDestroy(): void {
		if (this.sidebarInstance) {
			this.sidebarInstance.destroy();
		}
	}

	static isDesktop(): boolean {
		return window.document.activeElement.clientWidth > 992;
	}

	closeSidebar() {
		this.sidebarInstance.close();
	}

	openSidebar() {
		this.sidebarInstance.open();
	}

	logout(event: Event) {
		event.preventDefault();
		this.auth.logout();
		this.router.navigate(['/login'])
	}

}
