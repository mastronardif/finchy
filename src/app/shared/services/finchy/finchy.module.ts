import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinchyServiceConfig } from './finchy.service';
//import { FinchyConfig } from './finchy.config';
// export * from './finchy.service';
// export * from './finchy.config';
// export * from './finchy.global.config';
// export declare class FinchyModule {
//     static forRoot(): ModuleWithProviders;
// }

@NgModule({
  imports:      [ CommonModule ],
  // declarations: [ GreetingComponent ],
  // exports:      [ GreetingComponent ]
})
export  class FinchyModule {
  //static forRoot(): ModuleWithProviders;

  constructor(@Optional() @SkipSelf() parentModule?: FinchyModule) {
    if (parentModule) {
      throw new Error(
        'FinchyModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: FinchyServiceConfig): ModuleWithProviders<FinchyModule> {
    return {
      ngModule: FinchyModule,
      providers: [
        {provide: FinchyServiceConfig, useValue: config }
      ]
    };
  }
}
