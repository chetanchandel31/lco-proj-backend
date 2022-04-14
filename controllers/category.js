const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = cate; // this is a mongodb document, that's why it'll have `save` method in `updateCategory`
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "not able to save category in db",
      });
    }
    res.json(category);
  });
};

exports.getCategory = () => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "no categories found",
      });
    }

    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category; // this is a mongodb document, that's why it'll have `save` method
  category.name = req.body.name; // TODO: we can directly mutate a doc and call .save()?

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "failed to update category",
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "failed to delete category",
      });
    }

    res.json({
      message: "successfully deleted",
    });
  });
};
