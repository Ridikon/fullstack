import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {SharedModule} from "../shared/shared.module";
import {CommonModule} from "@angular/common";
import {ProfileRoutingModule} from "./profile.routing.module";
import {ProfilePageComponent} from "./profile-page.component";

@NgModule({
	declarations: [
		ProfilePageComponent
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		CommonModule,
		ProfileRoutingModule
	]
})
export class ProfileModule {}
