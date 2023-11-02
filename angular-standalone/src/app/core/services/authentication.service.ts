import { readFLPH } from "@/app/stores";
import { Injectable, computed, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";
import { Chip, Ui5Path } from "../types";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private httpClient = inject(HttpClient)

    logout() {
        return this.httpClient.get('/sap/public/bc/icf/logoff')
    }
}
