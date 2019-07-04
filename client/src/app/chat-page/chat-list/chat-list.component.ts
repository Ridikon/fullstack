import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from "rxjs";
import {switchMap, tap} from "rxjs/operators";

import {UsersService} from "../../shared/services/users.service";
import {Conversation, User} from "../../shared/interfaces";
import {ChatService} from "../../shared/services/chat.service";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
	selector: 'app-chat-list',
	templateUrl: './chat-list.component.html',
	styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('modal') modalRef: ElementRef;

	users$: Observable<User[]>;
	conversations$: Observable<Conversation[]>;
	selectedUser: User;
	selectedConversation: Conversation;
	message: string;
	messages = [];
	conversationId: string;
	modal: MaterialInstance;
	chatName: string;
	myId: string;
	activeConversations: string[] = [];

	constructor(private usersService: UsersService, private chatService: ChatService) {
	}

	ngOnInit() {
		this.myId = localStorage.getItem('auth-id');
		this._getConversations();
	}

	ngOnDestroy(): void {
		this.modal.destroy();
	}

	ngAfterViewInit() {
		this.modal = MaterialService.initModal(this.modalRef);
	}

	_getConversations() {
		this.activeConversations = [];
		this.conversations$ = this.chatService.getConversations()
			.pipe(
				tap(
					(response) => {
						console.log('conversations', response)
						response.forEach(item => {
							if (item.conversationRecipient === this.myId) {
								this.activeConversations.push(item.author['_id']);
							}

							this.activeConversations.push(item.conversationRecipient)
						});

						this.selectedUser = null;
					}
				)
			)
	}

	getUsers() {
		console.log('getUsers')
		this.users$ = this.usersService.fetch()
			.pipe(
				switchMap(
					(res) => {
						console.log('users$', res)
						const users = res.filter(item => {
							if (this.activeConversations.includes(item._id) || item._id === this.myId) {
								return;
							}
							return item;
						});

						return of(users)
					}
				)
			)
	}

	openModal() {
		this.modal.open();
		this.getUsers();
	}

	selectUser(user: User) {
		this.messages = [];
		this.conversationId = '';
		this.selectedUser = user;
		this.chatName = user.name;
		this.modal.close();
	}

	selectConversation(conversation) {
		console.log('selectedConversation', conversation)
		this.messages = [];
		this.conversationId = '';

		if (conversation.conversationId) {
			this.conversationId = conversation.conversationId;
		}

		this.selectedConversation = conversation;
		this.chatName = conversation.conversationAuthor;

		if (this.conversationId) {
			this.chatService.getConversation(this.conversationId)
				.subscribe(
					response => {
						this.messages = response.map(item => {
							item['myMessage'] = item.author._id === this.myId;
							return item;
						});
					}
				);
		}
	}

	isActive(conversation) {
		return this.selectedConversation === conversation;
	}

	onSend() {
		const name = this.selectedUser ? this.selectedUser.name : this.selectedConversation.conversationName;
		if (!this.conversationId) {
			this.chatService.newConversation(this.selectedUser._id, this.message, name)
				.pipe(
					tap(response => {
						this.conversationId = response.conversationId;
						this._getConversations();
					}),
					switchMap(() => this.chatService.getConversation(this.conversationId))
				)
				.subscribe(response => {
					const conversation = response[0];
					const id = conversation.author._id || conversation.author;
					conversation['myMessage'] = id === this.myId;
					this.message = '';
					this.messages.push(conversation);
				});
		} else {
			const recipient = this.selectedConversation.conversationRecipient;
			this.chatService.sendReply(this.conversationId, this.message, name, recipient)
				.subscribe(
					response => {
						const conversation = response;
						const id = conversation.author._id || conversation.author;
						conversation['myMessage'] = id === this.myId;
						this.message = '';
						this.messages.push(conversation)
					}
				)
		}
	}

	deleteConversation(conversation) {
		this.chatService.deleteConversation(conversation.conversationId)
			.pipe(
				tap(() => {
					this._getConversations()
				})
			)
			.subscribe();
	}
}
