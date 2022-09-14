import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

//import { CinchyModule} from '@cinchy-co/angular-sdk';
//import { FinchyModule } from './shared/services/finchy.module';
/* Feature Modules */
import { GreetingModule } from './shared/services/greeting/greeting.module';

import { FinchyService } from './shared/services/finchy/finchy.service';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FinchyModule } from './shared/services/finchy/finchy.module';
import { FinchyConfig } from './shared/services/greeting/finchy.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    GreetingModule.forRoot({
      userName: 'Miss Marple',
      //userName22: 'pppppp',
      finchyConfig: {authority:'', clientId:'cccc',redirectUri:'',finchyRootUrl:'',logoutRedirectUri:'',scope:'',silentRefreshEnabled:true, silentRefreshRedirectUri:''}
    }),

    FinchyModule.forRoot({
      finchyConfig: { authority: '', clientId: 'cccc', redirectUri: 'http://localhost:4200/', finchyRootUrl: 'http://localhost:9000', logoutRedirectUri: '', scope: '', silentRefreshEnabled: true, silentRefreshRedirectUri: '' },
      userName: '',
      userName22: ''
    }),


    //CinchyModule.forRoot(),
    //FinchyModule.forRoot(),
    // FinchyModule.forRoot({
    //   finchyRootUrl: 'Miss Marple',
    //   authority: '',
    //   clientId: '',
    //   redirectUri: ''
    // }),
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatInputModule
  ],
  providers: [FinchyService],
  //providers: [CinchyModule, FinchyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
