/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { IProvider, ProviderState, createFromProvider } from '@microsoft/mgt-element';
import { loadConfiguration, TeamsUserCredential } from '@microsoft/teamsfx';

/**
 * Interface to define the configuration when creating a TeamsFxProvider
 *
 * @export
 * @interface TeamsConfig
 */
export interface TeamsConfig {
  /**
   * The app clientId
   *
   * @type {string}
   * @memberof TeamsConfig
   */
  clientId: string;
  /**
   * Endpoint of auth service provisioned by Teams Framework. Default value comes from SIMPLE_AUTH_ENDPOINT environment variable.
   *
   * @type {string}
   * @memberof TeamsConfig
   */
  simpleAuthEndpoint: string;
  /**
   * Login page for Teams to redirect to.  Default value comes from INITIATE_LOGIN_ENDPOINT environment variable.
   *
   * @type {string}
   * @memberof TeamsConfig
   */
  initiateLoginEndpoint: string;
  /**
   * The scopes to use when authenticating the user
   *
   * @type {string[]}
   * @memberof TeamsConfig
   */
  scopes: string[];
}

/**
 * TeamsFx Provider handler
 *
 * @export
 * @class TeamsFxProvider
 * @extends {IProvider}
 */
export class TeamsFxProvider extends IProvider {
  /**
   * returns _idToken
   *
   * @readonly
   * @type {boolean}
   * @memberof TeamsFxProvider
   */
  get isLoggedIn(): boolean {
    return !!this._idToken;
  }

  /**
   * Name used for analytics
   *
   * @readonly
   * @memberof IProvider
   */
  public get name() {
    return 'MgtTeamsFxProvider';
  }

  /**
   * returns _credential
   *
   * @readonly
   * @memberof TeamsUserCredential
   */
  get credential() {
    return this._credential;
  }

  /**
   * privilege level for authentication
   *
   * @type {string[]}
   * @memberof SharePointProvider
   */
  public scopes: string[] = [];

  private _credential: TeamsUserCredential;
  /**
   * authority
   *
   * @type {string}
   * @memberof SharePointProvider
   */
  public authority: string = '';
  private _idToken: string = '';

  constructor(config: TeamsConfig) {
    super();
    this.scopes = config.scopes!;

    loadConfiguration({
      authentication: {
        initiateLoginEndpoint: config.initiateLoginEndpoint,
        simpleAuthEndpoint: config.simpleAuthEndpoint,
        clientId: config.clientId,
      },
    });

    this._credential = new TeamsUserCredential();
    this.graph = createFromProvider(this);
    this.internalLogin();
  }

  /**
   * uses provider to receive access token via SharePoint Provider
   *
   * @returns {Promise<string>}
   * @memberof SharePointProvider
   */
  public async getAccessToken(): Promise<string> {
    let accessToken: string = '';
    accessToken = (await this.credential.getToken(this.scopes))?.token!;
    return accessToken;
  }
  /**
   * update scopes
   *
   * @param {string[]} scopes
   * @memberof SharePointProvider
   */
  public updateScopes(scopes: string[]) {
    this.scopes = scopes;
  }

  private async internalLogin(): Promise<void> {
    const credential = new TeamsUserCredential();
    const token = await this.credential.getToken(this.scopes);

    if (!!token && token.expiresOnTimestamp < +new Date()) {
      await credential.login(this.scopes);
    }

    this._idToken = await this.getAccessToken();
    this.setState(this._idToken ? ProviderState.SignedIn : ProviderState.SignedOut);
  }
}
