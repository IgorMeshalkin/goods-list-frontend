import React from 'react';
import st from './good_details.module.scss'
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {deleteGood, fetchGood} from "../../api/good_api";
import {useLang} from "../../context/language_context";
import {img_url} from "../../utils/common_variables";
import {Image} from "antd";
import {formatPrice} from "../../utils/common_functions";
import ItemActionsPanelComponent from "../../components/item_actions_panel/item_actions_panel.component";
import {TItemActionsLangType} from "../../utils/text_content";

const AntImage = Image as unknown as React.FC<any>;

const GoodDetailsPage = () => {
    const {uuid} = useParams<{ uuid: string }>();

    const navigate = useNavigate();

    const {langContent} = useLang();

    // query and query states for getting good
    const {data: good, error, isLoading} = useQuery({
        queryKey: ["good", uuid],
        queryFn: () => fetchGood(uuid),
    });

    // navigates to edition form
    const showUpdatingForm = () => {
        navigate(`/good/form`, {state: {good}});
    }

    return (
        <div className={st.main}>
            {
                isLoading &&
                <p>{langContent.good_details.loading}</p>
            }

            {
                error &&
                <p>`${langContent.good_details.error} ${error.message}`</p>
            }

            {(!isLoading && !error) &&
                <>
                    <div className={st.image__container}>
                        <AntImage
                            wrapperClassName={st.custom_ant_image}
                            src={`${img_url}${good.image}`}
                            alt=""
                            fallback="/default_good.png"
                        />
                    </div>
                    <div className={st.info__container}>
                        <div className={st.join__container}>
                            <span className={st.name}>{good.name}</span>
                            <span
                                className={st.article}>{`(${langContent.good_details.article} ${good.article})`}</span>
                        </div>
                        {
                            good.description &&
                            <span className={st.description}>{good.description}</span>
                        }
                        <div className={st.price__container}>
                            {good.discountedPrice &&
                                <span className={st.before_discount_price}>{formatPrice(good.price)}</span>
                            }
                            <span
                                className={st.available_price}>{formatPrice(good.discountedPrice ? good.discountedPrice : good.price)}</span>
                        </div>
                    </div>
                    <div className={st.buttons__container}>
                        <div className={st.item_action__container}>
                            <ItemActionsPanelComponent
                                uuid={good.uuid}
                                deleteFunction={deleteGood}
                                direction={'horizontal'}
                                afterSuccessfulDeleteFn={() => navigate('/')}
                                includeBackButton
                                itemName={good.name}
                                itemLangActions={langContent.good_item_actions as TItemActionsLangType}
                                onEditClick={showUpdatingForm}
                            />
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default GoodDetailsPage;