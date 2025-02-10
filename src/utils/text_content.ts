import {EMethod} from "./types";

export const text_content: any[] = [
    {
        id: 'ru',
        label: 'Русский',
        navbar: {
            title: 'Панель навигации'
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
                getSubmitButtonText:  (method: EMethod) => {
                    return method === 'POST' ? 'Создать' : 'Обновить'
                },
                getSuccessMessage: (method: EMethod) => {
                    return method === 'POST' ? 'Товар успешно создан' : 'Товар успешно обновлён'
                },
                getFailMessage: (method: EMethod) => {
                    const differentSubString =  method === 'POST' ? 'создать' : 'обновить'
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