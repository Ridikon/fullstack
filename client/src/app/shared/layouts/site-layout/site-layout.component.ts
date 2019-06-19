import {
	AfterViewInit,
	Component,
	ElementRef, OnDestroy, OnInit,
	ViewChild
} from '@angular/core';
import {Router} from "@angular/router";
import {State} from "@ngrx/store";

import {AuthService} from "../../services/auth.service";
import {MaterialInstance, MaterialService} from "../../classes/material.service";
import {AppState} from "../../redux/app.state";

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
	companyName: string;

	links = [
		{url: '/overview', name: 'Огляд'},
		{url: '/analytics', name: 'Аналітика'},
		{url: '/history', name: 'Історія'},
		{url: '/order', name: 'Добавлення замовлення'},
		{url: '/categories', name: 'Ассортимент'}
	];

	constructor(private auth: AuthService, private router: Router, private state: State<AppState>) {
	}

	ngOnInit(): void {
		this.isDesktopWidth = this.isDesktop();
		this.companyName = this.getCompanyName();
		if (this.auth.permission.getValue() === 'super') {
			this.links.push({url: '/users', name: 'Користувачі'})
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

	getCompanyName(): string {
		let name = localStorage.getItem('company-name');

		if (name === 'undefined') {
			name = 'Menu'
		}

		return name;
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
