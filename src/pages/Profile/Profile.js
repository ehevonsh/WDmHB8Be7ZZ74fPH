import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { getPlatformUser } from "../../lib/strapi/platform-user";
import { getPostsByUsername } from "../../lib/strapi/post";
import { getDateByUnixTime } from "../../lib/other-utils";
import { PaginationNavbar } from "../../UI-components";

const PAGE_SIZE = 5;

const Profile = () => {
  const authUser = useAuth((state) => state.user);
  const authStatus = useAuth((state) => state.status);

  const [profileData, setProfileData] = useState(null);
  const [postsData, setPostsData] = useState({
    success: false,
    data: null,
    error: null,
  });
  const [paginationIndex, setPaginationIndex] = useState(1);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Fetch the user's full profile details
  useEffect(() => {
    if (authStatus === "loggedIn" && authUser.browserDataCombinationID) {
      let alive = true;
      setIsLoadingProfile(true);
      getPlatformUser(authUser.browserDataCombinationID)
        .then((data) => {
          if (alive && data) {
            setProfileData(data);
          }
          setIsLoadingProfile(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoadingProfile(false);
        });
      return () => {
        alive = false;
      };
    } else if (authStatus !== "loading") {
      setIsLoadingProfile(false);
    }
  }, [authStatus, authUser.browserDataCombinationID]);

  // Fetch the user's posts
  useEffect(() => {
    if (authStatus === "loggedIn" && authUser.username) {
      let alive = true;
      setIsLoadingPosts(true);
      getPostsByUsername({
        username: authUser.username,
        page: paginationIndex,
        pageSize: PAGE_SIZE,
      })
        .then((res) => {
          if (alive) {
            setPostsData(res);
          }
          setIsLoadingPosts(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoadingPosts(false);
        });
      return () => {
        alive = false;
      };
    } else if (authStatus !== "loading") {
      setIsLoadingPosts(false);
    }
  }, [authStatus, authUser.username, paginationIndex]);

  const setNewPaginationIndex = (newIndex) => () => {
    setPaginationIndex(newIndex);
  };

  if (isLoadingProfile) {
    return (
      <main className="gridBox mt-6">
        <section className="rounded">
          <h1 className="text-2xl font-bold text-black">My Profile</h1>
          <div className="bg-white rounded shadow-md border border-zinc-200 p-4 mt-4">
            <p>Loading profile...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!profileData) {
    return (
      <main className="gridBox mt-6">
        <section className="rounded">
          <h1 className="text-2xl font-bold text-black">My Profile</h1>
          <div className="bg-white rounded shadow-md border border-zinc-200 p-4 mt-4">
            <p>Could not load profile. Please make sure you are logged in.</p>
          </div>
        </section>
      </main>
    );
  }

  // Get data
  const {
    screen_resolution = "N/A",
    cores = "N/A",
    gpu = "N/A",
    language = "N/A",
    useragent = "N/A",
    timezone = "N/A",
    device_type = "N/A"
  } = Object.fromEntries(new URLSearchParams(profileData.UserDataToDisplayToOthers)) || {};

  return (
    <main className="gridBox mt-6">
      <section className="rounded">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">My Profile</h1>
          <div className="flex gap-3">
            <button className="bg-purple text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px">
              Update
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white rounded shadow-md border border-zinc-200 p-4 mt-4">
          <h2 className="text-xl font-semibold">{profileData.Username}</h2>
          <div className="mt-2 text-sm leading-6">
            <p>
              <span className="font-semibold">Screen resolution:</span> {screen_resolution}
            </p>
            <p>
              <span className="font-semibold">Cores:</span> {cores}
            </p>
            <p>
              <span className="font-semibold">GPU:</span> {gpu}
            </p>
            <p>
              <span className="font-semibold">Language:</span> {language}
            </p>
            <p>
              <span className="font-semibold">Useragent:</span> {useragent}
            </p>
            <p>
              <span className="font-semibold">Device type:</span> {device_type}
            </p>
            <p>
              <span className="font-semibold">Timezone:</span> {timezone}
            </p>
          </div>
        </div>

        {/* Posts */}
        <h2 className="text-xl font-semibold mt-6">My Posts</h2>
        {isLoadingPosts ? (
          <div className="bg-white rounded-xl shadow-md border border-zinc-200 p-4 mt-4">
            <p>Loading posts...</p>
          </div>
        ) : postsData.success === true && postsData.data.posts.length > 0 ? (
          <>
            <div className="mt-4 grid gap-4">
              {postsData.data.posts.map((p, i) => (
                <article
                  key={p.id || i} // Use post ID if available, fallback to index
                  className="bg-white rounded-xl shadow-md border border-zinc-200 p-4"
                >
                  <h3 className="text-lg font-semibold mb-2">{p.Title}</h3>
                  <p className="m-0 text-purple-600 font-semibold">
                    Posted by:{" "}
                    <span className="text-purple-600">
                      {p.platform_user.Username}
                    </span>
                    , {getDateByUnixTime(p.UnixTime)}
                  </p>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <PaginationNavbar
              currentPage={paginationIndex}
              totalItems={postsData?.data?.total || 0}
              itemsPerPage={PAGE_SIZE}
              CMSContent={{
                previous_page: "Previous",
                next_page: "Next",
                go_to_page: "Go to page",
              }}
              setNewPaginationIndex={setNewPaginationIndex}
            />
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-zinc-200 p-4 mt-4">
            <p>{postsData.error || "You haven't posted anything yet."}</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;