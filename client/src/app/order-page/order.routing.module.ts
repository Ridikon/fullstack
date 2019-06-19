import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {OrderPageComponent} from "./order-page.component";
import {OrderCategoriesComponent} from "./order-categories/order-categories.component";
import {OrderPositionsComponent} from "./order-positions/order-positions.component";
import {AuthGuard} from "../shared/classes/auth.guard";

const orderRoutes: Routes = [
	{
		path: '',
		component: OrderPageComponent,
		canActivateChild: [ AuthGuard ],
		children: [
			{path: '', component: OrderCategoriesComponent},
			{path: ':id', component: OrderPositionsComponent}
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(orderRoutes)],
	exports: [RouterModule]
})
export class OrderRoutingModule {

}
