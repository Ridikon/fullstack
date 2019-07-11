import {
	AfterViewInit,
	Component,
	ElementRef, OnDestroy, OnInit,
	ViewChild
} from '@angular/core';
import {Router} from "@angular/router";
import {select, State} from "@ngrx/store";
import {switchMap} from "rxjs/operators";
import {Socket} from "ngx-socket-io";

import {AuthService} from "../../services/auth.service";
import {MaterialInstance, MaterialService} from "../../classes/material.service";
import {AppState} from "../../redux/app.state";
import {UsersService} from "../../services/users.service";
import {CategoriesService} from "../../services/categories.service";

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
	user$ = this.state.pipe(select('userPage'));

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
		private state: State<AppState>,
		private usersService: UsersService,
		private categoriesService: CategoriesService,
		private socket: Socket) {
	}

	ngOnInit(): void {
		const userId = localStorage.getItem('auth-id');
		const audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3');

		this.isDesktopWidth = this.isDesktop();

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
				MaterialService.toast(`Зареєструвався новий користувач з ім'ям ${data.name}`)
			}
		});

		this.socket.on('message', data => {
			if (SiteLayoutComponent.isCurrentReceiver(data, userId)) {
				audio.play();
				const name = data.message.conversationAuthor.name ? data.message.conversationAuthor.name : data.message.conversationName;
				MaterialService.toast(`Користувач з ім'ям ${name}, надіслав повідомлення`)
			}
		})
	}

	static isCurrentReceiver(data, id) {
		return ((data.message.conversationRecipient === id) || (data.message.conversationAuthor.id === id));
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

	isDesktop(): boolean {
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
