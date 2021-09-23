import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserSession } from '../shared/domain/user';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isAuthorized } from '../auth/+state/auth.selectors';


@Injectable({
	providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

	constructor(private router: Router, private store: Store<UserSession>) { }

	canActivate(
		_route: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot): Observable<boolean> {

		return this.store
			.pipe(
				select(isAuthorized),
				tap(authorized => {
					if (!authorized) {
						this.router.navigateByUrl('/forbidden');
					}
				})
			)


	}
}
