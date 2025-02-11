import React from 'react';
import st from './goods_list.module.scss'
import {deleteGood, TGood} from "../../api/good_api";
import {useNavigate} from "react-router-dom";
import {Image} from 'antd';
import {img_url} from "../../utils/common_variables";
import {useLang} from "../../context/language_context";
import {formatPrice} from "../../utils/common_functions";
import ItemActionsPanelComponent from "../../components/item_actions_panel/item_actions_panel.component";
import {TItemActionsLangType} from "../../utils/text_content";

const AntImage = Image as unknown as React.FC<any>;

interface GoodListItemProps {
    good: TGood;
    refetchList: () => void,
    key?: string;
}

const GoodListItemComponent = ({good, refetchList}: GoodListItemProps) => {
    const {langContent} = useLang();
    const navigate = useNavigate();

    // navigates to good details page
    const showDetails = () => {
        navigate(`/good/${good.uuid}`)
    }

    // navigates to edition form
    const showUpdatingForm = () => {
        navigate(`/good/form`, {state: {good}});
    }

    return (
        <div className={st.item_main}>
            {/* Good image if exists or default image */}
            <div className={st.item_image__container}>
                <AntImage
                    style={{width: '100%'}}
                    src={`${img_url}${good.image}`}
                    alt=''
                    fallback="default_good.png"
                />
            </div>

            {/* Good info: name, article, descripting and prices */}
            <div className={st.item_info__container}>
                <div className={st.item_name__container}>
                    <span className={st.item_name}>{`${good.name}`}</span>
                    <span>{`(${langContent.good_list_item.article} ${good.article})`}</span>
                </div>
                {
                    good.description &&
                    <span className={st.item_description}>{good.description}</span>
                }
                <div className={st.item_price__container}>
                    {
                        good.discountedPrice ?
                            <>
                                <span className={st.available_price}>{formatPrice(good.discountedPrice)}</span>
                                <span className={st.price_before_discount}>{formatPrice(good.price)}</span>
                            </> :
                            <span className={st.available_price}>{formatPrice(good.price)}</span>
                    }
                </div>
            </div>

            {/* Details, Edit and Delete buttons */}
            <div className={st.item_buttons__container}>
                <ItemActionsPanelComponent
                    uuid={good.uuid}
                    deleteFunction={deleteGood}
                    afterSuccessfulDeleteFn={refetchList}
                    includeDetails
                    itemName={good.name}
                    itemLangActions={langContent.good_item_actions as TItemActionsLangType}
                    onDetailsClick={showDetails}
                    onEditClick={showUpdatingForm}
                />
            </div>
        </div>
    );
};

export default GoodListItemComponent;