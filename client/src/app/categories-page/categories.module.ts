import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {CategoriesRoutingModule} from "./categories.routing.module";
import {CategoriesPageComponent} from "./categories-page.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
	declarations: [
		CategoriesPageComponent
	],
	imports: [
		CommonModule,
		CategoriesRoutingModule,
		SharedModule
	]
})
export class CategoriesModule {}
