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

const updatePlatformUser = async ({
  browserDataCombinationID,
  userDataToDisplayToOthers,
}) => {
  try {
    const res = await fetch(`${STRAPI_URL}/api/secure/platform-users/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        browserDataCombinationID,
        userDataToDisplayToOthers,
      }),
    });
    const result = await res.json();

    if (result.error) return null;
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const getPlatformUsers = async ({ page, pageSize }) => {
  if (
    page === null ||
    page === undefined ||
    pageSize === null ||
    pageSize === undefined
  )
    throw new Error("Missing required parameters: page or pageSize");

  try {
    const getPlatformUsersRes = await fetch(`${STRAPI_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
            platformUsers(pagination: { page: ${page}, pageSize: ${pageSize} }) {
              Username
              JoinedAtUnixTime
              UserDataToDisplayToOthers
            }
          }`,
      }),
    });
    if (!getPlatformUsersRes.ok) throw new Error("Failed to fetch posts");
    const getPlatformUsersData = await getPlatformUsersRes.json();

    const getPlatformUsersAmountRes = await fetch(
      `${STRAPI_URL}/api/platform-users?pagination[page]=1&pagination[pageSize]=1`
    );
    if (!getPlatformUsersAmountRes.ok)
      throw new Error("Failed to fetch posts amount");
    const getPlatformUsersAmountData = await getPlatformUsersAmountRes.json();

    return {
      success: true,
      data: {
        platformUsers: getPlatformUsersData.data.platformUsers,
        total: getPlatformUsersAmountData.meta.pagination.total,
      },
      error: null,
    };
  } catch (e) {
    return { success: false, data: null, error: e.message || "Unknown error" };
  }
};

export { getPlatformUser, postPlatformUser, getPlatformUsers, updatePlatformUser };