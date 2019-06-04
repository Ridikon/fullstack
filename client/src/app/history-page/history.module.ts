import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {HistoryPageComponent} from "./history-page.component";
import {HistoryListComponent} from "./history-list/history-list.component";
import {HistoryFilterComponent} from "./history-filter/history-filter.component";
import {SharedModule} from "../shared/shared.module";
import {HistoryRoutingModule} from "./history.routing.module";

@NgModule({
	declarations: [
		HistoryPageComponent,
		HistoryListComponent,
		HistoryFilterComponent
	],
	imports: [
		FormsModule,
		SharedModule,
		CommonModule,
		HistoryRoutingModule
	]
})
export class HistoryModule {

}
