import React, {useEffect, useMemo} from 'react';
import st from './good_form.module.scss';
import {saveGood, TGood} from "../../api/good_api";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Form, Input, InputNumber, message, Upload, UploadFile} from 'antd';
import {zodResolver} from '@hookform/resolvers/zod';
import {Controller, useForm} from "react-hook-form";
import {useLang} from "../../context/language_context";
import {z} from "zod";
import {UploadOutlined} from '@ant-design/icons';
import {img_url} from "../../utils/common_variables";
import {useMutation} from "@tanstack/react-query";
import {EMethod} from "../../utils/types";
import LoadingModalComponent from "../loading_modal/loading_modal.component";

// data types for the form
export type TFormData = {
    name: string;
    description?: string | null;
    price: number;
    discountedPrice?: number | null;
    article: string;
    imageFile?: UploadFile[];
};

const GoodFormComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // chosen good from location if it exists
    const {good} = (location.state as { good?: TGood }) || {};

    // last good uuid if it exists
    // for update operations only
    const goodUuid = useMemo(() => {
        return good?.uuid;
    }, [good]);

    // is it creating (POST) or updating (PUT) of good object
    const method: EMethod = useMemo(() => {
        return (good && Object.keys(good).length > 0) ? 'PUT' : 'POST';
    }, [good]);

    // chosen language content
    const {langContent} = useLang();

    // returns validation form schema
    // depends on the chosen language
    const goodFormValidateSchema = useMemo(() => {
        return z.object({
            name: z.string().nonempty({message: langContent.good_form.validate.required_field}).default(""),
            description: z.string().nullable().optional(),
            price: z.number().positive({message: langContent.good_form.validate.positive_number}).default(0),
            discountedPrice: z.number().nullable().optional(),
            article: z.string().nonempty({message: langContent.good_form.validate.required_field}).default(""),
            imageFile: z.any().optional(),
        })
            .refine((data) => !(data.discountedPrice !== null && data.discountedPrice >= data.price), {
                message: langContent.good_form.validate.discounted_price_less_than_price,
                path: ["discountedPrice"]
            })
            .refine((data) => !(data.discountedPrice !== null && data.discountedPrice <= 0), {
                message: langContent.good_form.validate.positive_number,
                path: ["discountedPrice"]
            });
    }, [langContent]);

    // form object
    const {control, handleSubmit, reset, formState: {errors}} = useForm<TFormData>({
        resolver: zodResolver(goodFormValidateSchema)
    });

    // puts chosen good fields values to form
    useEffect(() => {
        if (good) {
            reset({
                name: good.name,
                description: good.description,
                price: good.price,
                discountedPrice: good.discountedPrice,
                article: good.article,
                imageFile: (good.image && good.image.trim() !== "" && good.image !== "null")
                    ? [{
                        uid: '-1',
                        name: good.image,
                        url: `${img_url}${good.image}`,
                        thumbUrl: `${img_url}${good.image}`,
                        status: 'done'
                    }]
                    : [],
            });
        }
    }, [good, reset]);

    // form data mutation object
    const mutation = useMutation<any, Error, TFormData>({
        mutationFn: async (data: TFormData) => saveGood(data, method, goodUuid),
        onSuccess: (result) => {
            message.success(langContent.good_form.values.getSuccessMessage(method));
            navigate('/');
        },
        onError: (error) => {
            message.error(langContent.good_form.values.getFailMessage(method));
        },
    });

    // onSubmit function
    const onSubmit = async (data: TFormData) => {
        mutation.mutateAsync(data);
    };

    return (
        <div className={st.main}>
            <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
                {/* Name field */}
                <Form.Item
                    label={langContent.good_form.labels.name}
                    validateStatus={errors.name ? 'error' : ''}
                    help={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({field}) => <Input {...field} />}
                    />
                </Form.Item>

                {/* Description field */}
                <Form.Item
                    label={langContent.good_form.labels.description}
                >
                    <Controller
                        name="description"
                        control={control}
                        render={({field}) => <Input.TextArea {...field} rows={4}/>}
                    />
                </Form.Item>

                {/* Price field */}
                <Form.Item
                    label={langContent.good_form.labels.price}
                    validateStatus={errors.price ? 'error' : ''}
                    help={errors.price?.message}
                >
                    <Controller
                        name="price"
                        control={control}
                        render={({field}) => <InputNumber {...field} style={{width: '100%'}}/>}
                    />
                </Form.Item>

                {/* Discounted price field */}
                <Form.Item
                    label={langContent.good_form.labels.discounted_price}
                    validateStatus={errors.discountedPrice ? 'error' : ''}
                    help={errors.discountedPrice?.message}
                >
                    <Controller
                        name="discountedPrice"
                        control={control}
                        render={({field}) => <InputNumber {...field} style={{width: '100%'}}/>}
                    />
                </Form.Item>

                {/* Article field */}
                <Form.Item
                    label={langContent.good_form.labels.article}
                    validateStatus={errors.article ? 'error' : ''}
                    help={errors.article?.message}
                >
                    <Controller
                        name="article"
                        control={control}
                        render={({field}) => <Input {...field} />}
                    />
                </Form.Item>

                {/* Image upload field */}
                <Form.Item
                    label={langContent.good_form.labels.image}
                >
                    <Controller
                        name="imageFile"
                        control={control}
                        render={({field: {onChange, value}}) => (
                            <Upload
                                beforeUpload={(file) => {
                                    onChange([file]);
                                    return false;
                                }}
                                onRemove={() => {
                                    onChange([]);
                                }}
                                maxCount={1} // one file only
                                fileList={value || []}
                                listType="picture"
                            >
                                <Button icon={<UploadOutlined/>}>{langContent.good_form.values.upload_image}</Button>
                            </Upload>
                        )}
                    />
                </Form.Item>

                {/* Submit button */}
                <Button type="primary" htmlType="submit" loading={false}>
                    {langContent.good_form.values.getSubmitButtonText(method)}
                </Button>
            </Form>
            <LoadingModalComponent visible={mutation.isPending}/>
        </div>
    );
};

export default GoodFormComponent;
