import mongoose from "mongoose";

export const connectDB = async function () {
  const database = process.env.DATABASE_URL.replace(
    "<db_password>",
    process.env.DATABASE_PASSWORD
  );
  try {
    await mongoose.connect(database);
    console.log("DATABASE CONNECTED SUCCESSFULLY 💽");
  } catch (error) {
    console.log(`${error.errmsg}`);
    process.exit(1); // in case of err, exit process 1 as failure & 0 for success
  }
};
