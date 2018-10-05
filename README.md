# AOS Extension for ACA

This project was developed during [Alfresco Global Virtual Hack-a-thon 2018](https://community.alfresco.com/docs/DOC-7962-projects-and-teams-global-virtual-hack-a-thon-2018)  

This project provides an extension for [Alfresco Content Application](https://github.com/Alfresco/alfresco-content-app) 1.5. 

A new `Office` button is added to `Open with` menu. When the button is clicked, Microsoft Office protocol is invoked so local Office Program is launched. 

It's required an Alfresco Repository includig [AOS feature properly configured](https://github.com/keensoft/docker-alfresco/wiki/Configuring-AOS-Module-%28SharePoint-protocol%29).

Please also refer to the [ACA Extensibility](https://alfresco.github.io/alfresco-content-app/#/extending) documentation.

This project contains:

- Blank Angular application
- AOS extension for ACA including a new `Office` button to `Open with` menu
- ADF dependencies (Extensions, Core and Content Services)
- Scripts to build, package and publish the extension

See also the official [ACA Extension Sample](https://github.com/Alfresco/aca-extension-example) from Alfresco.


## Adding extensions to ACA

**Caution**: Since ADF / ACA is evolving fast, this repository could be obsolete in the future.

This plugin includes a new *Action* for the feature *Open With* in the Viewer. You can find documentation related to Actions for ACA Extension at 

[https://alfresco.github.io/alfresco-content-app/#/extending?id=actions](https://alfresco.github.io/alfresco-content-app/#/extending?id=actions)

Action configuration is performed on a JSON file following [extension.schema.json](https://github.com/keensoft/aca-extension-aos/blob/master/extension.schema.json) specification. Following configuration has been defined for this plugin in [aos.plugin.json](https://github.com/keensoft/aca-extension-aos/blob/master/projects/aos-extension/assets/aos.plugin.json) file:

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "aos.plugin",
    "$description": "AOS Plugin",

    "actions": [
        {
            "id": "aos.plugin.actions.info",
            "type": "AOS_ACTION",
            "payload": "$(context.selection.first.entry)"
        }
    ],

    "features": {
        "viewer": {
            "openWith": [
                {
                    "id": "aos.plugin.viewer.openWith.action1",
                    "type": "button",
                    "icon": "build",
                    "title": "Office",
                    "actions": {
                        "click": "aos.plugin.actions.info"
                    }
                }
            ]
        }
    }
}
```

The **action** part includes the type `AOS_ACTION` and the payload. The *type* name is used to develop the Action and the Effect in Typescript. The *payload* can be any data value from any data type. It can be also an expression with the format `$(<expresion>)`, as in the above sample, where a complex Entry object is sent in the payload.

The **features** part includes the feature type and also a block to include different actions. In this case, a `click` on the element will invoke `aos.plugin.actions.info` action. 

To define the Action and the Payload type are defined as an [@ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510) Action in [aos.actions.ts](https://github.com/keensoft/aca-extension-aos/blob/master/projects/aos-extension/src/lib/actions/aos.actions.ts)

In this case `$(context.selection.first.entry)`, the payload expression, is a `MinimalNodeEntryEntity` object from `alfresco-js-api`.

```ts
import { Action } from '@ngrx/store';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

export const AOS_ACTION = 'AOS_ACTION';

export class AosAction  implements Action {

	// Action Type
    readonly type = AOS_ACTION;

    // Payload Type
    constructor(public payload: MinimalNodeEntryEntity) {}
}
```

The Effect of the Action is defined in [aos.effects.ts](https://github.com/keensoft/aca-extension-aos/blob/master/projects/aos-extension/src/lib/effects/aos.effects.ts). In this case, the Action is calling to `AosEditOnlineService.onActionEditOnlineAos()` method, where the invocation to Office local program is performed.

```ts
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { AOS_ACTION, AosAction } from '../actions/aos.actions';
import { AosEditOnlineService } from '../aos-extension.service';

@Injectable()
export class AosEffects {
  constructor(
    private actions$: Actions,
    private aosEditOnlineService: AosEditOnlineService
  ) {}

  @Effect({ dispatch: false })
  openOffice$ = this.actions$.pipe(
    ofType<AosAction>(AOS_ACTION),
    map(action => {
      if (action.payload) {
        this.aosEditOnlineService.onActionEditOnlineAos(action.payload);
      }
    })
  );
}
```

After that, a module configuration including developed components, services and effects must be done at [aos-extension.module.ts](https://github.com/keensoft/aca-extension-aos/blob/master/projects/aos-extension/src/lib/aos-extension.module.ts)

```ts
import { ExtensionService } from '@alfresco/adf-extensions';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { AosExtensionComponent } from './aos-extension.component';
import { AosEditOnlineService } from './aos-extension.service';
import { AosEffects } from './effects/aos.effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([AosEffects])
  ],
  declarations: [AosExtensionComponent],
  exports: [AosExtensionComponent],
  entryComponents: [AosExtensionComponent],
  providers: [ AosEditOnlineService]
})
export class AosExtensionModule {
  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      'aos-edit-online.main.component': AosExtensionComponent
    });
  }
}
```

And finally a public declaration of elements to be used by other modules is done at [public_api.ts](https://github.com/keensoft/aca-extension-aos/blob/master/projects/aos-extension/src/public_api.ts)

```ts
export * from './lib/aos-extension.service';
export * from './lib/aos-extension.component';
export * from './lib/aos-extension.module';
export * from './lib/actions/aos.actions';
export * from './lib/effects/aos.effects';
```

This plugin can be used by ACA as an extension from NPM or from local packaging.


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

>> **Caution**: Since ADF / ACA is evolving fast, following instructions could be different for your ACA version. This project has been developed by using a *1.5-beta* version.

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