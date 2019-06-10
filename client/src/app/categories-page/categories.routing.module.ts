import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {StoreModule} from "@ngrx/store";

import {CategoriesPageComponent} from "./categories-page.component";
import {CategoriesFormComponent} from "./categories-form/categories-form.component";
import {CategoriesListComponent} from "./categories-list/categories-list.component";
import {categoriesReducer} from "../shared/redux/categories/categories.reducer";

const categoriesRoutes: Routes = [
	{
		path: '', component: CategoriesPageComponent,
		children: [
			{path: '', redirectTo: '', pathMatch: 'full', component: CategoriesListComponent},
			{path: 'new', component: CategoriesFormComponent},
			{path: ':id', component: CategoriesFormComponent}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(categoriesRoutes)
	],
	exports: [RouterModule]
})
export class CategoriesRoutingModule {
}
