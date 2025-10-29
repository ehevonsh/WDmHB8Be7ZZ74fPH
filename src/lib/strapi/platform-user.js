import getStrapiUrl from "./get-strapi-url";
import { getUnixTime } from "../other-utils";

const STRAPI_URL = getStrapiUrl();

// These endpoints aren't like the others, these work with the browserDataCombinationID private field, which cannot be used in other platformuser endpoints
const getPlatformUser = async (browserDataCombinationID) => {
  try {
    const res = await fetch(`${STRAPI_URL}/api/secure/platform-users/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        browserDataCombinationID,
      }),
    });
    const platformUser = await res.json();

    if (platformUser.FoundUser === false) return null;
    if (platformUser.error) return null;

    return platformUser;
  } catch (e) {
    return null;
  }
};

const postPlatformUser = async ({
  browserDataCombinationID,
  username,
  userDataToDisplayToOthers,
}) => {
  try {
    const unixTime = getUnixTime();

    const res = await fetch(`${STRAPI_URL}/api/secure/platform-users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        BrowserDataCombinationID: browserDataCombinationID,
        Username: username,
        UserDataToDisplayToOthers: userDataToDisplayToOthers,
        JoinedAtUnixTime: unixTime,
      }),
    });
    const platformUser = await res.json();

    if (platformUser.error?.message === "This attribute must be unique") {
      console.error(
        "Somehow some user already has this browserDataCombinationID"
      );
      return null;
    }
    if (platformUser.error) return null;

    return platformUser;
  } catch (e) {
    return null;
  }
};

export { getPlatformUser, postPlatformUser };
