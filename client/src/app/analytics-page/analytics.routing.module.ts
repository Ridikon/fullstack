import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AnalyticsPageComponent} from "./analytics-page.component";

const analyticsRoutes: Routes = [
	{path: '', component: AnalyticsPageComponent}
];

@NgModule({
	imports: [RouterModule.forChild(analyticsRoutes)],
	exports: [RouterModule]
})
export class AnalyticsRoutingModule {}
