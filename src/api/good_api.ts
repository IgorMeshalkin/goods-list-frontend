import {z} from "zod";
import {api_url} from "../utils/common_variables";
import {TFormData} from "../pages/good_form/good_form.page";
import {EGoodSortOptions, EMethod} from "../utils/types";

// separated good schema
export const goodSchema = z.object({
    uuid: z.string().nullable().optional(),
    name: z.string(),
    description: z.string().nullable().optional(),
    price: z.number(),
    discountedPrice: z.number().nullable().optional(),
    article: z.string(),
    image: z.string().nullable().optional(),
});

// array of goods and how many pages available schema
const goodsSchema = z.object({
    goods: z.array(goodSchema),
    pagesCount: z.number()
})

// separated good type
export type TGood = z.infer<typeof goodSchema>;

// array of goods and how many pages available type
export type TGoods = z.infer<typeof goodsSchema>;

// returns array of goods and how many pages available number
// supports pagination, sorting and filtering
export const fetchGoods = async (limit: number, page: number, sort: EGoodSortOptions, minPrice: number | undefined, maxPrice: number | undefined,): Promise<TGoods> => {
    let paramsString = `?limit=${limit}`;
    paramsString += `&offset=${limit * (page - 1)}`;
    paramsString += `&sort=${sort}`;
    if (minPrice) {
        paramsString += `&minPrice=${minPrice}`
    }
    if (maxPrice) {
        paramsString += `&maxPrice=${maxPrice}`
    }
    // send query
    const res = await fetch(`${api_url}/goods${paramsString}`);
    // checks status
    if (!res.ok) {
        throw new Error(`Failed to fetch goods: ${res.status} ${res.statusText}`);
    }
    // tries to get data from response
    try {
        const data = await res.json();
        return goodsSchema.parse(data);
    } catch (error) {
        console.error("Invalid API response:", error);
        throw new Error("Invalid API response");
    }
};

// returns good by uuid
export const fetchGood = async (uuid: string): Promise<TGood> => {
    // send query
    const res = await fetch(`${api_url}/goods/${uuid}`);
    // checks status
    if (!res.ok) {
        throw new Error(`Failed to fetch good: ${res.status} ${res.statusText}`);
    }
    // tries to get data from response
    try {
        const data = await res.json();
        return goodSchema.parse(data);
    } catch (error) {
        console.error("Invalid API response:", error);
        throw new Error("Invalid API response");
    }
};

// creates or updates goods
export const saveGood = async (data: TFormData, method: EMethod, goodUuid: string | null, isImageWasRemoved: boolean) => {
    // creates form data
    const formData = new FormData();
    // puts required fields to form data
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    formData.append('article', data.article);
    // checks and put description to form data if it exists
    if (data.description) {
        formData.append('description', data.description);
    }
    // checks and put discountedPrice to form data if it exists
    if (data.discountedPrice) {
        formData.append('discountedPrice', String(data.discountedPrice));
    }
    // checks and added to form data image if it exists and correct
    if (data.imageFile && data.imageFile.length > 0) {
        formData.append('image', data.imageFile[0] as unknown as File);
    }
    if (method === EMethod.PUT && isImageWasRemoved) {
        formData.append('imageWasRemoved', String(isImageWasRemoved));
    }
    // send query
    const res = await fetch(`${api_url}/goods${method === 'PUT' ? `/${goodUuid}` : ''}`, {
        method,
        body: formData,
    });
    // checks status
    if (!res.ok) {
        throw new Error(`Failed to fetch good: ${res.status} ${res.statusText}`);
    }
    // tries to get data from response
    try {
        const data = await res.json();
        return goodSchema.parse(data);
    } catch (error) {
        console.error("Invalid API response:", error);
        throw new Error("Invalid API response");
    }
};

// deletes goods
export const deleteGood = async (goodUuid: string) => {
    // send query
    const res = await fetch(`${api_url}/goods/${goodUuid}`, {
        method: 'DELETE'
    });
    // checks status
    if (!res.ok) {
        throw new Error(`Failed to fetch good: ${res.status} ${res.statusText}`);
    }
}