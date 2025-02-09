import { z } from "zod";
import {api_url} from "../utils/common_variables";

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
export const fetchGoods = async (limit: number, page: number): Promise<TGoods> => {
    let paramsString = `?limit=${limit}`;
    paramsString += `&offset=${limit * (page - 1)}`;

    const res = await fetch(`${api_url}/goods${paramsString}`);

    if (!res.ok) {
        throw new Error(`Failed to fetch goods: ${res.status} ${res.statusText}`);
    }

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
    const res = await fetch(`${api_url}/goods/${uuid}`);

    if (!res.ok) {
        throw new Error(`Failed to fetch good: ${res.status} ${res.statusText}`);
    }

    try {
        const data = await res.json();
        return goodSchema.parse(data);
    } catch (error) {
        console.error("Invalid API response:", error);
        throw new Error("Invalid API response");
    }
};