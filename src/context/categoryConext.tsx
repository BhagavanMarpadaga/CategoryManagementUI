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
  updateCategory: (id: string, name: string) => Promise<void>;
  isApiLoading: boolean;
  categoryData: unknown;
  createCategory:(categoryName:string,parentId:string)=> Promise<void>;
  deleteCategory:(id:string)=>Promise<void>
  error:unknown
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
  const [categoryData, setCategoryData] = useState<CategoryType | null>(
    {} as CategoryType
  );
  const [error,setError] = useState<unknown>({isError:false,msg:""});

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
      // if no data foudn in DB
      if(Array.isArray(categoryRes)){
        setCategoryData({} as CategoryType);
      }else{
        setCategoryData(categoryRes as CategoryType)
      }
      
    } catch (err) {
      console.error("Error fetching categories: ", JSON.stringify(err));
      setError({isError:true,msg:err})
    } finally {
      setIsApiLoading(false);
    }
  };

  //create a category

  const createCategory = async(categoryName:string,parentId:string)=>{
    try{
      setIsApiLoading(true)
      const body = {
        categoryName: categoryName,
        categoryParentId: parentId,
      };
      await apiClient.sendRequest("POST",{},body)
      await fetchCatagories()

    }catch(err){
      console.log("Error while craeting category",err)
      setError({isError:true,msg:err})
      throw err
    }finally{
      setIsApiLoading(false)
    }
  }

  //update a category
  const updateCategory = async (id: string, name: string) => {
    setIsApiLoading(true);
    try {
      const body = {
        categoryId: id,
        categoryName: name,
      };
      await apiClient.sendRequest("PATCH", {}, body);
      await fetchCatagories();
    } catch (err) {
      setError({isError:true,msg:err})
      console.log(err);
      throw err;
    }finally{
      setIsApiLoading(false);
    }
  };
  //delete category
  const deleteCategory = async(id:string)=>{
    setIsApiLoading(true);
    try{
      await apiClient.sendRequest("DELETE",{categoryId:id},{})
      await fetchCatagories();
    }catch(err){
      setError({isError:true,msg:err})
      console.log('Error from delete category ',err)
      throw err
    }finally{
      setIsApiLoading(false);
    }
  }

  // 8. Provide the context values
  return (
    <CategoryContext.Provider
      value={{
        fetchCatagories: fetchCatagories,
        isApiLoading: isApiLoading,
        categoryData: categoryData,
        updateCategory: updateCategory,
        deleteCategory:deleteCategory,
        createCategory:createCategory,
        error:error
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
