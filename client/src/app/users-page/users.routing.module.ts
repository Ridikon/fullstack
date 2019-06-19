import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {UsersPageComponent} from "./users-page.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {UsersFormComponent} from "./users-form/users-form.component";

const usersRoutes: Routes = [
	{
		path: '', component: UsersPageComponent,
		children: [
			{path: '', redirectTo: '', pathMatch: 'full', component: UsersListComponent},
			{path: ':id', component: UsersFormComponent}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(usersRoutes)
	],
	exports: [RouterModule]
})

export class UsersRoutingModule {}
