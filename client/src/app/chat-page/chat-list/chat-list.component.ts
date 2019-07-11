import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {map, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {EMPTY, Subject} from "rxjs";
import {ActivatedRoute} from "@angular/router";

import {UsersService} from "../../shared/services/users.service";
import {ChatService} from "../../shared/services/chat.service";
import {Conversation, User} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
	selector: 'app-chat-list',
	templateUrl: './chat-list.component.html',
	styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('modal') modalRef: ElementRef;
	@ViewChild('chatSidebar') chatSidebarRef: ElementRef;

	private unsubscribe$ = new Subject<void>();

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
	authorId = '';
	isLoad = false;

	constructor(
		private usersService: UsersService,
		private chatService: ChatService,
		private socket: Socket,
		private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.isLoad = true;
		this.isDesktopWidth = this.isDesktop();

		this.route.data
			.pipe(
				take(1)
			)
			.subscribe(
				data => {
					this.myName = data.user.name;
					this.authorId = data.user._id;
				},
				error => MaterialService.toast(error.error.message));

		this.chatService.getConversations()
			.pipe(
				takeUntil(this.unsubscribe$),
				map(conversations => {
					this.isLoad = false;
					this.conversations$ = conversations;
					this.selectedConversation = conversations.find(item => item.conversationId === this.getConversationId());
					this.activeConversationsId = conversations.map(conversation => conversation.conversationRecipient);
				}),
				switchMap(() => this.usersService.fetch()),
				tap(users => this._setUsers(users))
			)
			.subscribe();

		if (this.getConversationId()) {
			this.chatService.getConversation(this.getConversationId())
				.pipe(
					takeUntil(this.unsubscribe$)
				)
				.subscribe(
					response => this._setFirstMessages(response)
				)
		}

		this.socket.on('message', data => {
			if (this.getConversationId() === data.message.conversationId) {
				if ((data.message.conversationRecipient === this.authorId) || (data.message.conversationAuthor.id === this.authorId)) {
					this.messages.push(data.message);
					this._setFirstMessages(this.messages);
				}
			}
		})
	}

	ngOnDestroy(): void {
		this.modal.destroy();
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
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
			this.chatSidebarRef.nativeElement.style.left = '0';
			this.chatSidebarRef.nativeElement.style.top = '0';
		} else {
			this.chatSidebarRef.nativeElement.style.left = '-120%';
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
		return conversation.conversationId === this.getConversationId();
	}

	selectUser(user: User) {
		this.chatService.newConversation(user, `Hello, ${user.name}!`)
			.pipe(
				takeUntil(this.unsubscribe$),
				tap(response => {
					this.setConversationId(response.conversationId);
				}),
				switchMap((response) => this.chatService.getConversation(response.conversationId)),
				tap(response => {
					this._setFirstMessages(response);
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
					this.sidebarTrigger();
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
			.pipe(
				takeUntil(this.unsubscribe$)
			)
			.subscribe(
				response => {
					this._setFirstMessages(response);
					this.sidebarTrigger();
				}
			)
	}

	onSend() {
		this.chatService.sendReply(this.selectedConversation, this.message)
			.pipe(
				takeUntil(this.unsubscribe$)
			)
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

			message['isFirst'] = (arr[i - 1].author._id || arr[i - 1].author) !== (message.author._id || message.author);
			return message;
		})
	}

	isAuthorMessage(message) {
		return (message.author._id || message.author) === this.authorId;
	}

	onDelete() {
		this.chatService.deleteConversation(this.selectedConversation.conversationId)
			.pipe(
				takeUntil(this.unsubscribe$),
				switchMap(() => this.usersService.fetch()),
				tap(users => {
					this.activeConversationsId = this.activeConversationsId.filter(id => id !== this.selectedConversation.conversationRecipient);

					this._setUsers(users)
				}),
				switchMap(() => this.chatService.getConversations()),
				tap(
					(response) => {
						this.conversations$ = response;

						if (this.conversations$.length) {
							this.selectedConversation = this.conversations$[0];
							this.setConversationId(this.selectedConversation.conversationId)
						} else {
							this.selectedConversation = null;
							localStorage.removeItem('selectedConversationId');
							this.messages = [];
						}
					}
				),
				switchMap(() => {
					if (this.selectedConversation) {
						return this.chatService.getConversation(this.selectedConversation.conversationId)
					}

					return EMPTY;
				})
			)
			.subscribe(
				response => {
					this._setFirstMessages(response);
				}
			);
	}

	_setUsers(users: User[]) {
		this.users$ = users.filter(user => {
			if (this.activeConversationsId.includes(user._id) || user._id === this.authorId) {
				return;
			}

			return user;
		});
	}
}
