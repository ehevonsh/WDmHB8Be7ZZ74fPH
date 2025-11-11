const UserPostCard = ({ children }) => {
  return (
    <article className="bg-white rounded shadow-md border border-zinc-200 p-4">
      {children}
    </article>
  );
};

export default UserPostCard;
