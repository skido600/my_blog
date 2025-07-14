import mongoose from "mongoose";
import { mongourl } from "./dotenv.js";
// import { generateSlug } from "../controller/Slug.js";
// import Post from "../models/postSchema.js";
const dbconnect = async () => {
  try {
    const connect = await mongoose.connect(mongourl);
    console.log(" Database connected:", connect.connection.name);
    // const postsWithoutSlugs = await Post.find({ slug: { $exists: false } });

    // console.log(`Found ${postsWithoutSlugs.length} post(s) without slug.`);

    // for (let post of postsWithoutSlugs) {
    //   const slug = generateSlug(post.title, post._id.toString());
    //   post.slug = slug;
    //   await post.save();
    //   console.log(`✅ Updated: ${post.title} → ${slug}`);
    // }

    // console.log("🎉 Done updating slugs.");
    // process.exit(0);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export { dbconnect };
