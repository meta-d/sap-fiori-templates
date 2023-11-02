import { readFLPH } from "@/app/stores";
import { Injectable, computed, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";
import { Chip, Ui5Path } from "../types";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FioriLaunchpadService {

    readonly state = signal<any>({})
    readonly state$ = toObservable(this.state)

    readonly routes = computed(() => {
        const { AssignedPages, Pages } = this.state()

        return AssignedPages?.results.map((item: any) => {

            const path = `/${Ui5Path}/${item.id}`

            const submenus = Pages.results.find((g: any) => g.id === item.id)?.PageChipInstances.results.map((page: any) => {
                const chipBag = page.Chip.ChipBags.results.find((bag: any) => bag.id === "tileProperties")
                const chipTitle = chipBag.ChipProperties.results.find((prop: any) => prop.name === "display_title_text")
                const configuration = JSON.parse(page.Chip.configuration)
                const tileConfiguration = JSON.parse(configuration.tileConfiguration)
                return {
                    path: `${path}/${tileConfiguration.navigation_semantic_object}`,
                    id: page.instanceId,
                    title: chipTitle?.value,
                    route: {
                        path: tileConfiguration.navigation_semantic_object,
                    },
                    isUi5: true,
                    data: tileConfiguration,
                    queryParams: {
                        action: tileConfiguration.navigation_semantic_action,
                    }
                }
            })

            return {
                id: item.id,
                path,
                title: item.title,
                route: {
                    path: item.id,
                },
                hasSubmenus: true,
                submenus,
                isUi5: true
            }
        })
    })

    constructor() {
        this.loadFLPMenus().then()
    }

    async loadFLPMenus() {
        const result = await readFLPH()
        this.state.set(result)
    }

    getPage(id: string) {
        return this.state().Pages.results.find((item: any) => item.id === id)
    }

    selectGroupChips(id: string): Observable<Chip[]> {
        return this.state$.pipe(
            map((state) => state.Pages?.results.find((item: any) => item.id === id)?.PageChipInstances.results.map(mapChip))
        )
    }

}

export function mapChip(item: any/*odata result*/): Chip {
    const id = item.instanceId
    const chipBag = item.Chip.ChipBags.results.find((bag: any) => bag.id === "tileProperties")
    const chipTitle = chipBag.ChipProperties.results.find((prop: any) => prop.name === "display_title_text")
    const chipSubTitle = chipBag.ChipProperties.results.find((prop: any) => prop.name === "display_subtitle_text")
    const configuration = JSON.parse(item.Chip.configuration)
    const tileConfiguration = JSON.parse(configuration.tileConfiguration)
    return {
        id,
        title: chipTitle?.value,
        subTitle: chipSubTitle?.value,
        navigationSemanticObject: tileConfiguration.navigation_semantic_object,
        navigationSemanticAction: tileConfiguration.navigation_semantic_action
    }
}