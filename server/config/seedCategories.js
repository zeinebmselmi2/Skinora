const Category = require('../models/Category');

// Catégories du cahier des charges. Créées une seule fois si la collection est vide.
const defaults = [
  {
    name: 'Soins du visage',
    description: 'Nettoyants, sérums, crèmes et soins quotidiens pour le visage.'
  },
  {
    name: 'Soins du corps',
    description: 'Laits, gommages et soins hydratants pour le corps.'
  },
  {
    name: 'Soins solaires',
    description: 'Protections solaires pour le visage et le corps.'
  },
  {
    name: 'Soins des cheveux',
    description: 'Shampoings, masques et soins capillaires.'
  }
];

const seedCategories = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(defaults);
    console.log('Catégories initiales créées.');
  }
};

module.exports = seedCategories;
