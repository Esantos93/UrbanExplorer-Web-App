// App.jsx
import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Presenters
import { HeaderPresenter } from "./headerPresenter";
import { SearchPresenter } from "./searchPresenter";
import { FavoritesPresenter } from "./favoritesPresenter";
import { FooterPresenter } from "./footerPresenter";

// Router
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <HeaderPresenter />
        <SearchPresenter />
        <FooterPresenter />
      </>
    )
  },
  {
    path: "/search",
    element: (
      <>
        <HeaderPresenter />
        <SearchPresenter />
        <FooterPresenter />
      </>
    )
  },
  {
    path: "/favorites",
    element: (
      <>
        <HeaderPresenter />
        <FavoritesPresenter />
        <FooterPresenter />
      </>
    )
  }
]);

// App root
export default function App() {
  return <RouterProvider router={router} />;
}