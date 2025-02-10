import React from 'react';
import st from './pagination_panel.module.scss'
import {Button} from "antd";
import {useLang} from "../../context/language_context";

interface IPaginationPanelComponentProps {
    page: number,
    setPage: (page: number) => void,
    totalPages: number,
    limit: number,
    setLimit: (limit: number) => void,

}

const PaginationPanelComponent = ({page, setPage, totalPages, limit, setLimit}: IPaginationPanelComponentProps) => {

    const {langContent} = useLang();

    const pageSizeOptions = [10, 30, 50];

    return (
        <div className={st.main}>
            <div className={st.pagination__container}>
                <Button
                    type="primary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}>
                    {langContent.pagination.pageDown}
                </Button>
                <span>{langContent.pagination.getPagesInfo(page, totalPages)}</span>
                <Button
                    type="primary"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}>
                    {langContent.pagination.pageUp}
                </Button>
            </div>
            <div className={st.page_size__container}>
                <span className={st.page_size_title}>{langContent.pagination.pageSizeTitle}</span>
                {
                    pageSizeOptions.map((pageSizeOption, index) => (
                        <Button
                            key={pageSizeOption}
                            type="primary"
                            disabled={limit === pageSizeOption}
                            onClick={() => setLimit(pageSizeOption)}>
                            {pageSizeOption}
                        </Button>
                    ))
                }
            </div>
        </div>
    );
};

export default PaginationPanelComponent;