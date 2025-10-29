const getStrapiUrl = () => {
  const STRAPI_API_URL = process.env.REACT_APP_STRAPI_API_URL;

  if (!STRAPI_API_URL)
    throw new Error("STRAPI_API_URL is not defined in environment variables");

  return STRAPI_API_URL;
};

export default getStrapiUrl;
