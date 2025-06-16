import Post from "../models/postSchema.js";
const getMostViewedPost = async (_req, res) => {
  try {
    const post = await Post.findOne().sort({ views: -1 }).select("-viewedIPs");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "No posts found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Most viewed post fetched successfully",
      post,
    });
  } catch (error) {
    console.error("Error fetching most viewed post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch most viewed post",
    });
  }
};

export { getMostViewedPost };
