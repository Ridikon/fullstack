import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {select, State} from "@ngrx/store";

import {AppState} from "../../shared/redux/app.state";
import {Categories} from "../../shared/interfaces";

@Component({
	selector: 'app-categories-list',
	templateUrl: './categories-list.component.html',
	styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
	categories$: Observable<Categories[]>;

	constructor(private state: State<AppState>) {
	}

	ngOnInit() {
		this.categories$ = this.state.pipe(select('categoriesPage'));
	}
}
