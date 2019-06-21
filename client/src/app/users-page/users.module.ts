import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {SharedModule} from "../shared/shared.module";
import {UsersPageComponent} from "./users-page.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {UsersRoutingModule} from "./users.routing.module";

@NgModule({
	declarations: [
		UsersPageComponent,
		UsersListComponent
	],
	imports: [
		FormsModule,
		SharedModule,
		CommonModule,
		UsersRoutingModule
	]
})
export class UsersModule {}
