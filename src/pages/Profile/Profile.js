import { useMemo } from "react";

const Profile = () => {
  // TODO: Replace with fingerprint + Strapi user/profile + user posts
  const user = useMemo(
    () => ({
      username: "BEMMIMEES",
      hardware:
        "8 CPU Cores, 8GB RAM, NVIDIA GeForce RTX 2080 SUPER, 10GB free storage",
      software: "K1, Linux x86_64, Firefox/143.0",
      ip: "10.111.222.3, 10.111.222.3 (WebRTC)",
      location: "Estonia",
      tz: "Europe, Tallinn",
      lang: "en-US",
      screen: "1920×995",
      canvas: "randomized",
      webgl: "not randomized",
      battery: "100%, fully charged",
      posts: [
        {
          id: 1,
          title: "Post title, today I touched grass, almost",
          author: "BEMMIMEES",
          date: "23 November 1929",
        },
        {
          id: 2,
          title: "Post title, today I touched grass, almost",
          author: "BEMMIMEES",
          date: "23 November 1929",
        },
      ],
    }),
    []
  );

  return (
    <main className="gridBox mt-6">
      <section className="rounded">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">My Profile</h1>
          <div className="flex gap-3">
            <button className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px">
              Log out
            </button>
            <button className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px">
              Update
            </button>
          </div>
        </div>

        <div className="bg-white rounded shadow-md border border-zinc-200 p-4 mt-4">
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <div className="mt-2 text-sm leading-6">
            <p>
              <span className="font-semibold">Hardware:</span> {user.hardware}
            </p>
            <p>
              <span className="font-semibold">Software:</span> {user.software}
            </p>
            <p>
              <span className="font-semibold">IP:</span> {user.ip}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {user.location}
            </p>
            <p>
              <span className="font-semibold">Time Zone Offset:</span> {user.tz}
            </p>
            <p>
              <span className="font-semibold">Browser Language:</span>{" "}
              {user.lang}
            </p>
            <p>
              <span className="font-semibold">Screen Size:</span> {user.screen}
            </p>
            <p>
              <span className="font-semibold">Canvas fingerprint:</span>{" "}
              {user.canvas}
            </p>
            <p>
              <span className="font-semibold">WebGL fingerprint:</span>{" "}
              {user.webgl}
            </p>
            <p>
              <span className="font-semibold">Battery:</span> {user.battery}
            </p>
          </div>
        </div>

        {/* User posts list (matches card style used on Posts) */}
        <div className="mt-6 grid gap-4">
          {user.posts.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-xl shadow-md border border-zinc-200 p-4"
            >
              <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
              <p className="m-0 text-purple-600 font-semibold">
                Posted by: <span className="text-purple-600">{p.author}</span>,{" "}
                {p.date}
              </p>
            </article>
          ))}
        </div>

        {/* Pagination stub */}
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

export default Profile;
