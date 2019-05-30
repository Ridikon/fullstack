import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";

import {PositionsService} from "../../shared/services/positions.service";
import {Position} from "../../shared/interfaces";
import {map, switchMap} from "rxjs/operators";
import {Params} from "@angular/router/src/shared";
import {OrderService} from "../order.service";
import {MaterialService} from "../../shared/classes/material.service";

@Component({
	selector: 'app-order-positions',
	templateUrl: './order-positions.component.html',
	styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit {

	positions$: Observable<Position[]>;

	constructor(
		private route: ActivatedRoute,
		private positionsService: PositionsService,
		private order: OrderService
	) {}

	ngOnInit() {
		this.positions$ = this.route.params.pipe(
			switchMap(
				(params: Params) => {
					return this.positionsService.fetch(params['id']);
				}
			),
			map(
				(positions: Position[]) => {
					return positions.map(position => {
						position.quantity = 1;
						return position;
					})
				}
			)
		)
	}

	addToOrder(position: Position) {
		MaterialService.toast(`Добавлено x${position.quantity}`)
		this.order.add(position);
	}

}
