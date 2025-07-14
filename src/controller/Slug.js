function generateSlug(title, id) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") + `-${id}`
  );
}

export { generateSlug };
