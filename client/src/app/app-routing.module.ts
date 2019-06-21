import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginPageComponent} from "./login-page/login-page.component";
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {AuthGuard} from "./shared/classes/auth.guard";

const routes: Routes = [
	{
		path: '',
		component: AuthLayoutComponent,
		children: [
			{path: '', redirectTo: '/login', pathMatch: 'full'},
			{path: 'login', component: LoginPageComponent},
			{path: 'register', component: RegisterPageComponent}
		]
	},
	{
		path: '',
		component: SiteLayoutComponent,
		canActivate: [AuthGuard],
		children: [
			{path: 'overview', loadChildren: './overview-page/overview.module#OverviewModule'},
			{path: 'analytics', loadChildren: './analytics-page/analytics.module#AnalyticsModule'},
			{path: 'history', loadChildren: './history-page/history.module#HistoryModule'},
			{path: 'order', loadChildren: './order-page/order.module#OrderModule'},
			{path: 'categories', loadChildren: './categories-page/categories.module#CategoriesModule'},
			{path: 'users', loadChildren: './users-page/users.module#UsersModule', canLoad: [AuthGuard]},
			{path: 'profile', loadChildren: './profile-page/profile.module#ProfileModule'}
		]
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
