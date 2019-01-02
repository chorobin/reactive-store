import { PayloadOfActionCreator } from "../../../lib/action";

export enum GitHubActionType {
  RequestAuthorize = "REQUEST_AUTHORIZE",
  ResponseAuthorizeSuccess = "RESPONSE_AUTHORIZE_SUCCESS",
  ResponseAuthorizeError = "RESPONSE_AUTHORIZE_ERROR",
}

export const requestAuthorize = () => ({
  type: GitHubActionType.RequestAuthorize,
});

export type ResponseAuthorizeSuccessPayload = PayloadOfActionCreator<typeof responseAuthorizeSuccess>;

export const responseAuthorizeSuccess = (payload: { accessToken: string; idToken: string; expiresIn: number }) => ({
  type: GitHubActionType.ResponseAuthorizeSuccess,
  payload,
});
