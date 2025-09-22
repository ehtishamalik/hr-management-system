export const isRichTextEmpty = (html: string): boolean => {
  const stripped = html
    .replace(/<[^>]*>/g, "") // remove HTML tags
    .replace(/&nbsp;/g, "") // remove non-breaking spaces
    .replace(/\s/g, ""); // remove all whitespace

  return stripped.length === 0;
};
