# AOS Extension for ACA

This project provides an extension for [Alfresco Content Application](https://github.com/Alfresco/alfresco-content-app) 1.5. 

A new `Office` button is added to `Open with` menu. When the button is clicked, Microsoft Office protocol is invoked so local Office Program is launched. 

It's required an Alfresco Repository includig [AOS feature properly configured](https://github.com/keensoft/docker-alfresco/wiki/Configuring-AOS-Module-%28SharePoint-protocol%29).

Please also refer to the [ACA Extensibility](https://alfresco.github.io/alfresco-content-app/#/extending) documentation.

This project contains:

- Blank Angular application
- AOES extension for ACA including a new `Office` button to `Open with` menu
- ADF dependencies (Extensions, Core and Content Services)
- Scripts to build, package and publish the extension

See also the official [ACA Extension Sample](https://github.com/Alfresco/aca-extension-example) from Alfresco.



## Building

```sh
$ npm run build:aos-extension
```

## Testing with local ACA instance

Build and package the extension library locally without publishing to NPM:

```sh
$ npm run package:aos-extension
```

The script produces the `dist/aos-extension/aos-extension-0.0.1.tgz` file that can be used to be installed as dependency.

Download a new **ACA project** to integrate your extension.

```sh
$ wget https://github.com/Alfresco/alfresco-content-app/archive/development.zip
$ unzip development.zip
$ cd alfresco-content-app-development/
```

Install project dependencies and install also your extension into download ACA application.

```sh
$ npm install

$ npm i ../aca-extension-aos/dist/aos-extension/aos-extension-0.0.1.tgz
```

Update the `extensions.module.ts` file and append the module.

```sh
$ vi src/app/extensions.module.ts
```

```ts
import { AosExtensionModule } from 'aos-extension';

@NgModule({
  imports: [
    ...,
    AosExtensionModule
  ]
})
export class AppExtensionsModule {}
```

Update the `app.extensions.json` file and register new plugin

```sh
$ vi src/assets/app.extensions.json
```

```json
{
  "$schema": "../../extension.schema.json",
  "$name": "app",
  "$version": "1.0.0",
  "$references": [
    ...,
    "aos.plugin.json"
  ],
}
```

Copy original plugin from extension `dist/assets/aos.plugin.json` to the ACA application `src/assets/plugins` folder.

```sh
$ cp ../dist/aos-extension/assets/aos.plugin.json src/assets/plugins
```

Run the ACA application

```sh
npm start
```

Depending on the setup, you might need to log in as an administrator and enable external plugins feature for your local run.