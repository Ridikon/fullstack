import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {ProfilePageComponent} from "./profile-page.component";
import {ProfileResolverService} from "../shared/resolvers/profile-resolver.service";

const profileRoutes: Routes = [
	{
		path: '', component: ProfilePageComponent, resolve: {user: ProfileResolverService}
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(profileRoutes)
	],
	exports: [RouterModule]
})
export class ProfileRoutingModule {}
