import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {SharedModule} from "../shared/shared.module";
import {ChatPageComponent} from "./chat-page.component";
import {ChatRoutingModule} from "./chat.routing.module";
import {ChatListComponent} from "./chat-list/chat-list.component";

@NgModule({
	declarations: [
		ChatPageComponent,
		ChatListComponent
	],
	imports: [
		FormsModule,
		SharedModule,
		CommonModule,
		ChatRoutingModule
	]
})
export class ChatModule {

}
