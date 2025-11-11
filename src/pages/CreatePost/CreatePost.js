import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../lib/auth";
import { getStrapiContent, createPost } from "../../lib/strapi";

import RichTextBlocksInput from "./RichTextBlocksInput/RichTextBlocksInput";

const CreatePost = () => {
  const user = useAuth((state) => state.user);

  const [title, setTitle] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);
  const [CMSContent, setCMSContent] = useState(null);
  const [postCreationStatus, setPostCreationStatus] = useState(null);

  useEffect(() => {
    let alive = true;
    getStrapiContent("CreateAPostPage")
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
    console.log("Post creation result:", result);

    setPostCreationStatus(result);
    setTitle("");
    setContentBlocks([]);
  };

  if (!CMSContent) return null;
  return (
    <main className="gridBox">
      <section className="mt-6">
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

          <div className="flex gap-3">
            {!postCreationStatus && (
              <button
                type="submit"
                className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px"
              >
                {CMSContent.PostButtonText}
              </button>
            )}
            <NavLink
              to={CMSContent.BackToPostsButton.LinkUrl}
              className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px"
            >
              {CMSContent.BackToPostsButton.Text}
            </NavLink>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreatePost;
