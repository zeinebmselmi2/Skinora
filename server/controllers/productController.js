const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    // populate remplace les id par les informations de l'auteur et de la catégorie.
    const products = await Product.find()
      .populate('author', 'name email')
      .populate('category', 'name description')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('author', 'name email')
      .populate('category', 'name description');

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }

    res.json(product);
  } catch (error) {
    res.status(404).json({ message: 'Produit introuvable.' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, description, price, imageUrl, category } = req.body;

    if (!title || !description || price === undefined || price === '' || !category) {
      return res.status(400).json({
        message: 'Titre, description, prix et catégorie sont obligatoires.'
      });
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      imageUrl: imageUrl || '',
      category,
      author: req.user._id
    });

    await product.populate('author', 'name email');
    await product.populate('category', 'name description');

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }

    // Seul l'auteur du produit peut le supprimer.
    if (product.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Vous pouvez supprimer uniquement vos propres produits.'
      });
    }

    await product.deleteOne();
    res.json({ message: 'Produit supprimé.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct
};
