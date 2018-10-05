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
