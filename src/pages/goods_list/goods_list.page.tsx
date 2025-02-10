import React, {useEffect, useRef, useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import {fetchGoods} from "../../api/good_api";
import st from './goods_list.module.scss';
import GoodListItemComponent from "./good_list_item.component";
import {useNavigate} from "react-router-dom";
import PaginationPanelComponent from "../../components/pagination_panel/pagination_panel.component";
import FilterSortPanelComponent from "../../components/filter_sort_panel/filter_sort_panel.component";
import {EGoodSortOptions} from "../../utils/types";
import {useLang} from "../../context/language_context";

const GoodsListPage = () => {
    const {langContent} = useLang();

    // ref of the scrollable container with list of goods
    const scrollableContainerRef = useRef<HTMLDivElement>(null)

    // pagination states
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    // filter and sort states
    const [sort, setSort] = useState<EGoodSortOptions>(EGoodSortOptions.PRICE_DOWN)
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)

    // query and query states for getting goods list
    const {data: goods, error, isLoading, refetch} = useQuery({
        queryKey: ["goods", page, limit, sort, minPrice, maxPrice],
        queryFn: () => fetchGoods(limit, page, sort, minPrice, maxPrice),
    });

    // how many pages of goods exists in database
    // depends on the limit
    const [totalPages, setTotalPages] = useState(0);
    useEffect(() => {
        if (goods?.pagesCount !== undefined) {
            setTotalPages(goods.pagesCount);
        }
    }, [goods]);

    // chose last page in the case when after using filters
    // total pages became less selected page number
    useEffect(() => {
        if (totalPages > 0 && totalPages < page) {
            setPage(totalPages);
        }
    }, [totalPages]);

    // smooth returns scroll to start position after every update list
    useEffect(() => {
        if (scrollableContainerRef.current) {
            scrollableContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, [goods]);

    // navigate object
    const navigate = useNavigate();

    // navigates to create goods form
    const goToForm = () => {
        navigate(`/good/form`);
    }

    return (
        <div className={st.main}>
            <div className={st.panel__container}>
                <FilterSortPanelComponent
                    sort={sort}
                    setSort={setSort}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                />
            </div>
            <div className={st.list__container} ref={scrollableContainerRef}>
                {
                    isLoading &&
                    <div className={st.screen_center__container}>
                        <p>{langContent.good_list.loading}</p>
                    </div>
                }

                {
                    error &&
                    <div className={st.screen_center__container}>
                        <p>`${langContent.good_list.error} ${error.message}`</p>
                    </div>
            }

            {(!isLoading && !error) &&
                goods?.goods.map((good) => (
                        <GoodListItemComponent key={good.article} good={good} refetchList={refetch}/>
                    ))
                }
            </div>
            <div className={st.panel__container}>
                <PaginationPanelComponent
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                    limit={limit}
                    setLimit={setLimit}
                />
            </div>
        </div>
    );
};

export default GoodsListPage;