import { create } from "zustand";

import { collectPrivateSignals, collectPublicSignals } from "../browser-spy";
import { getPlatformUser, postPlatformUser } from "../strapi";

const defaultUser = {
  username: undefined,
  browserDataCombinationID: undefined,
};

/* 
status:
idle - initial state
loading - in the process of logging in / creating account
loggedIn - logged in
anonymous - the user has chosen to log out, so lets not log them in automatically
error - something went wrong
 */
const useAuth = create((set, get) => ({
  user: defaultUser,
  status: "idle",
  error: null,

  async hydrate(userIndicatedLogIn = false) {
    if (
      userIndicatedLogIn &&
      sessionStorage.getItem("hasChosenToLogOut") === "true"
    )
      sessionStorage.removeItem("hasChosenToLogOut");
    if (
      sessionStorage.getItem("hasChosenToLogOut") === "true" &&
      !userIndicatedLogIn
    ) {
      set({ status: "anonymous" });
      return;
    }

    if (
      !get().user.username &&
      !get().user.browserDataCombinationID &&
      get().status !== "loggedIn" &&
      get().status !== "anonymous"
    ) {
      set({ status: "loading" });
    } else {
      set({ status: "loggedIn" });
      return;
    }
    try {
      const browserDataCombinationID = await collectPrivateSignals();
      const platformUser = await getPlatformUser(browserDataCombinationID);
      if (!platformUser) {
        set({
          status: "idle",
        });
        return;
      }
      if (platformUser) {
        set({
          user: {
            username: platformUser.Username,
            browserDataCombinationID,
          },
          status: "loggedIn",
        });
        return;
      }
    } catch (e) {
      set({
        status: "error",
        error: e.message || "Network error",
      });
    }
  },
  async createAccount(username) {
    if (
      get().user.username &&
      get().user.browserDataCombinationID &&
      (get().status === "loggedIn" || get().status === "anonymous")
    ) {
      console.error("Alreay registered/logged in, this should not happen");
      return;
    } else {
      set({ status: "loading" });
    }
    try {
      const browserDataCombinationID = await collectPrivateSignals();
      const userDataToDisplayToOthers = collectPublicSignals();

      const platformUser = await postPlatformUser({
        browserDataCombinationID,
        username,
        userDataToDisplayToOthers,
      });

      if (!platformUser) {
        set({
          status: "error",
          error: "Could not create account",
        });
        return;
      } else {
        set({
          user: {
            username: platformUser.Username,
            browserDataCombinationID: browserDataCombinationID,
          },
          status: "loggedIn",
        });
      }
    } catch (e) {
      set({
        status: "error",
        error: e.message || "Network error",
      });
    }
  },
  // TODO: even if used is logged out, the hydrate function runs on rerender and the state is reset so they get logged in again automatically
  async logOut() {
    set({ user: defaultUser, status: "anonymous" });
    sessionStorage.setItem("hasChosenToLogOut", "true");
  },
}));

export default useAuth;
