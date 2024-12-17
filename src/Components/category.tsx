import { PencilLine } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Input } from "./ui/input";
import { apiClient } from "@/actions/api";
import { useCategoryContext } from "@/context/categoryConext";
import {CategoryType} from '../context/categoryConext'

interface CategoryPropTypes {
  categoryData:CategoryType,
  isOpen:boolean
}

export const Category = (props:CategoryPropTypes) => {
  const { categoryData, isOpen } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [categoryName, setCategoryName] = useState(categoryData.name);
  const {fetchCatagories} = useCategoryContext()
  
  useEffect(() => {
    if (isOpen && isEdit) {
      setIsEdit(false);
    }
  }, [isOpen]);

  const handleUpdate = (e:React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setIsEdit(true);
  };
  const handleDelete = (e:React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
  };
  const handleMouseLeave = () => {
    if (isEdit) {
      setCategoryName(categoryData.name)
      setIsEdit(false);
    }
  };
  const handleCategotyChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };
  const  handleSave =async ()=>{
    try{
      if(!categoryName){
        return;
      }
      const body = {
        categoryId: categoryData._id,
        categoryName:categoryName
      }
      await apiClient.sendRequest("PATCH",{},body)
      await fetchCatagories()

    }catch(err){
      console.log("error is ",err)
    }
  }


  return (
    <div
      onMouseLeave={handleMouseLeave}
      className="w-full flex justify-between items-center  font-semibold text-gray-800"
    >
      <div className="w-[60%] flex ">
        {isEdit ? (
          <Input
            value={categoryName}
            onChange={handleCategotyChange}
            onClick={(e) => e.stopPropagation()}
          />
        ) :categoryName}
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[40%] flex justify-around"
      >
        {isEdit ? (
          <Save size={20} onClick={handleSave} />
        ) : (
          <PencilLine size={20} onClick={handleUpdate} />
        )}
        <Trash2 size={20} onClick={handleDelete} />
      </div>
      <div></div>
    </div>
  );
};

export default Category;
