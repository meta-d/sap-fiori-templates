# AI 副驾驶

[**English**](../../copilot/Setup.md) | **中文**

## 如何安装

使用 Metad Copilot 框架之前需安装相关 npm 包：

- `@metad/copilot` Copilot 抽象层框架，不依赖具体 UI 框架。
- `@metad/ocap-angular` Copilot 框架在 Angular 上的实现。

及其依赖的包。

## 如何引入

在 Angular 项目中，使用 Copilot 框架的步骤如下：

1. 使用函数提供器提供 Copilot 服务和 Markdown 服务：

```ts
provideClientCopilot(async () => Promise.resolve(environment.copilot ?? { enabled: false, chatUrl: '' })),
provideMarkdown()
```

2. 引入 Copilot Chat 组件到使用它的组件中：

```ts
imports: [ NgmCopilotChatComponent ]
```

3. 在 html template 中插入此组件：

```html
<ngm-copilot-chat></ngm-copilot-chat>
```

## 自定义命令

Copilot 框架提供了一些默认的命令，但是也可以自定义命令。自定义命令需用到两个函数：

- `injectCopilotCommand` 注入自定义命令
- `injectMakeCopilotActionable` 注入自定义命令的可调用函数

### injectCopilotCommand

| 属性 | 例子 | 描述 |
|------|------|------|
| `name` | 'form' | 自定义命令的唯一标识，被用在副驾驶对话框提示语前来标识此命令 |
| `description` | 'Descripe how to fill the form' | 描述此命令的使用方法，提示用户如何编写提示语 |
| `examples` | `['A', 'B']` | 举例说明此命令提示语的编写方法，有利于用户快速输入提示语 |
| `actions` | `[]` | 此命令可用的操作函数实现，不指定则使用当前上下文中所有的操作函数 |

### injectMakeCopilotActionable

| 属性 | 例子 | 描述 |
|------|------|------|
| `name` | 'fill_form' | 操作函数的唯一标识，用于 AI 来识别调用此函数 |
| `description` | 'Fill the form' | 描述此函数的作用 |
| `argumentAnnotations` | `[]` | 函数的输入参数定义 |
| `implementation` | `async function` | 函数的实现逻辑，不返回值或返回字符串将结束命令会话，返回 Message 则会继续命令会话 |

argumentAnnotations:

| 属性 | 例子 | 描述 |
|------|------|------|
| `name` | 'fill_form' | 函数输入参数的名称 |
| `type` | 'string' | 参数类型 |
| `description` | 'Fill the form' | 参数描述 |
| `required` | `true` | 是否必填 |
| `properties` | `[]` | 函数输入参数的属性定义 |

对于 `properties` 属性可以直接定义，也可以使用 [zod](https://zod.dev/) 库来定义，例如：

```typescript
import { z, ZodType, ZodTypeDef } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

{
    properties: (<{ properties: any }>zodToJsonSchema(z.object({
                title: z.string().describe('表单标题'),
                desc: z.string().describe('我的阶段性工作目标'),
                standard: z.string().describe('我的满意度衡量标准'),
              }))).properties
}
```

## Demo

Copilot 框架提供了一个 Demo 项目，可以参考它的实现：

https://stackblitz.com/~/github.com/tiven-w/metad-copilot-demo

也可以参考本项目中的演示代码：

[AI Copilot Form](../../../btp-cap-monorepo/apps/launchpad/src/app/demo/copilot/base/base.component.ts)