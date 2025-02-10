import React, {useEffect} from 'react';
import st from './filter_sort_panel.module.scss'
import {Button, InputNumber} from "antd";
import {useLang} from "../../context/language_context";
import {EGoodSortOptions} from "../../utils/types";

interface IFilterSortPanelProps {
    sort: EGoodSortOptions;
    setSort: (sort: EGoodSortOptions) => void;
    minPrice: number | undefined;
    setMinPrice: (minPrice: number) => void;
    maxPrice: number | undefined;
    setMaxPrice: (maxPrice: number) => void;
}

const FilterSortPanelComponent = ({sort, setSort, minPrice, setMinPrice, maxPrice, setMaxPrice }: IFilterSortPanelProps) => {
    const {langContent} = useLang();

    return (
        <div className={st.main}>
            <div className={st.sort__container}>
                <Button
                    type="primary"
                    disabled={sort === EGoodSortOptions.PRICE_DOWN}
                    onClick={() => setSort(EGoodSortOptions.PRICE_DOWN)}>
                    {langContent.filter_sort.price_down}
                </Button>
                <Button
                    type="primary"
                    disabled={sort === EGoodSortOptions.PRICE_UP}
                    onClick={() => setSort(EGoodSortOptions.PRICE_UP)}>
                    {langContent.filter_sort.price_up}
                </Button>
            </div>
            <div className={st.filter__container}>
                <span className={st.title}>{langContent.filter_sort.filter_from}</span>
                <InputNumber
                    value={minPrice}
                    onChange={setMinPrice}
                    min={0}
                    max={maxPrice ? maxPrice : Infinity}
                />
                <span className={st.title}>{langContent.filter_sort.filter_to}</span>
                <InputNumber
                    value={maxPrice}
                    onChange={setMaxPrice}
                    min={minPrice ? minPrice : 0}
                />
            </div>
        </div>
    );
};

export default FilterSortPanelComponent;