import React from 'react';
import st from './good_details.module.scss'
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchGood} from "../../api/good_api";
import {useLang} from "../../context/language_context";
import {img_url} from "../../utils/common_variables";
import {Image} from "antd";
const AntImage = Image as unknown as React.FC<any>;

const GoodDetailsPage = () => {
    const {uuid} = useParams<{ uuid: string }>();

    const {langContent} = useLang();

    // query and query states for getting good
    const {data: good, error, isLoading} = useQuery({
        queryKey: ["good", uuid],
        queryFn: () => fetchGood(uuid),
    });

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
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                            src={`${img_url}${good.image}`}
                            alt=''
                            fallback="default_good.png"
                        />
                    </div>
                    <div className={st.info__container}>

                    </div>
                    <div className={st.buttons__container}>

                    </div>
                </>
            }
        </div>
    );
};

export default GoodDetailsPage;