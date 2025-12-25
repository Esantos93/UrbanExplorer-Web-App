// footerPresenter.jsx
import React from "react";
import { useRecoilState } from "recoil";

// View
import { FooterView } from "../views/footerView.jsx";

export function FooterPresenter() {
    const year = new Date().getFullYear();

    return (
        <FooterView year={year} />
    );
}
