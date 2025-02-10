// Archives (moves) documents from one collection to another

import mongoose from "mongoose";

const archiver = async () => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Start of today in UTC

    // Start a mongoose session for transaction support
    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      const oldNews = await newsModel
        .find({
          createdAt: { $lt: today },
          published: false,
        })
        .session(session);

      if (oldNews.length === 0) {
        // console.log("No old news found.");
        return await session.abortTransaction();
      }

      await newsArchiveModel.insertMany(
        oldNews.map((news) => ({
          ...news.toObject(),
          _id: news._id, // Preserve original _id
          archivedAt: new Date(),
        })),
        { session }
      );

      await newsModel.deleteMany(
        { _id: { $in: oldNews.map((news) => news._id) } },
        { session }
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error in archiving old news:", error.message);
  }
};

export default archiver;
