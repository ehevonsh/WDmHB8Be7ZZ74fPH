const AboutUs = () => {
  return (
    <main className="max-w-5xl mx-auto mt-6 px-5">
      <section className="bg-zinc-100 rounded-lg min-h-[60vh] p-5">
        <h1 className="text-2xl font-bold text-center mb-4">About Us</h1>

        <div className="bg-zinc-300/70 rounded-md p-4 text-center">
          <p className="max-w-3xl mx-auto">
            A social platform where each profile is defined by the user’s
            browser fingerprint. The system analyzes configuration data —
            from user-agent and WebGL to DNS and IP leak tests — to generate
            a profile that reflects how identifiable or vulnerable a browser is.
          </p>
          <p className="max-w-3xl mx-auto mt-3">
            The goal is to make web tracking visible and provide a space for
            privacy-minded users to compare setups, share insights, and learn
            from each other.
          </p>
          <p className="mt-4">
            Contact Us:{" "}
            <a className="text-purple-600 underline" href="mailto:isand.seljamae@gmail.com">
              isand.seljamae@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
