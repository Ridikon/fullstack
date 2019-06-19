import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {SharedModule} from "../shared/shared.module";
import {UsersPageComponent} from "./users-page.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {UsersRoutingModule} from "./users.routing.module";
import {UsersFormComponent} from "./users-form/users-form.component";

@NgModule({
	declarations: [
		UsersPageComponent,
		UsersListComponent,
		UsersFormComponent
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		CommonModule,
		UsersRoutingModule
	]
})
export class UsersModule {}
