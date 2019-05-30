import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MaterialService} from "../../classes/material.service";

@Component({
	selector: 'app-site-layout',
	templateUrl: './site-layout.component.html',
	styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements AfterViewInit {
	@ViewChild('floating') floatingRef: ElementRef;

	links = [
		{url: '/overview', name: 'Огляд'},
		{url: '/analytics', name: 'Аналітика'},
		{url: '/history', name: 'Історія'},
		{url: '/order', name: 'Добавлення замовлення'},
		{url: '/categories', name: 'Ассортимент'}
	];

	constructor(private auth: AuthService, private router: Router) {
	}

	ngAfterViewInit(): void {
		MaterialService.initializeFloatingButton(this.floatingRef)
	}

	logout(event: Event) {
		event.preventDefault();
		this.auth.logout();
		this.router.navigate(['/login'])
	}

}
