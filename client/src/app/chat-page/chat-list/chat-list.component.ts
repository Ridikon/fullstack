import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {switchMap, take, takeUntil, tap} from "rxjs/operators";
import {EMPTY, Subject} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {select, Store} from "@ngrx/store";

import {UsersService} from "../../shared/services/users.service";
import {ChatService} from "../../shared/services/chat.service";
import {Conversation, User} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";
import {AppState} from "../../shared/redux/app.state";
import {DeleteConversation, NewConversation} from "../../shared/redux/chat/chat.action";

@Component({
	selector: 'app-chat-list',
	templateUrl: './chat-list.component.html',
	styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('modal') modalRef: ElementRef;
	@ViewChild('chatSidebar') chatSidebarRef: ElementRef;

	private unsubscribe$ = new Subject<void>();

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
	favoriteTab: boolean;

	constructor(
		private usersService: UsersService,
		private chatService: ChatService,
		private store: Store<AppState>,
		private socket: Socket,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.isLoad = true;

		this.route.data
			.pipe(take(1))
			.subscribe(
				data => {
					this.isLoad = false;
					this.myName = data.user.name;
					this.authorId = data.user._id;
				},
				error => MaterialService.toast(error.error.message));

		this.store.pipe(select('userPage'))
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe(
				data => this._setUsers(data['users'])
			);

		this.store.pipe(select('chatPage'))
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe(
				data => {
					let sortFavorite = (a, b) => {
						return a.favorite[this.getSender(a)] - b.favorite[this.getSender(b)]
					};

					this.conversations$ = data.conversations.sort(sortFavorite).reverse();
					this.selectedConversation = this.conversations$.find(item => item.conversationId === this.getConversationId());
					this.activeConversationsId = this.conversations$.map(conversation => conversation.conversationRecipient);
				}
			);

		if (this.getConversationId()) {
			this.chatService.getConversation(this.getConversationId())
				.pipe(takeUntil(this.unsubscribe$))
				.subscribe(response => this._setFirstMessages(response))
		}

		this.socket.on('message', data => {
			if (this.getConversationId() === data.message.conversationId) {

				if (this.isCurrentListener(data.message)) {
					this.messages.push(data.message);
					this._setFirstMessages(this.messages);
				}
			}
		});

		this.socket.on('newConversation', data => {
			if (this.isCurrentListener(data.conversation)) {
				this.store.dispatch(new NewConversation(data.conversation));

				if (!this.selectedConversation) {
					this.selectConversation(data.conversation);
				}

				this.users$ = this.users$.filter(user => user._id !== this.selectedConversation.conversationAuthor.id);

				this._setUsers(this.users$)
			}
		});

		this.socket.on('deleteConversation', data => {
			if (this.isCurrentListener(data.deletedConversation)) {
				this.store.dispatch(new DeleteConversation(data.deletedConversation.conversationId));

				if (this.conversations$.length) {
					this.selectedConversation = this.conversations$[0];
					this.setConversationId(this.selectedConversation.conversationId)
				} else {
					this.messages = [];
					this.selectedConversation = null;
					localStorage.removeItem('selectedConversationId');
				}

				this.activeConversationsId = this.activeConversationsId.filter(id => id !== data.deletedConversation.conversationRecipient);

				this.store.pipe(select('userPage'))
					.pipe(takeUntil(this.unsubscribe$))
					.subscribe(
						data => this._setUsers(data['users'])
					);
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

	isCurrentListener(data) {
		return ((data.conversationRecipient === this.authorId) || (data.conversationAuthor.id === this.authorId))
	}

	isDesktop(): boolean {
		return window.document.body.clientWidth > 992;
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

	triggerFavorite() {
		const id = this.selectedConversation.conversationId;
		const favorite = this.selectedConversation.favorite;

		if (this.authorId === this.selectedConversation.conversationRecipient) {
			favorite.recipient = !this.selectedConversation.favorite.recipient
		} else {
			favorite.author = !this.selectedConversation.favorite.author
		}

		this.chatService.setFavoriteConversation(id, favorite)
			.pipe(
				takeUntil(this.unsubscribe$)
			)
			.subscribe()
	}

	getSender(conversation: Conversation) {
		if (conversation.conversationAuthor.id === this.authorId) {
			return 'author'
		}

		return 'recipient';
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
				() => {
					this.selectedConversation = this.conversations$.find(item => item.conversationId === this.getConversationId());
					this.socket.emit('newConversation', {conversation: this.selectedConversation});
					this.activeConversationsId.push(this.selectedConversation.conversationRecipient);
					this.users$ = this.users$.filter(user => user._id !== this.selectedConversation.conversationRecipient);
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
					this.messages.push(response);
					this._setFirstMessages(this.messages);
					this.message = '';
				}
			)
	}

	_setFirstMessages(messages) {
		if (messages) {
			this.messages = messages.map((message, i, arr) => {
				if (i === 0) {
					message['isFirst'] = true;
					return message;
				}

				message['isFirst'] = (arr[i - 1].author._id || arr[i - 1].author) !== (message.author._id || message.author);
				return message;
			})
		}
	}

	isAuthorMessage(message) {
		return (message.author._id || message.author) === this.authorId;
	}

	onDelete() {
		const id = this.selectedConversation.conversationId;

		this.chatService.deleteConversation(id)
			.pipe(
				takeUntil(this.unsubscribe$),
				tap(() => {
					this.socket.emit('deleteConversation', {deletedConversation: this.selectedConversation});
				}),
				switchMap(() => this.store.pipe(select('userPage'))),
				tap(data => {
					this.activeConversationsId = this.activeConversationsId.filter(id => id !== this.selectedConversation.conversationRecipient);
					this._setUsers(data['users']);

					this.store.dispatch(new DeleteConversation(id));

					if (this.conversations$.length) {
						this.selectedConversation = this.conversations$[0];
						this.setConversationId(this.selectedConversation.conversationId)
					} else {
						this.selectedConversation = null;
						localStorage.removeItem('selectedConversationId');
						this.messages = [];
					}
				}),
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
