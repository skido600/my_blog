import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    HeaderImage: {
      type: String,
      required: false,
      trim: true,
    },
    articleImages: [
      {
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    Imagecaption: {
      type: String,
      trim: true,
    },
    views: { type: Number, default: 0 },
    viewedIPs: [String],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
