import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Category} from "../../shared/interfaces";
import {CategoriesService} from "../../shared/services/categories.service";

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
	categories$: Observable<Category[]>;

	constructor(private categoriesService: CategoriesService) {}

	ngOnInit() {
		this.categories$ = this.categoriesService.fetch();
	}
}
