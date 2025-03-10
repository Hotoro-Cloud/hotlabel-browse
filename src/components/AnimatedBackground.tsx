
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className }) => {
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950"></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 overflow-hidden">
        <div className="absolute top-[15%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-blue-200 dark:bg-blue-900 blur-[8rem] opacity-30 animate-float"></div>
        <div className="absolute bottom-[20%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-purple-200 dark:bg-indigo-900 blur-[7rem] opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] right-[25%] w-[25rem] h-[25rem] rounded-full bg-pink-100 dark:bg-fuchsia-900 blur-[6rem] opacity-20 animate-float" style={{ animationDelay: '3.5s' }}></div>
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmMWY1ZjkiIGQ9Ik0zNiAxOEgxOHYxOGgxOHpNMTggMzZIMHYxOGgxOHpNNTQgMEgzNnYxOGgxOHpNMTggMEgwdjE4aDE4ek0zNiAzNkgxOHYxOGgxOHpNNTQgMzZIMzZ2MThoMTh6Ii8+PHBhdGggZD0iTTI0IDI5Ljk5OWMwLTguMjg0IDYuNzE2LTE1IDE1LTE1IDguMjg0IDAgMTUgNi43MTYgMTUgMTUgMCA4LjI4NC02LjcxNiAxNS0xNSAxNSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTI3IDQ0Ljk5OWMwIDguMjg0LTYuNzE2IDE1LTE1IDE1LTguMjg0IDAtMTUtNi43MTYtMTUtMTUgMC04LjI4NCA2LjcxNi0xNSAxNS0xNSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTU0IDQ0Ljk5OWMwIDguMjg0LTYuNzE2IDE1LTE1IDE1LTguMjg0IDAtMTUtNi43MTYtMTUtMTUgMC04LjI4NCA2LjcxNi0xNSAxNS0xNSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTM5IDE2LjVDMzkgNy4zODcgNDUuMzg3IDEgNTQuNSAxIDYzLjYxMyAxIDcwIDcuMzg3IDcwIDE2LjVjMCA5LjExMy02LjM4NyAxNS41LTE1LjUgMTUuNSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTM5IDQ1LjVjMC05LjExMyA2LjM4Ny0xNS41IDE1LjUtMTUuNSA5LjExMyAwIDE1LjUgNi4zODcgMTUuNSAxNS41UzYzLjYxMyA2MSA1NC41IDYxIiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iLjUiLz48cGF0aCBkPSJNMTUgNDUuNWMwIDkuMTEzLTYuMzg3IDE1LjUtMTUuNSAxNS41Uy0xNiA1NC42MTMtMTYgNDUuNXM2LjM4Ny0xNS41IDE1LjUtMTUuNSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTI4IDE2LjVDMjggNy4zODcgMzQuMzg3IDEgNDMuNSAxIDUyLjYxMyAxIDU5IDcuMzg3IDU5IDE2LjVjMCA5LjExMy02LjM4NyAxNS41LTE1LjUgMTUuNSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTI4IDQ1LjVjMC05LjExMyA2LjM4Ny0xNS41IDE1LjUtMTUuNSA5LjExMyAwIDE1LjUgNi4zODcgMTUuNSAxNS41Uzc0LjYxMyA2MSA2NS41IDYxIiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iLjUiLz48cGF0aCBkPSJNNCA0NS41QzQgNTQuNjEzLTIuMzg3IDYxLTExLjUgNjFzLTE1LjUtNi4zODctMTUuNS0xNS41IDYuMzg3LTE1LjUgMTUuNS0xNS41IiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iLjUiLz48L2c+PC9zdmc+')] bg-[length:30px_30px] opacity-20"></div>
    </div>
  );
};

export default AnimatedBackground;
