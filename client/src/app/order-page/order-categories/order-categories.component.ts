import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";

import {CategoriesService} from "../../shared/services/categories.service";
import {Categories} from "../../shared/interfaces";

@Component({
	selector: 'app-order-categories',
	templateUrl: './order-categories.component.html',
	styleUrls: ['./order-categories.component.scss']
})
export class OrderCategoriesComponent implements OnInit {
	categories$: Observable<Categories>;

	constructor(private categoriesService: CategoriesService) {
	}

	ngOnInit() {
		this.categories$ = this.categoriesService.fetch();
	}

}
