import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";

import {AnalyticsService} from "../shared/services/analytics.service";
import {OverviewPage} from "../shared/interfaces";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";

@Component({
	selector: 'app-overview-page',
	templateUrl: './overview-page.component.html',
	styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('tapTarget') tapTargetRef: ElementRef;

	taptarget: MaterialInstance;
	data$: Observable<OverviewPage>;
	yesterday = new Date();

	constructor(private service: AnalyticsService) {
	}

	ngOnInit() {
		this.data$ = this.service.getOverview();
	}

	ngAfterViewInit(): void {
		this.taptarget = MaterialService.initTapTarget(this.tapTargetRef);
	}

	ngOnDestroy(): void {
		this.taptarget.destroy();

		this.yesterday.setDate(this.yesterday.getDate() - 1);
	}

	openInfo() {
		this.taptarget.open();
	}

}
