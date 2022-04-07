import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer
} from "react";
import axios from "axios";
import { Compose , filterSortBy , categoryFilter , ratingsFilter, inStockProducts, fastDeliveryProducts } from "../../Utils/filter";
import { filterProductsReducer } from "../filter-reducer";
import { useSearchParams } from "react-router-dom";


const ProductContext = createContext();
const useProducts = () => useContext(ProductContext);

const ProductProvider = ({ children }) => {
  const [productsList, setProductsList] = useState([]);
  const [state, dispatch] = useReducer(filterProductsReducer, {
    sortBy: "",
    category: { Bats: false, Balls: false , Others: false },
    rating: "",
    outOfStock: false,
    fastDelivery: false,
  });

    const finalFilteredProducts = Compose(
      state,
      filterSortBy,
      categoryFilter,
      ratingsFilter,
      inStockProducts,
      fastDeliveryProducts
    )(productsList);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { products },
        } = await axios.get("/api/products");
        setProductsList(products);
      } catch {
        console.error("ERROR AGAYA");
      }
    })();
  }, []);

    const [searchParams] = useSearchParams();
    const categorygot = searchParams.get("categories");
    useEffect(() => {
      categorygot &&
        dispatch({
          type: "FILTER_BY_CATEGORY",
          payload: categorygot,
        });
      return () => dispatch({ type: "CLEAR" });
    }, [categorygot]);

  return (
    <ProductContext.Provider
      value={{  products: finalFilteredProducts, state, dispatch }}
    >
      {children}
    </ProductContext.Provider>
  );
};
export { ProductProvider, useProducts };
