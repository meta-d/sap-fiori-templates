import { Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, map } from "rxjs";
import { useESHSearchStore } from "./ESH_SEARCH";

export interface AppStoreState {
    user?: {
        id: string;
        name: string;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AppStoreService {
    private state$ = new BehaviorSubject<AppStoreState>({})

    readonly user = toSignal(this.state$.pipe(map((state) => state.user)))

    async currentUser() {
        if (!this.user()) {
            await this.refreshUser()
        }

        return this.user()
    }

    async refreshUser() {
        const { read } = useESHSearchStore()
        const user = await read('Users', '<current>').then((result) => {
            return {
                id: result.d.Id,
                name: result.d.Name
            }
        })

        if (user) {
            this.state$.next({
                ...this.state$.value,
                user
            })
        }
    }
}
