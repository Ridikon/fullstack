import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Socket} from 'ngx-socket-io';

import {UsersService} from "../../shared/services/users.service";
import {ChatService} from "../../shared/services/chat.service";
import {Conversation, User} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";
import {map, switchMap, tap} from "rxjs/operators";

@Component({
	selector: 'app-chat-list',
	templateUrl: './chat-list.component.html',
	styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('modal') modalRef: ElementRef;
	@ViewChild('chatSidebar') chatSidebarRef: ElementRef;

	isDesktopWidth: boolean = false;
	open: boolean;
	users$: User[];
	conversations$: Conversation[];
	modal: MaterialInstance;
	messages = [];
	message = '';
	selectedConversation: Conversation = null;
	myName = '';
	activeConversationsId: string[] = [];
	authorId = localStorage.getItem('auth-id');
	isLoad = false;

	constructor(private usersService: UsersService, private chatService: ChatService, private socket: Socket) {
	}

	ngOnInit() {
		this.isLoad = true;
		this.isDesktopWidth = this.isDesktop();

		this.chatService.getConversations()
			.pipe(
				map(conversations => {
					this.isLoad = false;
					this.conversations$ = conversations;
					this.selectedConversation = conversations.find(item => item.conversationId === this.getConversationId())
					this.activeConversationsId = conversations.map(conversation => {
						return conversation.conversationRecipient
					})
				}),
				switchMap(() => this.usersService.fetch())
			)
			.subscribe(
				users => {
					this.myName = users.find(item => item._id === localStorage.getItem('auth-id')).name;

					this._setUsers(users)
				}
			);

		if (this.getConversationId()) {
			this.chatService.getConversation(this.getConversationId())
				.subscribe(
					response => {
						this._setFirstMessages(response);
					}
				)
		}

		this.socket.on('message', data => {
			this.messages.push(data.message);
		})
	}

	ngOnDestroy(): void {
		this.modal.destroy();
	}

	ngAfterViewInit() {
		this.modal = MaterialService.initModal(this.modalRef);
	}

	isDesktop(): boolean {
		return window.document.activeElement.clientWidth > 992;
	}

	sidebarTrigger() {
		this.open = !this.open;

		if (this.open) {
			this.chatSidebarRef.nativeElement.style.transform = 'translateX(0)';
		} else {
			this.chatSidebarRef.nativeElement.style.transform = 'translateX(-120%)';
		}
	}

	setConversationName(conversation: Conversation) {
		let name = '';
		if (conversation.conversationRecipient === this.authorId) {
			name = conversation.conversationAuthor.name;
		} else {
			name = conversation.conversationName;
		}
		return name;
	}

	openModal() {
		this.modal.open();
	}

	isActive(conversation: Conversation) {
		if (conversation.conversationId === this.getConversationId()) {
			return true;
		}

		return false;
	}

	selectUser(user: User) {
		this.chatService.newConversation(user, `Hello, ${user.name}!`)
			.pipe(
				tap(response => {
					this.setConversationId(response.conversationId);
					this.chatService.getConversation(response.conversationId)
						.subscribe(
							response => {
								this._setFirstMessages(response);
								console.log('this.messages', this.messages)
							}
						)
				}),
				switchMap(() => this.chatService.getConversations())
			)
			.subscribe(
				(response) => {
					this.selectedConversation = response.find(item => item.conversationId === this.getConversationId());
					this.activeConversationsId.push(this.selectedConversation.conversationRecipient);
					this.users$ = this.users$.filter(user => user._id !== this.selectedConversation.conversationRecipient);
					this.conversations$ = response;
					this.modal.close();
				}
			)
	}

	setConversationId(id: string) {
		localStorage.setItem('selectedConversationId', id)
	}

	getConversationId() {
		return localStorage.getItem('selectedConversationId');
	}

	selectConversation(conversation: Conversation) {
		this.selectedConversation = conversation;

		this.setConversationId(this.selectedConversation.conversationId);
		this.chatService.getConversation(this.selectedConversation.conversationId)
			.subscribe(
				response => {
					this._setFirstMessages(response);
				}
			)
	}

	onSend() {
		this.chatService.sendReply(this.selectedConversation, this.message)
			.subscribe(
				response => {
					this.socket.emit('message', {message: response});
					this.messages.push(response)
					this._setFirstMessages(this.messages);
					this.message = '';
				}
			)
	}

	_setFirstMessages(messages) {
		this.messages = messages.map((message, i, arr) => {
			if (i === 0) {
				message['isFirst'] = true;
				return message;
			}

			if ((arr[i - 1].author._id || arr[i - 1].author) === (message.author._id || message.author)) {
				message['isFirst'] = false;
			} else {
				message['isFirst'] = true;
			}
			return message;
		})
	}

	isAuthorMessage(message) {
		if ((message.author._id || message.author) === this.authorId) {
			return true;
		}

		return false;
	}

	onDelete() {
		this.chatService.deleteConversation(this.selectedConversation.conversationId)
			.pipe(
				switchMap(() => this.usersService.fetch()),
				tap(users => {
					this.activeConversationsId = this.activeConversationsId.filter(id => id !== this.selectedConversation.conversationRecipient);

					this._setUsers(users)
				}),
				switchMap(() => this.chatService.getConversations())
			)
			.subscribe(
				(response) => {
					this.conversations$ = response;

					if (this.conversations$.length) {
						this.selectedConversation = this.conversations$[0];
						this.setConversationId(this.selectedConversation.conversationId)

						this.chatService.getConversation(this.selectedConversation.conversationId)
							.subscribe(
								response => {
									this._setFirstMessages(response);
								}
							)
					} else {
						this.selectedConversation = null;
						localStorage.removeItem('selectedConversationId');
						this.messages = [];
					}
				}
			);
	}

	_setUsers(users: User[]) {
		this.users$ = users.filter(user => {
			if (this.activeConversationsId.includes(user._id) || user._id === localStorage.getItem('auth-id')) {
				return;
			}

			return user;
		});
	}
}
