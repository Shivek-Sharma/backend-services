router.get("/", async (req, res) => {
  try {
    const { tag, page = 0, pageSize = 24, isPublished = true } = req.query;

    // Convert page and pageSize to integers for calculation purposes
    const currentPage = parseInt(page);
    const limit = Math.min(parseInt(pageSize), 100); // Limit the page size to 100 to avoid performance issues

    // Ensure `tags` is always an array
    const tags = Array.isArray(tag)
      ? tag.map((t) => t.trim().toUpperCase())
      : tag
      ? [tag.trim().toUpperCase()]
      : [];

    const filter = tag
      ? {
          published: isPublished,
          ...(tags.length > 0 && {
            category: { $in: tags },
          }),
        }
      : { published: isPublished };
    const totalDocuments = await exampleModel.countDocuments(filter);

    const totalPages = Math.ceil(totalDocuments / limit);
    const start = currentPage * limit;

    const documents = await exampleModel
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip(start)
      .limit(limit)
      .lean(); // Use lean to improve query performance

    if (documents.length === 0 && tags.length > 0) {
      return res.status(404).json({
        success: false,
        message: "No documents found for the given tags",
      });
    }

    res.status(200).json({
      success: true,
      data: documents,
      currentPage,
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
