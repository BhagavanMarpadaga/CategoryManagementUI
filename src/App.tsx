import Child from "./Components/children";
import { CategoryType, useCategoryContext } from "./context/categoryConext";


function App() {
  const { isApiLoading, categoryData  } = useCategoryContext();

  return <>{isApiLoading ? "loading " : categoryData && Object.keys(categoryData).length >0 && <Child data={categoryData as CategoryType} />}</>;
}

export default App;
