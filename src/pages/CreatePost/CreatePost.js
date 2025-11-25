import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../lib/auth";
import { getStaticStrapiContent, createPost } from "../../lib/strapi";

import RichTextBlocksInput from "./components/RichTextBlocksInput/RichTextBlocksInput";
import { NoStrapiData } from "../../UI-components";

const CreatePost = () => {
  const user = useAuth((state) => state.user);

  const [title, setTitle] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);
  const [CMSContent, setCMSContent] = useState(null);
  const [postCreationStatus, setPostCreationStatus] = useState(null);

  useEffect(() => {
    let alive = true;
    getStaticStrapiContent("CreateAPostPage")
      .then((data) => alive && setCMSContent(data))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const result = await createPost({
      title,
      richTextBlocksContent: contentBlocks,
      browserDataCombinationID: user?.browserDataCombinationID,
    });

    setPostCreationStatus(result);
    setTitle("");
    setContentBlocks([]);
  };

  if (!CMSContent) {
    return <NoStrapiData />;
  }
  return (
    <main className="gridBox">
      <section className="my-6">
        {!postCreationStatus && (
          <h1 className="text-2xl font-bold mb-4 text-black">
            {CMSContent.PageHeader}
          </h1>
        )}

        <form onSubmit={submit} className="space-y-4">
          {postCreationStatus ? (
            <div className="my-8 font-semibold">
              <p className="">
                Creating the post was{" "}
                {postCreationStatus.success ? "successful" : "unsuccessful"}.
                Refresh the page to create another post.
              </p>
              {postCreationStatus.error && (
                <p>Error: {postCreationStatus.error}</p>
              )}
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Title"
                minLength={5}
                maxLength={50}
                className="w-full rounded border border-zinc-300 px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <RichTextBlocksInput
                value={contentBlocks}
                onChange={setContentBlocks}
              />
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <NavLink
              to={CMSContent.BackToPostsButton.LinkUrl}
              className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px w-full sm:w-auto text-center"
            >
              {CMSContent.BackToPostsButton.Text}
            </NavLink>
            {!postCreationStatus && (
              <button
                type="submit"
                className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px w-full sm:w-auto"
              >
                {CMSContent.PostButtonText}
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreatePost;
