const insertBeforeClosingTag = (
  definition: string,
  content: string,
  closingTag: string
) => {
  let parts = definition.split(closingTag);
  parts.splice(1, 0, content);
  parts.splice(2, 0, closingTag);
  return parts.join('\n');
};

export default insertBeforeClosingTag;
