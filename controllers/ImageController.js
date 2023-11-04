const ImageModel = require("../models/ImageModel"); 
const asyncHandler = require("express-async-handler");

const getGallery = asyncHandler(async (req, res) => {
  const gallery = await ImageModel.find(); 
  res.json(gallery);
});

const createGallery = asyncHandler(async (req, res) => {
  const { image } = req.body;

  if (!image) {
    res.status(400);
    throw new Error("Please select an image");
  }

  const gallery = new ImageModel({ 
    image,
  });

  const createdGallery = await gallery.save();

  res.status(201).json(createdGallery);
});

const getGalleryById = asyncHandler(async (req, res) => {
  const gallery = await ImageModel.findById(req.params.id);

  if (gallery) {
    res.json(gallery);
  } else {
    res.status(404).json({ message: "Image Not Found" });
  }
});

const deleteGallery = asyncHandler(async (req, res) => {
  const gallery = await ImageModel.findById(req.params.id);

  if (gallery) {
    await gallery.deleteOne();
    res.json({ message: "Image Removed Successfully" });
  } else {
    res.status(404);
    throw new Error("Image not found");
  }
});

module.exports = {
  getGallery,
  createGallery,
  getGalleryById,
  deleteGallery, 
};
