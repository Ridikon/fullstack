import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {CategoriesPageComponent} from "./categories-page.component";

const categoriesRoutes: Routes = [
	{path: '', component: CategoriesPageComponent}
];

@NgModule({
	imports: [RouterModule.forChild(categoriesRoutes)],
	exports: [RouterModule]
})
export class CategoriesRoutingModule {}
