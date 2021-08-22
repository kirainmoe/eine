import * as apiInstall from "./api/install";
import * as apiPublicInfo from './api/publicInfo';
import * as apiLogin from "./api/login";
import * as apiAccountInfo from './api/accountInfo';
import * as apiGroupInfo from './api/groupInfo';
import * as apiSendText from './api/sendText';
import * as apiFriendInfo from './api/friendInfo';
import magic from "./api/magic";

import * as panelInstall from "./panel/install";

export const api = {
  accountInfo: apiAccountInfo.default,
  install: apiInstall.default,
  friendInfo: apiFriendInfo.default,
  groupInfo: apiGroupInfo.default,
  login: apiLogin.default,
  publicInfo: apiPublicInfo.default,
  sendText: apiSendText.default,
  magic,
};

export const panel = {
  install: panelInstall.default,
}

export * as ws from "./ws";