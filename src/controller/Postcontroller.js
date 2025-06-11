import formidable from "formidable";
import { cloudinary } from "../config/dotenv.js";
import { postSchema } from "../config/validate.js";
import Post from "../models/postSchema.js";
import fs from "fs";
import path from "path";

const postcontroller = (req, res) => {
  const uploadDir = path.join(process.cwd(), "upload_test");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable parse error:", err);
      return res.status(400).json({ message: "Error parsing the files" });
    }

    try {
      const title = fields.title?.toString().trim();
      const description = fields.description?.toString().trim();
      const Imagecaption = fields.Imagecaption?.toString().trim();
      const userId = req.user?.userid;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Not authorized" });
      }

      const { error } = postSchema.validate({
        title,
        description,
        Imagecaption,
      });
      if (error) {
        return res
          .status(400)
          .json({ success: false, message: error.details[0].message });
      }

      // Normalize HeaderImage (single file)
      const rawHeaderImage = files.HeaderImage;
      const HeaderImageFile = Array.isArray(rawHeaderImage)
        ? rawHeaderImage[0]
        : rawHeaderImage;

      if (!HeaderImageFile) {
        return res
          .status(400)
          .json({ success: false, message: "HeaderImage file is required" });
      }

      // Normalize articleImages (can be multiple or single)
      const rawArticleImages = files.articleImages || [];
      const articleImageFiles = Array.isArray(rawArticleImages)
        ? rawArticleImages
        : [rawArticleImages];

      // Upload HeaderImage to Cloudinary
      const resultHeaderImage = await cloudinary.uploader.upload(
        HeaderImageFile.filepath,
        {
          folder: "headerimage_folder",
          resource_type: "image",
        }
      );

      // Upload all article images to Cloudinary
      const uploadedArticleImages = await Promise.all(
        articleImageFiles.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.filepath, {
            folder: "headerimage_folder/article",
            resource_type: "image",
          });
          return { url: result.secure_url };
        })
      );

      const newPost = new Post({
        title,
        description,
        Imagecaption,
        userId,
        HeaderImage: resultHeaderImage.secure_url,
        articleImages: uploadedArticleImages,
      });

      const savedPost = await newPost.save();

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        post: savedPost,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
  });
};

const updatePostController = async (req, res) => {
  const postId = req.params.id;

  const form = formidable({
    uploadDir: path.join(process.cwd(), "upload_test"),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: "Form parsing failed" });
    }

    try {
      const title = fields.title?.toString().trim();
      const description = fields.description?.toString().trim();
      const Imagecaption = fields.Imagecaption?.toString().trim();

      const { error } = postSchema.validate({
        title,
        description,
        Imagecaption,
      });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });

      if (req.user?.userid !== post.userId.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Optional new HeaderImage
      let updatedHeaderImage = post.HeaderImage;
      if (files.HeaderImage) {
        const headerImage = Array.isArray(files.HeaderImage)
          ? files.HeaderImage[0]
          : files.HeaderImage;
        const upload = await cloudinary.uploader.upload(headerImage.filepath, {
          folder: "headerimage_folder",
          resource_type: "image",
        });
        updatedHeaderImage = upload.secure_url;
      }

      // Optional new articleImages
      let updatedArticleImages = post.articleImages;
      if (files.articleImages) {
        const articleImageFiles = Array.isArray(files.articleImages)
          ? files.articleImages
          : [files.articleImages];

        updatedArticleImages = await Promise.all(
          articleImageFiles.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.filepath, {
              folder: "headerimage_folder/article",
              resource_type: "image",
            });
            return { url: result.secure_url };
          })
        );
      }

      post.title = title;
      post.description = description;
      post.Imagecaption = Imagecaption;
      post.HeaderImage = updatedHeaderImage;
      post.articleImages = updatedArticleImages;

      const updatedPost = await post.save();

      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        post: updatedPost,
      });
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  });
};

const deletePostController = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Optional: check if the logged-in user is the author
    if (req.user?.userid !== post.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Optionally delete images from Cloudinary (optional cleanup)

    await Post.findByIdAndDelete(postId);

    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { postcontroller, updatePostController, deletePostController };
