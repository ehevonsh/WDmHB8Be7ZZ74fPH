import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import {
  getPlatformUser,
  updatePlatformUser,
  getStaticStrapiContent,
} from "../../lib/strapi";
import { getPostsByUsername } from "../../lib/strapi/post";
import { getDateByUnixTime } from "../../lib/other-utils";
import { collectPublicSignals } from "../../lib/browser-spy";
import {
  NoStrapiData,
  PaginationNavbar,
  UserPostCard,
} from "../../UI-components";
import { NavLink } from "react-router-dom";

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
  const [isLoadingCMSContent, setIsLoadingCMSContent] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [CMSContent, setCMSContent] = useState(null);

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

  // Fetch Strapi CMS content
  useEffect(() => {
    if (authStatus === "loggedIn" && authUser.browserDataCombinationID) {
      let alive = true;
      setIsLoadingCMSContent(true);
      getStaticStrapiContent("MyProfilePage")
        .then((data) => {
          alive && setCMSContent(data);
          setIsLoadingCMSContent(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoadingCMSContent(false);
        });
      return () => {
        alive = false;
      };
    } else if (authStatus !== "loading") {
      setIsLoadingCMSContent(false);
    }
  }, []);

  const setNewPaginationIndex = (newIndex) => () => {
    setPaginationIndex(newIndex);
  };

  const handleUpdateProfile = async () => {
    if (!authUser.browserDataCombinationID) return;

    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const newUserDataToDisplay = await collectPublicSignals();

      const result = await updatePlatformUser({
        browserDataCombinationID: authUser.browserDataCombinationID,
        userDataToDisplayToOthers: newUserDataToDisplay,
      });

      if (result && result.success) {
        setProfileData((prev) => ({
          ...prev,
          UserDataToDisplayToOthers: result.UserDataToDisplayToOthers,
        }));
        setUpdateMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
      } else {
        setUpdateMessage({ type: "error", text: "Failed to update profile." });
      }
    } catch (error) {
      console.error("Update failed:", error);
      setUpdateMessage({ type: "error", text: "An error occurred." });
    } finally {
      setIsUpdating(false);
      // Clear message after 3 seconds
      setTimeout(() => setUpdateMessage(null), 3000);
    }
  };

  if (isLoadingProfile || isLoadingCMSContent) {
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

  if (!CMSContent) {
    return <NoStrapiData />;
  }

  // Get data
  const {
    screen_resolution = "N/A",
    cores = "N/A",
    gpu = "N/A",
    language = "N/A",
    useragent = "N/A",
    timezone = "N/A",
    device_type = "N/A",
  } = Object.fromEntries(
    new URLSearchParams(profileData.UserDataToDisplayToOthers)
  ) || {};

  return (
    <main className="gridBox my-6">
      <section className="rounded">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-black">
            {CMSContent.PageHeader}
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className={`text-white font-semibold px-4 py-2 rounded shadow-md active:translate-y-px w-full sm:w-auto ${
                isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-purple"
              }`}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>

        {updateMessage && (
          <div
            className={`mt-4 p-2 rounded text-sm ${
              updateMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {updateMessage.text}
          </div>
        )}

        {/* Profile */}
        <div className="bg-white rounded shadow-md border border-zinc-200 p-4 mt-4">
          <h2 className="text-xl font-semibold">{profileData.Username}</h2>
          <div className="mt-2 text-sm leading-6">
            <p>
              <span className="font-semibold">Screen resolution:</span>{" "}
              {screen_resolution}
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
                <NavLink to={`/post/${p.documentId}`} key={p.id || i}>
                  <UserPostCard>
                    <h3 className="text-lg font-semibold mb-2">{p.Title}</h3>
                    <p className="m-0 text-purple font-semibold">
                      Posted by: {p.platform_user.Username},{" "}
                      {getDateByUnixTime(p.UnixTime)}
                    </p>
                  </UserPostCard>
                </NavLink>
              ))}
            </div>

            {/* Pagination */}
            <PaginationNavbar
              currentPage={paginationIndex}
              totalItems={postsData?.data?.total || 0}
              itemsPerPage={PAGE_SIZE}
              CMSContent={CMSContent.pagination_navbar}
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
