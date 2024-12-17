import { PencilLine } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";
import { Input } from "./ui/input";
import { useCategoryContext } from "@/context/categoryConext";
import { CategoryType } from "../context/categoryConext";
import { Plus } from "lucide-react";

interface CategoryPropTypes {
  categoryData: CategoryType;
  isOpen: boolean;
}

export const Category = (props: CategoryPropTypes) => {
  const { categoryData, isOpen } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [categoryName, setCategoryName] = useState(categoryData.name);
  const [newCategory, setNewCategory] = useState("");
  const { updateCategory, deleteCategory, createCategory } =
    useCategoryContext();
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && isEdit) {
      setIsEdit(false);
    }
  }, [isOpen]);

  const handleAllowEdit = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setIsEdit(true);
  };
  const handleCategoryDelete = async (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    try {
      const id = categoryData._id;
      await deleteCategory(id);
    } catch (err) {
      console.log("Error while deleting cate ", err);
      
    }
  };
  const handleMouseLeave = () => {
    console.log("leaving the");
    if (isEdit) {
      setCategoryName(categoryData.name);
      setIsEdit(false);
    }
    if (isAdd) {
      setIsAdd(false);
    }
  };
  const handleCategotyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };
  const handleSave = async (isCreate = false) => {
    try {
      
      if (isCreate) {
        //verify the input
        if (!newCategory || newCategory.trim() === "") {
          return
        }
        await createCategory(newCategory, categoryData._id);
        setIsAdd(false);
      } else {
        if (!categoryName || categoryName.trim() === "") {
          return;
        }
        await updateCategory(categoryData._id, categoryName.trim());
        setIsEdit(false)
      }
    } catch (err) {
      console.log("error is ", err);
      
    }
  };

  const handleAllowAdd = async (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    inputRef.current?.focus();
    setIsAdd(true);
  };


  return (
    <>
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
          ) : (
            categoryName
          )}
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[40%] flex justify-around"
        >
          {!isAdd ? (
            <>
              {!isEdit && <Plus size={25} onClick={handleAllowAdd} />}
              {isEdit ? (
                <Save size={25} onClick={() => handleSave(false)} />
              ) : (
                <PencilLine size={25} onClick={handleAllowEdit} />
              )}
              {(!isEdit && !isAdd) && (
                categoryData.isRoot ? null:<Trash2 size={25} onClick={handleCategoryDelete} />
              )}
            </>
          ) : (
            <Save
              size={30}
              onClick={() => {
                handleSave(true);
              }}
            />
          )}
        </div>
      </div>
      <div>
        {isAdd ? (
          <Input
            ref={inputRef}
            onClick={(e) => e.stopPropagation()}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onBlur={() => {
              console.log("on blur triggered")
              setIsAdd(false);
              inputRef.current?.blur();
              handleSave(true)
            }}
          />
        ) : //  onMouseLeave={handleMoveOutFromInput}

        null}
      </div>
    </>
  );
};

export default Category;
