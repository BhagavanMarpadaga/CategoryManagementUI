/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "./ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import  { useState } from "react";
import Category from "./category";
import { CategoryType } from "@/context/categoryConext";



const Child = (props:{data:CategoryType}) => {
  const { data } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);


  return (
    <li>
      <Card className="w-[300px] mb-2">
        <CardContent className=" p-1 flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {data.children.length > 0 ? (
            isOpen ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )
          ) : (
            <div className="w-5"></div>
          )}
          <Category categoryData = {data} isOpen={isOpen}/>
      
        </CardContent>
      </Card>

      {/* Render children */}
      {isOpen && data.children.length > 0 && (
        <ul className="ml-6 border-l border-gray-200 pl-3 list-none">
          {data.children.map((childData: any, index: number) => (
            <Child key={index} data={childData} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Child;
