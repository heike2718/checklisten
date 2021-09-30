import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { ExecuteChecklisteComponent } from "./execute-checkliste.component";

@Injectable()
export class DeactivateExecutionNavigationGuard implements CanDeactivate<ExecuteChecklisteComponent> {

    constructor() { }

    canDeactivate(component: ExecuteChecklisteComponent
        , _currentRoute: ActivatedRouteSnapshot
        , _currentState: RouterStateSnapshot
        , _nextState: RouterStateSnapshot
    ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
        return component.canDeactivate();
    }
}