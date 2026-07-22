import { createContext, useContext } from "react";
import { localPortfolioContent } from "@/content/localPortfolioContent";

export const PortfolioContentContext = createContext(localPortfolioContent);

export function usePortfolioContent() {
  return useContext(PortfolioContentContext);
}
