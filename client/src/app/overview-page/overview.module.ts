import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {OverviewRoutingModule} from "./overview.routing.module";
import {OverviewPageComponent} from "./overview-page.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
	declarations: [
		OverviewPageComponent
	],
	imports: [
		SharedModule,
		CommonModule,
		OverviewRoutingModule
	]
})
export class OverviewModule {

}
