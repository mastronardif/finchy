import { Component } from '@angular/core';
import { FUserService } from './fuser.service';
import { FinchyConfig } from './finchy.config';

@Component({
  selector: 'app-greeting22',
  templateUrl: './fgreeting.component.html',
})
export class FGreetingComponent {
  title = 'NgModules';
  user = '';
  user22: FinchyConfig = {
    authority: '',
    clientId: '',
    redirectUri: ''
  };

  constructor(userService: FUserService) {
    this.user = userService.userName+' HHHHHHHHHH';
    this.user22 = userService._finchyConfig;
    //this.user22 = userService.userName22;
  }
}
