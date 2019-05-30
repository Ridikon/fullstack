import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";

import {CategoriesService} from "../../shared/services/categories.service";
import {Category} from "../../shared/interfaces";

@Component({
	selector: 'app-order-categories',
	templateUrl: './order-categories.component.html',
	styleUrls: ['./order-categories.component.scss']
})
export class OrderCategoriesComponent implements OnInit {
	categories$: Observable<Category[]>;

	constructor(private categoriesService: CategoriesService) {
	}

	ngOnInit() {
		this.categories$ = this.categoriesService.fetch();
	}

}
