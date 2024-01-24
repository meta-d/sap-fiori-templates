# AI Copilot

English | [**中文**](../zh/copilot/Setup.md)

## How to Setup

Before using the Metad Copilot framework, you need to install the relevant npm packages:

- `@metad/copilot`: The Copilot abstraction layer framework, independent of any specific UI framework.
- `@metad/ocap-angular`: The implementation of the Copilot framework on Angular.

And their respective dependencies.

## How to Include

In an Angular project, follow these steps to use the Copilot framework:

1. Use the provider function to provide the Copilot service and Markdown service:

```ts
provideClientCopilot(async () => Promise.resolve(environment.copilot ?? { enabled: false, chatUrl: '' })),
provideMarkdown()
```

2. Import the Copilot Chat component into the component that uses it:

```ts
imports: [ NgmCopilotChatComponent ]
```

3. Insert this component into the html template:

```html
<ngm-copilot-chat></ngm-copilot-chat>
```

## Custom Commands

The Copilot framework provides some default commands, but you can also customize them. Custom commands require two functions:

- `injectCopilotCommand` Inject custom commands
- `injectMakeCopilotActionable` Inject the callable function of the custom command

### injectCopilotCommand

| Property | Example | Description |
|------|------|------|
| `name` | 'form' | The unique identifier of the custom command, which is used to identify the command in front of the Copilot dialog prompt |
| `description` | 'Descripe how to fill the form' | Describes how to use this command, prompting the user how to write the prompt |
| `examples` | `['A', 'B']` | Examples of how to write the prompt for this command, which helps the user to quickly enter the prompt |
| `actions` | `[]` | The operation function implementation available for this command, if not specified, all operation functions in the current context will be used |

### injectMakeCopilotActionable

| Property | Example | Description |
|------|------|------|
| `name` | 'fill_form' | The unique identifier of the operation function, which is used by the AI to identify the call to this function |
| `description` | 'Fill the form' | Describes the function |
| `argumentAnnotations` | `[]` | The definition of the input parameters of the function |
| `implementation` | `async function` | The implementation logic of the function, returning no value or returning a string will end the command session, returning Message will continue the command session |

argumentAnnotations:

| Property | Example | Description |
|------|------|------|
| `name` | 'form' | The name of the input parameter |
| `type` | 'string' | The type of the parameter |
| `description` | 'The form to fill' | The description of the parameter |
| `required` | `true` | Whether the parameter is required |
| `properties` | `[]` | The property definition of the input parameter of the function |

For the `properties` attribute, you can define it directly or use the [zod](https://zod.dev/) library for definition, for example:

```ts
import { z, ZodType, ZodTypeDef } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

{
    properties: (<{ properties: any }>zodToJsonSchema(z.object({
                title: z.string().describe('The title of form'),
                desc: z.string().description('My Milestone Work Objectives'),
                standard: z.string().description('My Satisfaction Measurement Standard'),
              }))).properties
}
```

## Demo

The Copilot framework provides a demo project that you can refer to for its implementation:

https://stackblitz.com/~/github.com/tiven-w/metad-copilot-demo

You can also refer to the demonstration code in this project:

[AI Copilot Form](../../btp-cap-monorepo/apps/launchpad/src/app/demo/copilot/base/base.component.ts)
