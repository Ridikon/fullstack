import {Component} from '@angular/core';

import {select, State} from "@ngrx/store";
import {AppState} from "../../shared/redux/app.state";

@Component({
	selector: 'app-categories-list',
	templateUrl: './categories-list.component.html',
	styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent {
	categories$ = this.state.pipe(select('categoriesPage'));

	constructor(private state: State<AppState>) {
	}
}
