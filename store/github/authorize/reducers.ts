import { Reducer } from "../../../lib/reducer";
import { GitHubAuthorizeState } from "./state";
import { ResponseAuthorizeSuccessPayload } from "./actions";
import { maybe } from "../../../lib/maybe";

export const requestAuthorizeGitHubReducer: Reducer<GitHubAuthorizeState> = (state) => ({ ...state, authorizing: true });

export const responseAuthorizeGitHubSuccessReducer: Reducer<GitHubAuthorizeState, ResponseAuthorizeSuccessPayload> = (state, payload) => ({
  ...state,
  session: maybe(payload),
});
