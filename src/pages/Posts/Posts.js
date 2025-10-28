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
  const items = new Array(5).fill("Post title, today I touched grass, almost");

  return (
    <main className="max-w-5xl mx-auto mt-6 px-5">
      <section className="bg-white rounded-lg min-h-[60vh] p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-black">Posts</h1>
          <button
            className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px"
            onClick={() => alert("Add a post (stub)")}
          >
            Add a post
          </button>
        </div>

        <div className="grid gap-4">
          {items.map((t, i) => (
            <PostCard key={i} title={t} />
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => alert("Page 1 (stub)")}
            className="px-3 py-1 text-white rounded-lg shadow font-bold bg-purple"
          >
            1
          </button>
          <span>Next page</span>
        </div>
      </section>
    </main>
  );
};

export default Posts;
