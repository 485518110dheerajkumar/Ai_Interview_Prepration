import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, default: "" },
  image: { type: String, default: "" },
  // remove username field
});

const User = mongoose.model("User", userSchema);

export default User;