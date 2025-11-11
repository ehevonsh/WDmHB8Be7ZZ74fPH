import { useState, useEffect } from "react";

import { useAuth } from "../../lib/auth";
import { getStrapiContent } from "../../lib/strapi";
import { NavLink } from "react-router-dom";

//TODO: PostCard should be a seperate UI-component, which should also be usable by other pages (e.g. Users), pass down inner content as children
const PostCard = ({
  title,
  author = "BEMMIMEES",
  date = "23 November 1929",
}) => (
  <article className="bg-white rounded-xl shadow-md border border-zinc-200 p-4">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="m-0 text-purple-600 font-semibold">
      Posted by: <span className="text-purple-600">{author}</span>, {date}
    </p>
  </article>
);

const Posts = () => {
  const authUser = useAuth((state) => state.user);

  const [CMSContent, setCMSContent] = useState(null);

  useEffect(() => {
    let alive = true;
    getStrapiContent("Homepage")
      .then((data) => alive && setCMSContent(data))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);

  const items = new Array(5).fill("Post title, today I touched grass, almost");

  if (!CMSContent) return null;
  return (
    <main className="gridBox mt-6">
      <section className="bg-white rounded-lg min-h-[60vh]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-black">
            {CMSContent.PageHeader}
          </h1>
          {authUser.browserDataCombinationID && (
            <NavLink
              className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px"
              to={CMSContent.AddAPostButton.LinkUrl}
              end
            >
              {CMSContent.AddAPostButton.Text}
            </NavLink>
          )}
        </div>

        <div className="grid gap-4">
          {items.map((t, i) => (
            <PostCard key={i} title={t} />
          ))}
        </div>

        {/* TODO: actually use the pagination navbar to navigate through paginated posts */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => alert("Page 1 (stub)")}
            className="px-3 py-1 text-white rounded-lg shadow font-bold bg-purple"
          >
            1
          </button>
          <span>{CMSContent.pagination_navbar.NextPageText}</span>
        </div>
      </section>
    </main>
  );
};

export default Posts;
