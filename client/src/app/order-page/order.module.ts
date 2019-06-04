import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {OrderPageComponent} from "./order-page.component";
import {OrderCategoriesComponent} from "./order-categories/order-categories.component";
import {OrderPositionsComponent} from "./order-positions/order-positions.component";
import {SharedModule} from "../shared/shared.module";
import {OrderRoutingModule} from "./order.routing.module";

@NgModule({
	declarations: [
		OrderPageComponent,
		OrderCategoriesComponent,
		OrderPositionsComponent
	],
	imports: [
		FormsModule,
		SharedModule,
		CommonModule,
		OrderRoutingModule
	]
})
export class OrderModule {

}
