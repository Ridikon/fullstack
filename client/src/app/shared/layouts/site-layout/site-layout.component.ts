import {
	AfterViewInit,
	Component,
	ElementRef, OnDestroy, OnInit,
	ViewChild
} from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from "../../services/auth.service";
import {MaterialInstance, MaterialService} from "../../classes/material.service";
import {select, State} from "@ngrx/store";
import {AppState} from "../../redux/app.state";
import {switchMap} from "rxjs/operators";
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
		private categoriesService: CategoriesService) {
	}

	ngOnInit(): void {
		const userId = localStorage.getItem('auth-id');

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
