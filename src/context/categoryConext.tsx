import { apiClient } from "@/actions/api";
import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";

// 1. Define the shape of a Category

// 2. Define the shape of the Context
interface CategoryContextType {
  fetchCatagories: () => Promise<void>;
  isApiLoading: boolean;
  categoryData: unknown;
}

// 3. Create a default context value
const CategoryContext = createContext({} as CategoryContextType);

// 4. Custom Hook to Use the Context

export interface CategoryType {
  _id: string; // Unique identifier for the category
  name: string; // Category name
  isRoot?: boolean; // Optional flag for root categories
  parent?: string; // Parent category ID (optional for root nodes)
  __v: number; // Version key (used by MongoDB)
  children: CategoryType[]; // Recursive array of child categories
}

// 5. Define the Provider Props
interface CategoryProviderProps {
  children: ReactNode;
}

export const useCategoryContext = () => {
  return useContext(CategoryContext);
};

// 6. CategoryContextProvider Component
export const CategoryContextProvider = ({
  children,
}: CategoryProviderProps) => {
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<CategoryType|null>({} as CategoryType);

  useEffect(() => {
    fetchCatagories();
  }, []);

  // 7. Fetch Categories Function
  const fetchCatagories = async () => {
    try {
      setIsApiLoading(true);
      const categoryRes = await apiClient.sendRequest(
        "GET",
        {},
        {},
        "children"
      );
      setCategoryData(categoryRes as CategoryType);
    } catch (err) {
      console.error("Error fetching categories: ", JSON.stringify(err));
    } finally {
      setIsApiLoading(false);
    }
  };

  // 8. Provide the context values
  return (
    <CategoryContext.Provider
      value={{
        fetchCatagories: fetchCatagories,
        isApiLoading: isApiLoading,
        categoryData: categoryData,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
