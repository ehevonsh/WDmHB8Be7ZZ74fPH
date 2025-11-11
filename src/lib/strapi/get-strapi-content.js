import getStrapiUrl from "./get-strapi-url";
import strapiQuerys from "./strapi-querys";

const STRAPI_URL = getStrapiUrl();

const getStrapiContent = async (contentType) => {
  const contentRes = await fetch(`${STRAPI_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: strapiQuerys[contentType] }),
  });
  const contentBody = await contentRes.json();

  if (contentBody.errors) {
    console.log(contentBody.errors);
    throw new Error(
      "The request to Strapi succeeded, but Strapi returned an error in the response body. Authorization might be messed up."
    );
  }

  if (!contentRes.ok)
    throw new Error(`Failed to fetch content for ${contentType} in strapi.`);

  return contentBody.data[
    `${contentType[0].toLowerCase()}${contentType.slice(1)}`
  ];
};

export default getStrapiContent;
