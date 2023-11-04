const News = require("../models/newsModel");
const asyncHandler = require("express-async-handler");

const getNews = asyncHandler(async (req, res) => {
  const news = await News.find().sort({
    createdAt: -1,
  });
  res.json(news);
});

const createNews = asyncHandler(async (req, res) => {
  const { title, content, image } = req.body;

  if (!title || !content || !image) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const new_s = new News({
    title,
    content,
    image,
  });

  const createdNews = await new_s.save();

  res.status(201).json(createdNews);
});

const getNewsById = asyncHandler(async (req, res) => {
  const new_s = await News.findById(req.params.id);

  if (new_s) {
    res.json(new_s);
  } else {
    res.status(404).json({ message: "News and Event Not Found" });
  }
});

const updateNews = asyncHandler(async (req, res) => {
  const { title, content, image } = req.body;

  const new_s = await News.findById(req.params.id);

  if (new_s) {
    new_s.title = title;
    new_s.content = content;
    new_s.image = image;

    const updatedNews = await new_s.save();
    res.json(updatedNews);
  } else {
    res.status(404);
    throw new Error("News and Event not found");
  }
});

const deleteNews = asyncHandler(async (req, res) => {
  const new_s = await News.findById(req.params.id);

  if (new_s) {
    await new_s.deleteOne();
    res.json({ message: "News and event Removed Successfully" });
  } else {
    res.status(404);
    throw new Error("News and event not found");
  }
});

module.exports = {
  getNews,
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
};
