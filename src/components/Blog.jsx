import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const recipes = [
    {
      id: 1,
      title: 'Classic White Bread',
      description: 'Soft, fluffy homemade white bread with golden crust.',
      image: 'https://simply-delicious-food.com/wp-content/uploads/2020/03/Easy-White-Bread-6-500x500.jpg',
    },
    {
      id: 2,
      title: 'Chocolate Cake',
      description: 'Rich and moist chocolate cake topped with creamy frosting.',
      image: 'https://th.bing.com/th/id/OIP.XvyOaFCItjFH31cNxxlINwHaHa?rs=1&pid=ImgDetMain',
    },
    {
      id: 3,
      title: 'Banana Bread',
      description: 'Sweet banana bread made with ripe bananas and cinnamon.',
      image: 'https://food-fanatic-res.cloudinary.com/iu/s--YLLrI3YJ--/t_xlarge_p/cs_srgb,f_auto,fl_strip_profile.lossy,q_auto:420/v1471090691/classic-banana-bread-picture.jpg',
    },
    {
      id: 4,
      title: 'Apple Pie',
      description: 'Classic apple pie with buttery crust and cinnamon apples.',
      image: 'https://lilluna.com/wp-content/uploads/2023/07/apple-pie3-resize-18-357x500.jpg',
    },
    {
      id: 5,
      title: 'Lemon Cake',
      description: 'Light lemon cake drizzled with sweet lemon glaze.',
      image: 'https://jeviko.com/wp-content/uploads/2024/04/chivar23_92410_Lemon_Cake_Recipe_aecf1538-a5b9-485d-b020-e5dec20d7e5b.jpg?v=1712504569',
    },
  ];

  return (
    <div className="bg-white min-h-screen pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-pink-700 text-center mb-12">
          Our Delicious Recipes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 active:scale-95 transition duration-300 overflow-hidden cursor-pointer"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-pink-700 mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                <Link
                  to={`/recipe/${recipe.id}`}
                  className="inline-block bg-pink-700 text-white px-4 py-2 rounded-md hover:bg-white hover:text-pink-700 border hover:border-pink-700 transition"
                >
                View Recipe</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Blog;
