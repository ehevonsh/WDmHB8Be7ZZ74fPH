import { useState, useEffect } from "react";

import { getStaticStrapiContent } from "../../lib/strapi";

const Footer = () => {
  const [CMSContent, setCMSContent] = useState(null);

  useEffect(() => {
    let alive = true;
    getStaticStrapiContent("Footer")
      .then((data) => alive && setCMSContent(data))
      .catch(console.error);
    return () => {
      alive = false;
    };
  }, []);

  if (!CMSContent) return null;
  return (
    <footer className="bg-black text-white mt-6 border-t border-white/10">
      <div className="max-w-5xl mx-auto px-5 py-4 text-center">
        <strong>{CMSContent.CopyrightText}</strong>
      </div>
    </footer>
  );
};

export default Footer;
