import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { ConfigureChecklisteComponent } from "./configure-checkliste.component";

@Injectable()
export class DeactivateConfigurationNavigationGuard implements CanDeactivate<ConfigureChecklisteComponent> {

    constructor() { }

    canDeactivate(component: ConfigureChecklisteComponent
        , _currentRoute: ActivatedRouteSnapshot
        , _currentState: RouterStateSnapshot
        , _nextState: RouterStateSnapshot
    ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
        return component.canDeactivate();
    }
}