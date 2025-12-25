// headerPresenter.jsx
import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { loginState, isNavigationMenuOpenState } from "../recoil/atoms.js";
import { loginWithGoogle, logoutUser } from "../firebase.js";

// View
import { HeaderView } from "../views/headerView.jsx";

export function HeaderPresenter() {
  const user = useRecoilValue(loginState);
  const [isNavigationMenuOpen, setNavigationMenuOpen] = useRecoilState(isNavigationMenuOpenState);


  function loginACB() {
    loginWithGoogle();
  }

  function logoutACB() {
    logoutUser();
  }

  function handleMenuItemClickACB() {
    setNavigationMenuOpen(false);
  }

  function handleToggleMenuACB() {
    setNavigationMenuOpen(!isNavigationMenuOpen);
  }

  return (
    <HeaderView
      user={user}
      onLogin={loginACB}
      onLogout={logoutACB}
      isNavigationMenuOpen={isNavigationMenuOpen}
      onToggleMenu={handleToggleMenuACB}
      onMenuItemClick={handleMenuItemClickACB} />
  );
}
