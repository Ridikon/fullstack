import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";

@Component({
	selector: 'app-order-page',
	templateUrl: './order-page.component.html',
	styleUrls: ['./order-page.component.scss'],
	providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('modal') modalRef: ElementRef;
	isRoot: boolean;
	modal: MaterialInstance;
	pending = false;
	oSub: Subscription;

	constructor(
		private router: Router,
		public order: OrderService,
		private ordersService: OrdersService
	) {}

	ngOnInit() {
		this.isRoot = this.router.url === '/order';
		this.router.events.subscribe(
			event => {
				if (event instanceof NavigationEnd) {
					this.isRoot = this.router.url === '/order';
				}
			}
		)
	}

	ngAfterViewInit(): void {
		this.modal = MaterialService.initModal(this.modalRef);
	}

	ngOnDestroy(): void {
		if (this.oSub) {
			this.oSub.unsubscribe();
		}

		this.modal.destroy();
	}

	open() {
		this.modal.open();
	}

	cancel() {
		this.modal.close();
	}

	submit() {
		this.pending = true;

		this.modal.close();

		const order: Order = {
			list: this.order.list.map(item => {
				delete item._id;
				return item;
			})
		};

		this.oSub = this.ordersService.create(order).subscribe(
			newOrder => {
				MaterialService.toast(`Замовлення №${newOrder.order} було додано`);
				this.order.clear();
			},
			error => MaterialService.toast(error.error.message),
			() => {
				this.modal.close();
				this.pending = false;
			}
		)
	}

	removePosition(orderPosition: OrderPosition) {
		this.order.remove(orderPosition);
	}
}
