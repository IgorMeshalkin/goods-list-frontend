import React from 'react';
import st from './good_details.module.scss'
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchGood} from "../../api/good_api";

const GoodDetailsPage = () => {
    const {uuid} = useParams<{ uuid: string }>();

    // query and query states for getting good
    const {data: good, error, isLoading} = useQuery({
        queryKey: ["good", uuid],
        queryFn: () => fetchGood(uuid),
    });

    return (
        <div className={st.main}>
            {
                isLoading &&
                <p>Загрузка...</p>
            }

            {
                error &&
                <p>Ошибка: {error.message}</p>
            }

            {(!isLoading && !error) &&
                <span>{good.name}</span>
            }
        </div>
    );
};

export default GoodDetailsPage;