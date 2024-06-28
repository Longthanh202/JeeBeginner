
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';

@Injectable()
export class TokenStorage implements OnDestroy {
	private unsubscribe: Subscription[] = [];
	/**
	 * Get access token
	 * @returns {Observable<string>}
	 */
	public getAccessToken(): Observable<string> {

		var token: string
		if(localStorage.getItem('accessToken')==null){
			 token =''
		}else{
			token = localStorage.getItem('accessToken')
		}
		return of(token);
	}

	/**
	 * Set access token
	 * @returns {TokenStorage}
	 */
	public setAccessToken(token: string): TokenStorage {
		localStorage.setItem('accessToken', token);
		return this;
	}
	public getOneSignalInit(): Observable<string> {

		var token: string
		if(localStorage.getItem('oneSignalInit')==null){
			 token =''
		}else{
			token = localStorage.getItem('oneSignalInit')
		}
		return of(token);
	}
	public getIDMay(): Observable<string> {

		var token: string
		if(localStorage.getItem('idMay')==null){
			 token =''
		}else{
			token = localStorage.getItem('idMay')
		}
		return of(token);
	}
	public setOneSignalInit(token: string): TokenStorage {
		localStorage.setItem('oneSignalInit', token);
		return this;
	}
		/**
	 * Set refresh token
	 * @returns {TokenStorage}
	 */
	public setRefreshToken(token: string): TokenStorage {
		localStorage.setItem('refreshToken', token);
		return this;
	}

	/**
	 * Get refresh token
	 * @returns {Observable<string>}
	 */
	public getRefreshToken(): Observable<string> {
		const token: string = <string>localStorage.getItem('refreshToken');
		return of(token);
	}

	/**
	 * Get pageSize
	 * @returns {Observable<string>}
	 */
	public getPageSize(): Observable<string> {
		const size: string = "10";
		return of(size);
	}


	public setIDUser(iduser: string): TokenStorage {
		localStorage.setItem('idUser', iduser);
		return this;
	}

	public getIDUser(): Observable<string> {
		const Id: string = <string>localStorage.getItem('idUser');
		return of(Id);
	}
	/**
	 * Get user roles in JSON string
	 * @returns {Observable<any>}
	 */
	public getUserRoles(): Observable<any> {
		const roles: any = localStorage.getItem('userRoles');
		try {
			return of(JSON.parse(roles));
		} catch (e) {}
	}

	/**
	 * Set user roles
	 * @param roles
	 * @returns {TokenStorage}
	 */
	public setUserRoles(roles: any): any {
		if (roles != null) {
			localStorage.setItem('userRoles', JSON.stringify(roles));
		}
		return this;
	}

	/**
	 * Remove tokens
	 */
	public clear() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('userRoles');
		//localStorage.removeItem('idUser');
	}

	public setLogoCus(iduser: string): TokenStorage {
		localStorage.setItem('LogoCus', iduser);
		return this;
	}

	public getLogoCus(): Observable<string> {
		const Id: string = <string>localStorage.getItem('LogoCus');
		return of(Id);
	}

	/**
	 * Get user roles in JSON string
	 * @returns {Observable<any>}
	 */
	public getMenuRoles(): Observable<any> {
		const roles: any = localStorage.getItem('menuRoles');
		try {
			return of(JSON.parse(roles));
		} catch (e) {}
	}

	/**
	 * Set user roles
	 * @param roles
	 * @returns {TokenStorage}
	 */
	public setMenuRoles(roles: any): any {
		if (roles != null) {
			localStorage.setItem('menuRoles', JSON.stringify(roles));
		}
		return this;
	}

	/**
	 * Set Url of cookie
	 * @param roles
	 * @returns {TokenStorage}
	 */
	public setUrl(roles: any): any {
		if (roles != null) {
			localStorage.setItem('url', JSON.stringify(roles));
		}
		return this;
	}


	/**
	 * Get Url of cookie
	 * @returns {Observable<any>}
	 */
	public getUrl(): Observable<any> {
		const roles: any = localStorage.getItem('url');
		try {
			return of(JSON.parse(roles));
		} catch (e) {}
	}


	public setUserCustomer(iduser: string): TokenStorage {
		localStorage.setItem('Username', iduser);
		return this;
	}

	public getUserCustomer(): Observable<string> {
		const Id: string = <string>localStorage.getItem('Username');
		return of(Id);
	}

	public setUserData(data: any): TokenStorage {

		localStorage.setItem('currentUser', JSON.stringify(data));
		return this;
	}

	public getUserData():Observable<any> {


		const user: any = localStorage.getItem('currentUser');
		try {
			return of(JSON.parse(user));
		} catch (e) {}
	}


	setToken(token) {
		return localStorage.setItem('token', token);
	  }

	  getToken() {
		return localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
	  }
	  ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	  }
}
