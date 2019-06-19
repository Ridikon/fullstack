import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";

import {Category} from "../../shared/interfaces";
import {CategoriesService} from "../../shared/services/categories.service";
import {AuthService} from "../../shared/services/auth.service";

@Component({
	selector: 'app-categories-list',
	templateUrl: './categories-list.component.html',
	styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
	categories$: Observable<Category[]>;

	constructor(private categoriesService: CategoriesService, private auth: AuthService) {
	}

	ngOnInit() {
		this.categories$ = this.categoriesService.fetch();
	}

	hasPermission(): boolean {
		if (this.auth.permission.getValue() === 'super' || this.auth.permission.getValue() === 'admin') {
			return true;
		}

		return false;
	}
}
