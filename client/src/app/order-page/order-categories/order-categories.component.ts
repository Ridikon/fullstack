import {Component} from '@angular/core';

import {select, State} from "@ngrx/store";
import {AppState} from "../../shared/redux/app.state";

@Component({
	selector: 'app-order-categories',
	templateUrl: './order-categories.component.html',
	styleUrls: ['./order-categories.component.scss']
})
export class OrderCategoriesComponent {
	categories$ = this.state.pipe(select('categoriesPage'));

	constructor(private state: State<AppState>) {
	}
}
