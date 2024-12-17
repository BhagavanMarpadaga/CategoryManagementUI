import Child from "./Components/children";
import CustomSkeleton from "./Components/skelton";
import { CategoryType, useCategoryContext } from "./context/categoryConext";


function App() {
  const { isApiLoading, categoryData ,error  } = useCategoryContext();
  //@ts-expect-error false
  if(error && Object.prototype.hasOwnProperty.call(error, "isError") && (error as unknown).isError===true){
    return <><p className="text-2xl">Some thing went wrong : Please be patient :)</p></>
  }

  return <>{isApiLoading ? <CustomSkeleton/> : categoryData && Object.keys(categoryData).length >0 ? <Child data={categoryData as CategoryType} />:"No Categories found"}</>;
}

export default App;
