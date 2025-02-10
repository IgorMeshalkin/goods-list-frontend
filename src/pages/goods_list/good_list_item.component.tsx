import React, {useState} from 'react';
import st from './goods_list.module.scss'
import {deleteGood, saveGood, TGood} from "../../api/good_api";
import {useNavigate} from "react-router-dom";
import {Button, Image, message, Modal, Tooltip} from 'antd';
import {DeleteOutlined, EditOutlined, InfoCircleOutlined} from '@ant-design/icons';
import {img_url} from "../../utils/common_variables";
import {useLang} from "../../context/language_context";
import {formatPrice} from "../../utils/common_functions";
import LoadingModalComponent from "../../components/loading_modal/loading_modal.component";
import {useMutation} from "@tanstack/react-query";

const AntImage = Image as unknown as React.FC<any>;

interface GoodListItemProps {
    good: TGood;
    refetchList: () => void,
    key?: string;
}

const GoodListItemComponent = ({good, refetchList}: GoodListItemProps) => {
    const {langContent} = useLang();
    const navigate = useNavigate();

    // navigates to good details page
    const showDetails = () => {
        navigate(`/good/${good.uuid}`)
    }

    // navigates to edition form
    const showUpdatingForm = () => {
        navigate(`/good/form`, {state: {good}});
    }

    // states for 'Details', 'Edit' and 'Delete' buttons
    // for hover change color effect
    const [isDetailsButtonHovered, setIsDetailsButtonHovered] = useState(false);
    const [isUpdateButtonHovered, setIsUpdateButtonHovered] = useState(false);
    const [isDeleteButtonHovered, setIsDeleteButtonHovered] = useState(false);

    // accent color for buttons change color effect
    const getAccentColor = (isDeleting: boolean) => {
        return isDeleting ? '#ff4d4f' : '#1890ff';
    }

    // returns buttons styles
    const getButtonStyles = (isHovered: boolean, isDeleting: boolean = false) => {
        return {
            width: 40,
            height: 40,
            padding: 0,
            borderRadius: 10,
            backgroundColor: isHovered ? getAccentColor(isDeleting) : undefined,
            borderColor: isHovered ? getAccentColor(isDeleting) : undefined,
        }
    }

    // returns buttons icon styles
    const getIconStyle = (isHovered: boolean, isDeleting: boolean = false) => {
        return {
            fill: 'none',
            color: isHovered ? '#fff' : getAccentColor(isDeleting),
            fontSize: 16,
        }
    }

    // state confirm delete modal
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

    // mutation for delete goods
    const deleteMutation = useMutation<any, Error, string>({
        mutationFn: async (uuid: string) => deleteGood(uuid),
        onSuccess: (result) => {
            message.success(langContent.good_list_item.successful_delete_message);
            refetchList();
        },
        onError: (error) => {
            message.error(langContent.good_list_item.fail_delete_message);
        },
    });

    // delete handle function
    const handleDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        deleteMutation.mutateAsync(good.uuid);
    }

    return (
        <div className={st.item_main}>
            {/* Good image if exists or default image */}
            <div className={st.item_image__container}>
                <AntImage
                    style={{width: '100%'}}
                    src={`${img_url}${good.image}`}
                    alt=''
                    fallback="default_good.png"
                />
            </div>

            {/* Good info: name, article, descripting and prices */}
            <div className={st.item_info__container}>
                <div className={st.item_name__container}>
                    <span className={st.item_name}>{`${good.name}`}</span>
                    <span>{`(${langContent.good_list_item.article} ${good.article})`}</span>
                </div>
                {
                    good.description &&
                    <span className={st.item_description}>{good.description}</span>
                }
                <div className={st.item_price__container}>
                    {
                        good.discountedPrice ?
                            <>
                                <span className={st.available_price}>{formatPrice(good.discountedPrice)}</span>
                                <span className={st.price_before_discount}>{formatPrice(good.price)}</span>
                            </> :
                            <span className={st.available_price}>{formatPrice(good.price)}</span>
                    }
                </div>
            </div>

            {/* Details, Edit and Delete buttons */}
            <div className={st.item_buttons__container}>
                <Tooltip title={langContent.good_list_item.details}>
                    <Button
                        type='default'
                        icon={<InfoCircleOutlined
                            style={getIconStyle(isDetailsButtonHovered)}
                        />}
                        style={getButtonStyles(isDetailsButtonHovered)}
                        onMouseEnter={() => setIsDetailsButtonHovered(true)}
                        onMouseLeave={() => setIsDetailsButtonHovered(false)}
                        onClick={showDetails}
                    />
                </Tooltip>
                <Tooltip title={langContent.good_list_item.edit}>
                    <Button
                        type='default'
                        icon={<EditOutlined className="no-fill-icon" style={getIconStyle(isUpdateButtonHovered)}/>}
                        style={getButtonStyles(isUpdateButtonHovered)}
                        onMouseEnter={() => setIsUpdateButtonHovered(true)}
                        onMouseLeave={() => setIsUpdateButtonHovered(false)}
                        onClick={showUpdatingForm}
                    />
                </Tooltip>
                <Tooltip title={langContent.good_list_item.delete}>
                    <Button
                        type='default'
                        icon={<DeleteOutlined className="no-fill-icon"
                                              style={getIconStyle(isDeleteButtonHovered, true)}/>}
                        style={getButtonStyles(isDeleteButtonHovered, true)}
                        onMouseEnter={() => setIsDeleteButtonHovered(true)}
                        onMouseLeave={() => setIsDeleteButtonHovered(false)}
                        onClick={() => setIsConfirmDeleteModalOpen(true)}
                    />
                </Tooltip>
            </div>

            {/* Confirm delete good modal */}
            <Modal
                title={langContent.good_list_item.delete_confirm_modal.title}
                open={isConfirmDeleteModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsConfirmDeleteModalOpen(false)}
                okText={langContent.good_list_item.delete_confirm_modal.ok_button_text}
                cancelText={langContent.good_list_item.delete_confirm_modal.cansel_button_text}
                okButtonProps={{ danger: true }}
            >
                <p>{langContent.good_list_item.delete_confirm_modal.getDeleteConfirmText(good.name)}</p>
            </Modal>

            {/* Loader of deleting good */}
            <LoadingModalComponent visible={deleteMutation.isPending}/>
        </div>
    );
};

export default GoodListItemComponent;