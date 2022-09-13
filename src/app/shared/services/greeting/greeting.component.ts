import { Component } from '@angular/core';
import { UserService } from '../greeting/user.service';
import { FinchyConfig } from './finchy.config';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
})
export class GreetingComponent {
  title = 'NgModules';
  user = '';
  user22: FinchyConfig = {
    authority: '',
    clientId: '',
    redirectUri: ''
  };

  constructor(userService: UserService) {
    this.user = userService.userName;
    this.user22 = userService._finchyConfig;
  }
}
