import { useMemo } from "react";

const Users = () => {
  // TODO: Replace with Strapi GET /api/users (or your collection type)
  const users = useMemo(
    () => [
      { id: 1, name: "BEMMIMEES" },
      { id: 2, name: "PURUPUDI" },
      { id: 3, name: "TURUTUVI" },
      { id: 4, name: "OHULÄVEND" },
      { id: 5, name: "GETOVEND" },
    ],
    []
  );

  const summary =
    "Browser: Firefox 143 (Linux x86_64), Screen: 1920×995; Time Zone UTC+0; Hardware: 4 cores, 8 GB RAM, GTX 970; Fingerprint: Canvas & WebGL randomized; Fonts: common; Language: en-US";

  return (
    <main className="gridBox mt-6">
      <section>
        <h1 className="text-2xl font-bold mb-4 text-black">Users</h1>

        <ul className="grid gap-4">
          {users.map((u) => (
            <li
              key={u.id}
              className="bg-white rounded-xl shadow-md border border-zinc-200 p-4"
            >
              <span className="text-purple-600 font-semibold hover:underline">
                {u.name}
              </span>
              <p className="text-sm text-zinc-600 mt-1">{summary}</p>
            </li>
          ))}
        </ul>

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

export default Users;
