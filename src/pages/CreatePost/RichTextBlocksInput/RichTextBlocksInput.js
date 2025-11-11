const RichTextBlocksInput = ({ value, onChange }) => {
  const toPlainText = (blocks) =>
    (blocks || [])
      .map((block) =>
        (block.children || []).map((child) => child.text || "").join("")
      )
      .join("\n");

  const fromPlainText = (text) => {
    const lines = text.split(/\r?\n/);
    return lines.map((line) => ({
      type: "paragraph",
      children: [{ type: "text", text: line }],
    }));
  };

  const handleChange = (e) => {
    const blocks = fromPlainText(e.target.value);
    onChange(blocks);
  };

  return (
    <textarea
      rows={8}
      required
      className="w-full min-h-32 h-[50vh] rounded resize-y p-3 border border-zinc-300"
      value={toPlainText(value)}
      onChange={handleChange}
      placeholder="Write your content here…"
    />
  );
};

export default RichTextBlocksInput;
