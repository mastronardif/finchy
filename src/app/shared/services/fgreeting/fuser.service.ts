import { Injectable, Optional } from "@angular/core";
import { FinchyConfig } from "./finchy.config";

let nextId = 1;

export class FUserServiceConfig {
  userName = "Philip Marlowe";
  userName22 = "Philip Marlowe22";
  finchyConfig:FinchyConfig = {
    authority: "111",
    clientId: "222",
    redirectUri: "333"
  }
}


@Injectable({
  providedIn: "root",
})
export class FUserService {
  id = nextId++;
  _finchyConfig: FinchyConfig;

  constructor(
    @Optional() config?: FUserServiceConfig,
  ) {
    if (config) {
      this._userName = config.userName;
      this._userName22 = config.userName22;
      this._finchyConfig = config.finchyConfig;
    }
  }

  get userName() {
    // Demo: add a suffix if this service has been created more than once
    const suffix = this.id > 1 ? ` times ${this.id}` : "";
    return this._userName + suffix;
  }
  get userName22() {
    // Demo: add a suffix if this service has been created more than once
    const suffix = this.id > 1 ? ` times ${this.id}` : "";
    return this._finchyConfig; this._userName22 + suffix;
  }
  private _userName = "Sherlock Holmes00";
  private _userName22 = "Sherlock Holmes22";
}
