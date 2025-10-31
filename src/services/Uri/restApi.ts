import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable, Subject, Subscription } from 'rxjs'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class restApi {
	constructor(private http: HttpClient) {
		this.errorSubscription = this.errorSubject.subscribe((errorMessage) => {
			console.log('Caught error:', errorMessage)
		})
	}
	errorSubject: Subject<string> = new Subject<string>()
	errorSubscription: Subscription | undefined

	post(url: string, body: any = {}): Observable<any> {
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.post(url, JSON.stringify(body), { headers });
	}
	get(url: string, params?: any): Observable<any> {
		let httpParams = new HttpParams();
		
		if (params) {
			Object.keys(params).forEach(key => {
				if (params[key] !== null && params[key] !== undefined) {
					httpParams = httpParams.set(key, params[key].toString());
				}
			});
		}

		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.get(url, { headers, params: httpParams });
	}
}

