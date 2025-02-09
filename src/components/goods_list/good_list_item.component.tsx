import React from 'react';
import st from './goods_list.module.scss'
import {TGood} from "../../api/GoodApi";
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

    return (
        <div className={st.item_main} onClick={showDetails}>
            {good.name}
        </div>
    );
};

export default GoodListItemComponent;