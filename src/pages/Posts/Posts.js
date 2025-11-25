import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../lib/auth";
import { getStaticStrapiContent, getPosts } from "../../lib/strapi";
import { getDateByUnixTime } from "../../lib/other-utils";

import {
  NoStrapiData,
  PaginationNavbar,
  UserPostCard,
} from "../../UI-components";

const PAGE_SIZE = 10;
const Posts = () => {
  const authUser = useAuth((state) => state.user);

  const [CMSContent, setCMSContent] = useState(null);
  const [postsData, setPostsData] = useState([]);
  const [paginationIndex, setPaginationIndex] = useState(1);

  useEffect(() => {
    let alive = true;
    getStaticStrapiContent("Homepage")
      .then((data) => alive && setCMSContent(data))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    getPosts({ page: paginationIndex, pageSize: PAGE_SIZE })
      .then((res) => alive && setPostsData(res))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, [paginationIndex]);

  const setNewPaginationIndex = (newIndex) => () => {
    setPaginationIndex(newIndex);
  };

  if (!CMSContent) {
    return <NoStrapiData />;
  }

  return (
    <main className="gridBox my-6">
      <section className="bg-white rounded-lg min-h-[60vh]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-2xl font-bold text-black">
            {CMSContent.PageHeader}
          </h1>
          {authUser.browserDataCombinationID && (
            <NavLink
              className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px w-full sm:w-auto text-center"
              to={CMSContent.AddAPostButton.LinkUrl}
              end
            >
              {CMSContent.AddAPostButton.Text}
            </NavLink>
          )}
        </div>
        {postsData.success === true ? (
          <>
            {postsData.data.posts.length > 0 ? (
              <div className="grid gap-4">
                {postsData.data.posts.map((post, i) => (
                  <NavLink to={`/post/${post.documentId}`} key={i}>
                    <UserPostCard>
                      <h3 className="text-xl font-semibold mb-2">
                        {post.Title}
                      </h3>
                      <p className="m-0 text-purple font-semibold">
                        Posted by:{" "}
                        <span className="text-purple">
                          {post.platform_user.Username}
                        </span>
                        , {getDateByUnixTime(post.UnixTime)}
                      </p>
                    </UserPostCard>
                  </NavLink>
                ))}
              </div>
            ) : (
              <p>No posts were found</p>
            )}

            <PaginationNavbar
              currentPage={paginationIndex}
              totalItems={postsData?.data?.total || 0}
              itemsPerPage={PAGE_SIZE}
              CMSContent={CMSContent.pagination_navbar}
              setNewPaginationIndex={setNewPaginationIndex}
            />
          </>
        ) : (
          <p>{postsData.error}</p>
        )}
      </section>
    </main>
  );
};

export default Posts;
