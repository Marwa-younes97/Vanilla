import ProductCard from './ProductCard';
import { useFavorites } from '../context/FavoritesContext';

const Favorites = () => {
  const { favorites, loading, error } = useFavorites();

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold text-gray-600">
        Loading favorites...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg font-semibold text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-pink-700">
        My Favorite Products
      </h2>

      {favorites.length > 0 ? (
        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
          "
        >
{favorites.map((product) => (
  <div
    key={product._id}
    className="transform scale-70"
  >
    <ProductCard product={product} />
  </div>
))}

        </div>
      ) : (
        <p className="text-gray-500 text-base">
         You have no favorite products yet.
        </p>
      )}
    </div>
  );
};

export default Favorites;


