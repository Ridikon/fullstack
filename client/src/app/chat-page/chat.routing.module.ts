import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {ChatPageComponent} from "./chat-page.component";
import {AuthGuard} from "../shared/classes/auth.guard";
import {ChatListComponent} from "./chat-list/chat-list.component";
import {ProfileResolverService} from "../shared/resolvers/profile-resolver.service";

const chatRoutes: Routes = [
	{
		path: '',
		component: ChatPageComponent,
		canActivateChild: [ AuthGuard ],
		children: [
			{
				path: '',
				redirectTo: '',
				pathMatch: 'full',
				component: ChatListComponent,
				resolve: {user: ProfileResolverService}
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(chatRoutes)],
	exports: [RouterModule]
})
export class ChatRoutingModule {

}
