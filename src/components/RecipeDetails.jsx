import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const recipes = [
    {
      id: 1,
      title: 'Classic White Bread',
      description: 'Soft, fluffy homemade white bread with golden crust.',
      ingredients: ['4 cups flour', '2 tablespoons sugar', '1 packet yeast', '2 teaspoons salt', '1.5 cups warm water'],
      steps: [
        'Mix flour, sugar, yeast, and salt together in a large bowl.',
        'Add warm water gradually while stirring to form a dough.',
        'Knead the dough on a floured surface for 8-10 minutes.',
        'Place dough in a greased bowl, cover and let rise until doubled.',
        'Shape into a loaf, place in a pan, and let rise again for 30 minutes.',
        'Bake at 375°F (190°C) for about 30 minutes.',
        'Cool before slicing and serving.',
      ],
      image: 'https://simply-delicious-food.com/wp-content/uploads/2020/03/Easy-White-Bread-6-500x500.jpg',
    },
    {
      id: 2,
      title: 'Chocolate Cake',
      description: 'Rich and moist chocolate cake topped with creamy frosting.',
      ingredients: ['2 cups flour', '3/4 cup cocoa powder', '2 cups sugar', '1.5 teaspoons baking powder', '2 eggs', '1 cup milk', '1/2 cup vegetable oil'],
      steps: [
        'Preheat oven to 350°F (175°C) and grease the cake pans.',
        'Mix dry ingredients together in a bowl.',
        'Add eggs, milk, and oil. Mix until smooth.',
        'Pour batter into prepared pans.',
        'Bake for 30-35 minutes.',
        'Let cakes cool, then frost with your favorite chocolate frosting.',
      ],
      image: 'https://th.bing.com/th/id/OIP.XvyOaFCItjFH31cNxxlINwHaHa?rs=1&pid=ImgDetMain',
    },
    {
      id: 3,
      title: 'Banana Bread',
      description: 'Sweet banana bread made with ripe bananas and cinnamon.',
      ingredients: ['3 ripe bananas', '2 cups flour', '1 teaspoon baking soda', '1/2 teaspoon salt', '1/2 cup butter', '1 cup sugar', '2 eggs'],
      steps: [
        'Preheat oven to 350°F (175°C).',
        'Mash bananas in a bowl.',
        'Cream butter and sugar together, then add eggs and mashed bananas.',
        'Stir in dry ingredients until just combined.',
        'Pour batter into greased loaf pan.',
        'Bake for 60 minutes or until a toothpick comes out clean.',
        'Cool before slicing and serving.',
      ],
      image: 'https://food-fanatic-res.cloudinary.com/iu/s--YLLrI3YJ--/t_xlarge_p/cs_srgb,f_auto,fl_strip_profile.lossy,q_auto:420/v1471090691/classic-banana-bread-picture.jpg',
    },
    {
      id: 4,
      title: 'Apple Pie',
      description: 'Classic apple pie with buttery crust and cinnamon apples.',
      ingredients: ['6 cups sliced apples', '3/4 cup sugar', '2 tablespoons flour', '1 teaspoon cinnamon', 'Pie crust'],
      steps: [
        'Preheat oven to 425°F (220°C).',
        'Mix apples with sugar, flour, and cinnamon.',
        'Place mixture into bottom crust.',
        'Cover with top crust, seal and cut slits.',
        'Bake 40-45 minutes until golden brown.',
        'Cool before serving.',
      ],
      image: 'https://lilluna.com/wp-content/uploads/2023/07/apple-pie3-resize-18-357x500.jpg',
    },
    {
      id: 5,
      title: 'Lemon Cake',
      description: 'Light lemon cake drizzled with sweet lemon glaze.',
      ingredients: ['1.5 cups flour', '1 cup sugar', '2 teaspoons baking powder', '2 eggs', '1/2 cup butter', '1/2 cup milk', '1 lemon (juice and zest)'],
      steps: [
        'Preheat oven to 350°F (175°C).',
        'Mix flour, sugar, and baking powder.',
        'Add eggs, butter, milk, lemon juice and zest.',
        'Pour into greased cake pan.',
        'Bake for 30-35 minutes.',
        'Cool and drizzle with lemon glaze.',
      ],
      image: 'https://jeviko.com/wp-content/uploads/2024/04/chivar23_92410_Lemon_Cake_Recipe_aecf1538-a5b9-485d-b020-e5dec20d7e5b.jpg?v=1712504569',
    },
  ];

  const recipe = recipes.find((r) => r.id === parseInt(id));

  const goBack = () => {
    navigate('/blog');
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-12">
      {recipe ? (
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Display Recipe Image */}
          <div className="relative">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-80 object-cover rounded-t-lg"
            />
            <div className="absolute inset-x-0 bottom-10 text-4xl font-extrabold text-white text-center px-6">
              {recipe.title}
            </div>
          </div>

          {/* Recipe content */}
          <div className="p-8">
            <p className="text-center text-gray-700 text-lg mb-6">{recipe.description}</p>

            {/* Ingredients Box */}
            <div className="bg-pink-100 p-6 rounded-2xl shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-pink-700 mb-4">Ingredients</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Steps Box */}
            <div className="bg-pink-100 p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-pink-700 mb-4">Steps</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Back Button */}
            <div className="flex justify-center mt-10">
              <button
                onClick={goBack}
                className="bg-pink-700 hover:bg-pink-600 text-white text-lg font-semibold px-8 py-3 rounded-full transition"
              >
                Back to Blog
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500 text-2xl font-bold">Recipe not found.</p>
      )}
    </div>
  );
};

export default RecipeDetails;
