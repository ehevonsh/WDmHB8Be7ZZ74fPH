import { useEffect, useState } from "react";

import { PaginationNavbar, UserPostCard } from "../../UI-components";

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

  if (!CMSContent) return null;
  return (
    <main className="gridBox mt-6">
      <section>
        <h1 className="text-2xl font-bold mb-4 text-black">
          {CMSContent.PageHeader}
        </h1>

        {platformUsers.success === true ? (
          <>
            <div className="grid gap-4">
              {platformUsers.data.platformUsers.map((platformUser, i) => (
                <UserPostCard key={`user-${i}`}>
                  <h3 className="text-purple font-semibold hover:underline">
                    {platformUser.Username}
                  </h3>
                  <p className="text-sm text-black mt-1">
                    {platformUser.UserDataToDisplayToOthers}
                  </p>
                  <p className="text-sm text-gray mt-1">
                    Joined at:{" "}
                    {getDateByUnixTime(platformUser.JoinedAtUnixTime)}
                  </p>
                </UserPostCard>
              ))}
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
