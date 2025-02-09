import React from 'react';
import st from './navbar.module.scss'
import {useLang} from "../../context/language_context";

const Navbar = () => {
    const {langContent} = useLang()

    return (
        <div className={st.main}>
            <span className={st.text}>{langContent.navbar.title}</span>
        </div>
    );
};

export default Navbar;