import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {AnalyticsPageComponent} from "./analytics-page.component";
import {AnalyticsRoutingModule} from "./analytics.routing.module";
import {SharedModule} from "../shared/shared.module";

@NgModule({
	declarations: [
		AnalyticsPageComponent
	],
	imports: [
		CommonModule,
		AnalyticsRoutingModule,
		SharedModule
	]
})
export class AnalyticsModule {}
