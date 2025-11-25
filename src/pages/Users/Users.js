import { useEffect, useState } from "react";

import {
  PaginationNavbar,
  UserPostCard,
  NoStrapiData,
} from "../../UI-components";

import { getStaticStrapiContent, getPlatformUsers } from "../../lib/strapi";
import { getDateByUnixTime } from "../../lib/other-utils";

const PAGE_SIZE = 10;

const Users = () => {
  const [CMSContent, setCMSContent] = useState(null);
  const [platformUsers, setPlatformUsers] = useState([]);
  const [paginationIndex, setPaginationIndex] = useState(1);

  useEffect(() => {
    let alive = true;
    getStaticStrapiContent("UsersPage")
      .then((data) => alive && setCMSContent(data))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    getPlatformUsers({ page: paginationIndex, pageSize: PAGE_SIZE })
      .then((res) => alive && setPlatformUsers(res))
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
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-2xl font-bold text-black">
            {CMSContent.PageHeader}
          </h1>
        </div>

        {platformUsers.success === true ? (
          <>
            <div className="grid gap-4">
              {platformUsers.data.platformUsers.map((platformUser, i) => {
                // Parse the query string data for each user
                const {
                  screen_resolution = "N/A",
                  cores = "N/A",
                  gpu = "N/A",
                  language = "N/A",
                  useragent = "N/A",
                  timezone = "N/A",
                  device_type = "N/A",
                } = Object.fromEntries(
                  new URLSearchParams(
                    platformUser.UserDataToDisplayToOthers || ""
                  )
                );

                return (
                  <UserPostCard key={`user-${i}`}>
                    <h3 className="text-purple font-semibold">
                      {platformUser.Username}
                    </h3>
                    
                    {/* Display parsed data */}
                    <div className="mt-2 text-sm leading-6 text-black">
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
                        <span className="font-semibold">Language:</span>{" "}
                        {language}
                      </p>
                      <p>
                        <span className="font-semibold">Useragent:</span>{" "}
                        {useragent}
                      </p>
                      <p>
                        <span className="font-semibold">Device type:</span>{" "}
                        {device_type}
                      </p>
                      <p>
                        <span className="font-semibold">Timezone:</span>{" "}
                        {timezone}
                      </p>
                    </div>

                    <p className="text-sm text-gray mt-3">
                      Joined at:{" "}
                      {getDateByUnixTime(platformUser.JoinedAtUnixTime)}
                    </p>
                  </UserPostCard>
                );
              })}
            </div>

            <PaginationNavbar
              currentPage={paginationIndex}
              totalItems={platformUsers?.data?.total || 0}
              itemsPerPage={PAGE_SIZE}
              CMSContent={CMSContent.pagination_navbar}
              setNewPaginationIndex={setNewPaginationIndex}
            />
          </>
        ) : (
          <p>{platformUsers.error}</p>
        )}
      </section>
    </main>
  );
};

export default Users;
