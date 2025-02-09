import React from 'react';
import st from './common_layout.module.scss'
import Navbar from "../navbar/navbar";
import {Outlet} from "react-router-dom";

const CommonLayoutComponent = () => {
    return (
        <div className={st.main}>
            <div className={st.navbar__container}>
                <Navbar/>
            </div>
            <div className={st.content__container}>
                <Outlet/>
            </div>
        </div>
    );
};

export default CommonLayoutComponent;