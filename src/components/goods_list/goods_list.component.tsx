import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import {fetchGoods} from "../../api/good_api";
import st from './goods_list.module.scss';
import GoodListItemComponent from "./good_list_item.component";
import {useNavigate} from "react-router-dom";

const GoodsListComponent = () => {
    // ref of the scrollable container with list of goods
    const scrollableContainerRef = useRef<HTMLDivElement>(null)

    // pagination states
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    // query and query states for getting goods list
    const {data: goods, error, isLoading} = useQuery({
        queryKey: ["goods", page, limit],
        queryFn: () => fetchGoods(limit, page),
    });

    // how many pages of goods exists in database
    // depends on the limit
    const totalPages = useMemo(() => {
        return goods?.pagesCount ?? 0;
    }, [goods])

    // smooth returns scroll to start position after every update list
    useEffect(() => {
        if (scrollableContainerRef.current) {
            scrollableContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, [goods]);

    const navigate = useNavigate();

    const goToForm = () => {
        navigate(`/good/form`);
    }

    return (
        <div className={st.main}>
            <div className={st.list__container} ref={scrollableContainerRef}>
                {
                    isLoading &&
                    <p>Загрузка...</p>
                }

                {
                    error &&
                    <p>Ошибка: {error.message}</p>
                }

                {(!isLoading && !error) &&
                    goods?.goods.map((good) => (
                        <GoodListItemComponent key={good.article} good={good}/>
                    ))
                }
            </div>
            <div className={st.pagination_panel__container}>
                <div>
                    <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                        Назад
                    </button>
                    <span> Страница {page} </span>
                    <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                        Вперёд
                    </button>
                    <button disabled={limit === 10} onClick={() => setLimit(10)}>
                        10
                    </button>
                    <button disabled={limit === 20} onClick={() => setLimit(20)}>
                        20
                    </button>
                    <button disabled={limit === 30} onClick={() => setLimit(30)}>
                        30
                    </button>
                    <button onClick={() => goToForm()}>
                        New
                    </button>
                </div>
                <span>Всего страниц: {totalPages}</span>
            </div>
        </div>
    );
};

export default GoodsListComponent;