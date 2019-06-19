import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";

import {Category} from "../interfaces";
import {Message} from "../interfaces";
import {AppState} from "../redux/app.state";
import {AddCategory, DeleteCategory, GetCategories, UpdateCategory} from "../redux/categories/categories.action";
import {catchError, map, tap} from "rxjs/operators";
import {MaterialService} from "../classes/material.service";

@Injectable({
	providedIn: 'root'
})
export class CategoriesService {
	constructor(private http: HttpClient, private store: Store<AppState>, private router: Router) {
	}

	fetch(): Observable<Category[] | null> {
		return this.http.get<Category[]>('/api/category')
			.pipe(
				map(response => {
					this.store.dispatch(new GetCategories(response));
					return response
				}),
				catchError(error => {
					MaterialService.toast(error.error.message);
					return of(null)
				})
			)
	}

	getById(id: string): Observable<Category> {
		return this.http.get<Category>(`/api/category/${id}`)
	}

	create(name: string, image?: File): Observable<Category> {
		const fd = new FormData();

		if (image) {
			fd.append('image', image, image.name)
		}
		fd.append('name', name);

		return this.http.post<Category>('/api/category', fd)
			.pipe(
				tap(response => {
					this.store.dispatch(new AddCategory(response));
				}));
	}

	update(id: string, name: string, image?: File): Observable<Category> {
		const fd = new FormData();

		if (image) {
			fd.append('image', image, image.name)
		}
		fd.append('name', name);

		return this.http.patch<Category>(`/api/category/${id}`, fd)
			.pipe(
				tap(response => {
					this.store.dispatch(new UpdateCategory(response));
				})
			);
	}

	delete(id: string): void {
		this.http.delete<Message>(`/api/category/${id}`)
			.subscribe(
				response => {
					this.store.dispatch(new DeleteCategory(id));
					MaterialService.toast(response.message);
				},
				error => {
					MaterialService.toast(error.error.message)
				},
				() => this.router.navigate(['/categories']));
	}
}
