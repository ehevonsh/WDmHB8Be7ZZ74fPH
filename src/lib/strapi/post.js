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
            posts(pagination: { page: ${page}, pageSize: ${pageSize} }) {
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

export { createPost, getPosts };
