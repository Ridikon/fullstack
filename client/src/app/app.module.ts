import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {RegisterPageComponent} from './register-page/register-page.component';
import {TokenInterceptor} from "./shared/classes/token.interceptor";
import {SharedModule} from "./shared/shared.module";
import {categoriesReducer} from "./shared/redux/categories/categories.reducer";

@NgModule({
	declarations: [
		AppComponent,
		LoginPageComponent,
		AuthLayoutComponent,
		SiteLayoutComponent,
		RegisterPageComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		SharedModule,
		StoreModule.forRoot({}),
		StoreModule.forFeature('categoriesPage', categoriesReducer),
		StoreDevtoolsModule.instrument({
			maxAge: 10
		})
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			multi: true,
			useClass: TokenInterceptor
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
