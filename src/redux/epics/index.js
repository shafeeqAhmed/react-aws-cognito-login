// @flow
import { combineEpics } from "redux-observable";
import fetchUserProfile from "./fetchUserProfile";
import fetchScreenplayFiles from "./fetchScreenplayFiles";
import paste from "src/redux/modules/drive/epics/paste";
import downloadFile from "src/redux/modules/drive/epics/downloadFile";
import toggleSelected from "src/redux/modules/drive/epics/toggleSelected";
import fileNotifications from "src/redux/modules/drive/epics/notifications";
import fetchPolicySubjects from "src/redux/modules/gatekeeper/epics/fetchPolicySubjects";
import fetchFilePolicies from "src/redux/modules/gatekeeper/epics/fetchFilePolicies";
import ownershipTransferred from "src/redux/modules/gatekeeper/epics/ownershipTransferred";
import elementNotifications from "src/redux/modules/elements/epics/notifications";
import elementLinks from "src/redux/modules/elements/epics/links";
import soundNotifications from "src/redux/modules/sounds/epics/notifications";
import soundDownloads from "src/redux/modules/sounds/epics/getDownloadUrl";

export default combineEpics(
  fetchUserProfile,
  fetchScreenplayFiles,
  paste,
  downloadFile,
  toggleSelected,
  fileNotifications,
  fetchPolicySubjects,
  fetchFilePolicies,
  ownershipTransferred,
  elementNotifications,
  elementLinks,
  soundNotifications,
  soundDownloads
);
