import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {CategoriesPageComponent} from "./categories-page.component";
import {CategoriesFormComponent} from "./categories-form/categories-form.component";
import {CategoriesListComponent} from "./categories-list/categories-list.component";
import {AuthGuard} from "../shared/classes/auth.guard";

const categoriesRoutes: Routes = [
	{
		path: '', component: CategoriesPageComponent,
		canActivateChild: [ AuthGuard ],
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
