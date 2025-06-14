import Post from "../models/postSchema.js";
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const userIP =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (!post.viewedIPs.includes(userIP)) {
      post.views += 1;
      post.viewedIPs.push(userIP);
      await post.save();
    }
    post.viewedIPs = undefined;
    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
    });
  }
};

const getPostByTitle = async (req, res) => {
  try {
    const { title } = req.params;

    const post = await Post.findOne({ title: title.trim() });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post with that title not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error("Error fetching post by title:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getFeaturedPosts = async (req, res) => {
  try {
    const featuredPosts = await Post.find({ featured: true }).sort({
      createdAt: -1,
    });
    if (featuredPosts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No featured posts found",
      });
    }
    return res.status(200).json({
      success: true,
      count: featuredPosts.length,
      posts: featuredPosts,
    });
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching featured posts",
    });
  }
};

export { getAllPosts, getPostById, getPostByTitle, getFeaturedPosts };
