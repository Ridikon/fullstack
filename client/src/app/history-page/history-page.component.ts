import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";

const STEP = 4;

@Component({
	selector: 'app-history-page',
	templateUrl: './history-page.component.html',
	styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('tooltip') tooltipRef: ElementRef;
	tooltip: MaterialInstance;
	oSub: Subscription;
	isFilterVisible = false;
	orders: Order[] = [];
	offset = 0;
	limit = STEP;
	loading = false;
	reloading = false;
	noMoreOrders = false;
	filter: Filter = {};

	constructor(private ordersService: OrdersService) {
	}

	ngOnDestroy(): void {
		this.tooltip.destroy();
		this.oSub.unsubscribe();
	}

	ngOnInit() {
		this.reloading = true;
		this.fetch();
	}

	ngAfterViewInit(): void {
		this.tooltip = MaterialService.initTooltip(this.tooltipRef);
	}

	private fetch() {
		const params = Object.assign({}, this.filter, {
				offset: this.offset,
				limit: this.limit
		});

		this.oSub = this.ordersService.fetch(params).subscribe(
			orders => {
				this.orders = this.orders.concat(orders);
				this.noMoreOrders = orders.length < STEP;
				this.loading = false;
				this.reloading = false;
			}
		);
	}

	loadMore() {
		this.offset += STEP;
		this.loading = true;
		this.fetch();
	}

	applyFilter(filter: Filter) {
		this.orders = [];
		this.offset = 0;
		this.filter = filter;
		this.reloading = true;

		this.fetch();
	}

	isFiltered(): boolean {
		return Object.keys(this.filter).length !== 0;
	}

}
