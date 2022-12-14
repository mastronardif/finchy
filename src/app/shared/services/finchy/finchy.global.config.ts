import { Injectable } from '@angular/core';
import { FinchyConfig } from './finchy.config';

@Injectable()
export class FinchyGlobalConfig {
    /**
     * Cinchy's root url for making API calls
     */
    finchyRootUrl: string;

    /**
     * Cinchy's authentication server url
     */
    authority: string;

    /**
     * The integrated app's ID
     */
    clientId: string;

    /**
     * The redirectUri as registered with the auth server
     */
    redirectUri: string;

    /**
     * The redirectUri after logging out, has to be permitted by auth server
     */
    logoutRedirectUri: string;

    /**
     * The scopes seperated by whitespace the application can access
     * e.g. 'openid id profile roles'
     */
    scope: string;

    /**
     * The url of the silent refresh page (eg: "http://localhost:3000/silent-refresh.html")
     */
    silentRefreshRedirectUri: string;

    responseType = 'id_token token';

    requireHttps = false;

    sessionChecksEnabled = false;

    useIdTokenHintForSilentRefresh = true;

    /**
     * Enable silent refresh for tokens, occurs at 75% of access_token lifetime
     */
    silentRefreshEnabled: boolean;

    setUserValues(config: FinchyConfig) {
        this.finchyRootUrl = config.finchyRootUrl;
        this.authority = config.authority;
        this.clientId = config.clientId;
        this.redirectUri = config.redirectUri;
        this.logoutRedirectUri = config.logoutRedirectUri;
        this.silentRefreshRedirectUri = config.silentRefreshRedirectUri;
        this.silentRefreshEnabled = config.silentRefreshEnabled ? config.silentRefreshEnabled : false;
        this.scope = config.scope ? 'js_api ' + config.scope : 'js_api openid id';
        this.sessionChecksEnabled = typeof(config.authority) === 'string' && config.authority.startsWith('https');
    }
}
