import getStrapiUrl from "./get-strapi-url";
import { getUnixTime } from "../other-utils";

const createPost = async ({
  title,
  richTextBlocksContent,
  browserDataCombinationID,
}) => {
  if (!browserDataCombinationID || !title || !richTextBlocksContent)
    return { success: false, error: "Missing required fields" };

  try {
    const unixTime = getUnixTime();
    const STRAPI_URL = getStrapiUrl();

    const res = await fetch(`${STRAPI_URL}/api/secure/posts`, {
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
    if (!res.ok) throw new Error("Failed to create post");

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || "Unknown error" };
  }
};

export default createPost;
