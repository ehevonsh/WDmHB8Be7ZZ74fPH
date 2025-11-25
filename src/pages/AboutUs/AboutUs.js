import { useState, useEffect } from "react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import { getStaticStrapiContent } from "../../lib/strapi";
import { NoStrapiData } from "../../UI-components";

const AboutUs = () => {
  const [CMSContent, setCMSContent] = useState(null);

  useEffect(() => {
    let alive = true;
    getStaticStrapiContent("AboutUsPage")
      .then((data) => alive && setCMSContent(data))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);

  if (!CMSContent) {
    return <NoStrapiData />;
  }
  return (
    <main className="gridBox my-6">
      <section>
        <h1 className="text-2xl font-bold mb-4">{CMSContent.PageHeader}</h1>

        <div className="bg-white rounded shadow-md border border-zinc-200 p-4 p-4 text-center">
          <BlocksRenderer content={CMSContent.Content ?? []} />
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
