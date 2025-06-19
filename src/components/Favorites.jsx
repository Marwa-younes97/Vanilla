import ProductCard from './ProductCard';
import { useFavorites } from '../context/FavoritesContext';

const Favorites = () => {
  const { favorites, loading, error } = useFavorites();

  if (loading) {
    return <div className="text-center mt-10 text-lg font-semibold text-gray-600">Loading favorites...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-lg font-semibold text-red-600">{error}</div>;
  }

  return (

    <div className="min-h-screen bg-gray-50 mt-20 px-6">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold mb-8 text-pink-700 text-center">
      My Favorite Products
    </h2>

    {favorites.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {favorites.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-lg text-center">
        You have no favorite products yet.
      </p>
    )}
  </div>
</div>

  );
};

export default Favorites;
