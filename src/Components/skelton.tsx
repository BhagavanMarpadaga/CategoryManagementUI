import { Skeleton } from "./ui/skeleton";

const CustomSkeleton = () => {
  return (
    <>
      <div className="space-y-2  ml-5 mt-10">
        <Skeleton className="h-6 w-[250px]" />
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-6 w-[180px]" />
        <Skeleton className="h-6 w-[180px]" />
        <Skeleton className="h-6 w-[150px]" />
        <Skeleton className="h-6 w-[100px]" />
        <Skeleton className="h-6 w-[100px]" />
      </div>
    </>
  );
};

export default CustomSkeleton
