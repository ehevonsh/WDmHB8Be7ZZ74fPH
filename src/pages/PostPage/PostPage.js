import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";

import { getStaticStrapiContent, getPostByDocumentId } from "../../lib/strapi";
import { UserPostCard } from "../../UI-components";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

const PostPage = () => {
  const { postDocumentId } = useParams();

  const [postData, setPostData] = useState(null);
  const [CMSContent, setCMSContent] = useState(null);

  useEffect(() => {
    let alive = true;
    getStaticStrapiContent("PostPage")
      .then((data) => alive && setCMSContent(data))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    let alive = true;
    getPostByDocumentId(postDocumentId)
      .then((res) => alive && setPostData(res))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, [postDocumentId]);

  if (!CMSContent) return null;
  return (
    <main className="gridBox my-6">
      {postData?.success === true ? (
        <section>
          <h2 className="flex flex-col text-lg my-4">
            <span className="font-semibold">{CMSContent.PostedByText}</span>
            <span className="text-purple">
              {postData.data.platform_user.Username}
            </span>
          </h2>
          <UserPostCard>
            <h1 className="font-bold text-2xl mb-4">{postData.data.Title}</h1>
            <div className="text-lg">
              <BlocksRenderer content={postData.data.Content || []} />
            </div>
          </UserPostCard>
        </section>
      ) : (
        <p className="text-lg font-semibold">{postData?.error}</p>
      )}
      <div className="mt-8">
        <NavLink
          to={CMSContent.BackToPostsButton.LinkUrl}
          className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px"
        >
          {CMSContent.BackToPostsButton.Text}
        </NavLink>
      </div>
    </main>
  );
};

export default PostPage;
