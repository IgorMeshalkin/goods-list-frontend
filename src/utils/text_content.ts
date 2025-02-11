import {EMethod} from "./types";

// type for use item actions panel for different objects
export type TItemActionsLangType = {
    details: string,
    edit: string,
    delete: string,
    back_button: string,
    delete_confirm_modal: {
        title: string
        ok_button_text: string
        cansel_button_text: string
        getDeleteConfirmText: (value: any) => void;
    },
    successful_delete_message: string,
    fail_delete_message: string,
}

export const text_content: any[] = [
    {
        id: 'ru',
        label: 'Русский',
        navbar: {
            title: 'Панель навигации'
        },
        pagination: {
            pageDown: 'Назад',
            pageUp: 'Вперед',
            getPagesInfo: (page: number, totalPages: number) => {
                return `${page} из ${totalPages}`;
            },
            pageSizeTitle: 'Всего на странице:'
        },
        filter_sort: {
            price_down: 'Сначала дорогие',
            price_up: 'Сначала дешёвые',
            filter_from: 'Цена от:',
            filter_to: 'Цена до:',
            errors: {
                max_less_min: 'Максимальная цена должна быть больше чем минимальная.',
                positive_value: 'Цены должны быть положительными числами'
            }
        },
        good_list: {
            loading: 'Загрузка...',
            error: 'Ошибка:'
        },
        good_item_actions: {
            details: 'Подробнее',
            edit: 'Изменить',
            delete: 'Удалить',
            back_button: 'Назад',
            delete_confirm_modal: {
                title: 'Подтверждение удаления',
                ok_button_text: 'Удалить',
                cansel_button_text: 'Назад',
                getDeleteConfirmText: (goodName: string) => {
                    return `Вы уверены что хотите удалить товар: "${goodName}"`
                }
            },
            successful_delete_message: 'Товар успешно удалён',
            fail_delete_message: 'Не удалось удалить товар. Повторите попытку позже',
        },
        good_details: {
            loading: 'Загрузка...',
            error: 'Ошибка:',
            article: 'Артикул:'
        },
        good_list_item: {
            article: 'арт.'
        },
        good_form: {
            labels: {
                name: 'Название',
                description: 'Описание',
                price: 'Цена',
                discounted_price: 'Цена со скидкой',
                article: 'Артикул',
                image: 'Изображение'
            },
            values: {
                upload_image: 'Загрузить изображение',
                getSubmitButtonText: (method: EMethod) => {
                    return method === 'POST' ? 'Создать' : 'Обновить'
                },
                getSuccessMessage: (method: EMethod) => {
                    return method === 'POST' ? 'Товар успешно создан' : 'Товар успешно обновлён'
                },
                getFailMessage: (method: EMethod) => {
                    const differentSubString = method === 'POST' ? 'создать' : 'обновить'
                    return `Не удалось ${differentSubString} товар. Повторите попытку позднее.`
                },
            },
            validate: {
                required_field: 'Обязательное поле',
                positive_number: 'Цена должна быть больше 0',
                discounted_price_less_than_price: 'Цена со скидкой должна быть меньше обычной цены'
            }
        }
    }
]