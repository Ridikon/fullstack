import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {SharedModule} from "../shared/shared.module";
import {CategoriesRoutingModule} from "./categories.routing.module";
import {CategoriesPageComponent} from "./categories-page.component";
import {CategoriesFormComponent} from "./categories-form/categories-form.component";
import {PositionsFormComponent} from "./categories-form/positions-form/positions-form.component";
import {CategoriesListComponent} from "./categories-list/categories-list.component";

@NgModule({
	declarations: [
		CategoriesPageComponent,
		CategoriesFormComponent,
		PositionsFormComponent,
		CategoriesListComponent
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		CommonModule,
		CategoriesRoutingModule
	]
})
export class CategoriesModule {}
