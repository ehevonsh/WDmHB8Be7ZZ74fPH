import getStrapiUrl from "./get-strapi-url";
import { getUnixTime } from "../other-utils";

const STRAPI_URL = getStrapiUrl();

const getPosts = async ({ page, pageSize }) => {
  if (
    page === null ||
    page === undefined ||
    pageSize === null ||
    pageSize === undefined
  )
    throw new Error("Missing required parameters: page or pageSize");

  try {
    const getPostsRes = await fetch(`${STRAPI_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
            posts(pagination: { page: ${page}, pageSize: ${pageSize} }, sort: "UnixTime:desc") {
              Title
              UnixTime
              platform_user {
                Username
              }
            }
          }`,
      }),
    });
    if (!getPostsRes.ok) throw new Error("Failed to fetch posts");
    const getPostsData = await getPostsRes.json();

    const getPostsAmountRes = await fetch(
      `${STRAPI_URL}/api/posts?pagination[page]=1&pagination[pageSize]=1`
    );
    if (!getPostsAmountRes.ok) throw new Error("Failed to fetch posts amount");
    const getPostsAmountData = await getPostsAmountRes.json();

    return {
      success: true,
      data: {
        posts: getPostsData.data.posts,
        total: getPostsAmountData.meta.pagination.total,
      },
      error: null,
    };
  } catch (e) {
    return { success: false, data: null, error: e.message || "Unknown error" };
  }
};

/**
 * Fetches paginated posts for a specific user.
 * Follows the same (GraphQL + REST) pattern as getPosts.
 */
const getPostsByUsername = async ({ username, page, pageSize }) => {
  if (
    !username ||
    page === null ||
    page === undefined ||
    pageSize === null ||
    pageSize === undefined
  )
    throw new Error(
      "Missing required parameters: username, page, or pageSize"
    );

  try {
    // 1. Fetch paginated posts for the user via GraphQL
    // We add a filter for the platform_user's Username
    const getPostsRes = await fetch(`${STRAPI_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
            posts(
              pagination: { page: ${page}, pageSize: ${pageSize} },
              filters: { platform_user: { Username: { eq: "${username}" } } },
              sort: "UnixTime:desc"
            ) {
              Title
              UnixTime
              platform_user {
                Username
              }
            }
          }`,
      }),
    });
    if (!getPostsRes.ok) throw new Error("Failed to fetch user posts");
    const getPostsData = await getPostsRes.json();

    // 2. Fetch total post count for that user via REST API
    // We add a Strapi filter to the REST query
    const getPostsAmountRes = await fetch(
      `${STRAPI_URL}/api/posts?filters[platform_user][Username][$eq]=${username}&pagination[page]=1&pagination[pageSize]=1`
    );
    if (!getPostsAmountRes.ok)
      throw new Error("Failed to fetch user posts amount");
    const getPostsAmountData = await getPostsAmountRes.json();

    return {
      success: true,
      data: {
        // Assuming the data structure is the same as getPosts
        posts: getPostsData.data.posts,
        total: getPostsAmountData.meta.pagination.total,
      },
      error: null,
    };
  } catch (e) {
    return { success: false, data: null, error: e.message || "Unknown error" };
  }
};

const createPost = async ({
  title,
  richTextBlocksContent,
  browserDataCombinationID,
}) => {
  if (!browserDataCombinationID || !title || !richTextBlocksContent)
    return { success: false, error: "Missing required fields" };

  try {
    const unixTime = getUnixTime();

    const createPostRes = await fetch(`${STRAPI_URL}/api/secure/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        browserDataCombinationID,
        post: {
          Title: title,
          Content: richTextBlocksContent,
          UnixTime: unixTime,
        },
      }),
    });
    if (!createPostRes.ok) throw new Error("Failed to create post");

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || "Unknown error" };
  }
};

// Export the new function alongside the existing ones
export { createPost, getPosts, getPostsByUsername };