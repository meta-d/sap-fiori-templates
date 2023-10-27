# SAP Fiori App Templates

## 🌟 What is this?

This is a collection of templates which are builded by third-party frontend frameworks (Vue, Angular, React ...) for SAP Fiori apps. It is based on [Nx](https://nx.dev) and [UI5 Tooling](https://sap.github.io/ui5-tooling/).

## 📄 How to use

You can download the template under this code repository and then modify and deploy it, or you can build a project from scratch according to our creation steps.

We plan to provide project templates in multiple frameworks and multiple combinations. The templates that have been developed can all be used.

* [Vue standalone workspace](./sap-fiori-vue-standalone/)
* Angular standalone workspace
* React standalone workspace

### Nx

#### 🚀 Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).

## Best practices

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/core-features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/core-features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## 🍺 How to contribute

- Please give us :star: on Github, it **helps**!
- You are more than welcome to submit feature requests in the [sap-fiori-templates repo](https://github.com/meta-d/sap-fiori-templates/issues)
- Pull requests are always welcome! Please base pull requests against the _develop_ branch.

## 💌 Contact Us

- For business inquiries: <mailto:service@mtda.cloud>
- [Follow us on Twitter](https://twitter.com/CloudMtda)
- [Subscribe to the Metad Youtube Channel](https://www.youtube.com/channel/UCt6J-QN4atwD-9F73Me814A)