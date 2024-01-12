import { EntityType, getEntityDimensions, getEntityMeasures } from '@metad/ocap-core'
import { ZodType, ZodTypeDef } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

export function zodToAnnotations(obj: ZodType<any, ZodTypeDef, any>) {
  return (<{ properties: any }>zodToJsonSchema(obj)).properties
}

/**
 * Make prompt for cube by entity type
 * 
 * @param entityType 
 * @returns string
 */
export function makeCubePrompt(entityType: EntityType): string {
  return JSON.stringify({
    name: entityType.name,
    caption: entityType.caption,
    dimensions: getEntityDimensions(entityType).map((dimension) => ({
      name: dimension.name,
      caption: dimension.caption,
      hierarchies: dimension.hierarchies?.map((item) => ({
        name: item.name,
        caption: item.caption,
        levels: item.levels?.filter(({levelType}) => levelType !== 1).map((item) => ({
          name: item.name,
          caption: item.caption,
        }))
      }))
    })),
    measures: getEntityMeasures(entityType).map((item) => ({
      name: item.name,
      caption: item.caption
    }))
  })
}
