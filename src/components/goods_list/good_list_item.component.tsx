import React from 'react';
import st from './goods_list.module.scss'
import {TGood} from "../../api/good_api";
import {useNavigate} from "react-router-dom";

interface GoodListItemProps {
    good: TGood;
    key?: string; // добавляем key сюда
}

const GoodListItemComponent = ({good}: GoodListItemProps) => {
    const navigate = useNavigate();

    const showDetails = () => {
        navigate(`/good/${good.uuid}`)
    }

    const showUpdatingForm = () => {
        navigate(`/good/form`, {state: {good}});
    }

    return (
        <div className={st.item_main}>
            {good.name}
            <span onClick={showDetails}>Детали</span>
            <span onClick={showUpdatingForm}>Форма</span>
        </div>
    );
};

export default GoodListItemComponent;