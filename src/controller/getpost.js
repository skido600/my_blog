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

    // Get real IP address even behind proxies
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    // Get the device/browser info
    const userAgent = req.headers["user-agent"];

    // Combine IP and user-agent to uniquely identify a viewer
    const viewerID = `${ip}_${userAgent}`;

    // Find the post by ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Make sure viewedIPs exists (just in case)
    if (!Array.isArray(post.viewedIPs)) {
      post.viewedIPs = [];
    }

    // Check if this viewer has already viewed the post
    if (!post.viewedIPs.includes(viewerID)) {
      post.views += 1;
      post.viewedIPs.push(viewerID);
      await post.save();
    }

    // Hide viewedIPs before sending response
    const postObj = post.toObject();
    delete postObj.viewedIPs;

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post: postObj,
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
