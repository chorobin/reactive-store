import { Maybe } from "../../../lib/maybe";

export interface GitHubAuthorizeSessionState {
  readonly accessToken: string;
  readonly idToken: string;
  readonly expiresIn: number;
}

export interface GitHubAuthorizeState {
  readonly authorizing: boolean;
  readonly session: Maybe<GitHubAuthorizeSessionState>;
}
