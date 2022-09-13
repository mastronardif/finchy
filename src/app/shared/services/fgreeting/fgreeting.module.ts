import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FGreetingComponent } from './fgreeting.component';
import { FUserServiceConfig } from './fuser.service';


@NgModule({
  imports:      [ CommonModule ],
  declarations: [ FGreetingComponent ],
  exports:      [ FGreetingComponent ]
})
export class FGreetingModule {
  constructor(@Optional() @SkipSelf() parentModule?: FGreetingModule) {
    if (parentModule) {
      throw new Error(
        'FGreetingModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: FUserServiceConfig): ModuleWithProviders<FGreetingModule> {
    return {
      ngModule: FGreetingModule,
      providers: [
        {provide: FUserServiceConfig, useValue: config}
      ]
    };
  }
}
