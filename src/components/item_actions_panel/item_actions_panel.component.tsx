import React, {useState} from 'react';
import st from './item_actons_panel.module.scss'
import {Button, message, Modal, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {TItemActionsLangType} from "../../utils/text_content";
import classNames from "classnames";
import {useMutation} from "@tanstack/react-query";
import LoadingModalComponent from "../loading_modal/loading_modal.component";
import {useNavigate} from "react-router-dom";

interface IItemActionsPanelProps {
    uuid: string,
    deleteFunction: (uuid: string) => void;
    afterSuccessfulDeleteFn?: () => void;
    itemName: string;
    itemLangActions: TItemActionsLangType;
    includeDetails?: boolean;
    includeBackButton?: boolean;
    direction?: 'horizontal' | 'vertical';
    onDetailsClick?: () => void;
    onEditClick?: () => void;
}

const ItemActionsPanelComponent = ({
                                       uuid,
                                       deleteFunction,
                                       afterSuccessfulDeleteFn,
                                       itemName,
                                       itemLangActions,
                                       includeDetails = false,
                                       includeBackButton = false,
                                       direction = 'vertical',
                                       onDetailsClick,
                                       onEditClick,
                                   }: IItemActionsPanelProps) => {

    // states for 'Details', 'Edit' and 'Delete' buttons
    // for hover change color effect
    const [isDetailsButtonHovered, setIsDetailsButtonHovered] = useState(false);
    const [isUpdateButtonHovered, setIsUpdateButtonHovered] = useState(false);
    const [isDeleteButtonHovered, setIsDeleteButtonHovered] = useState(false);

    // navigate object
    const navigate = useNavigate();

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

    // mutation for delete items
    const deleteMutation = useMutation<any, Error, string>({
        mutationFn: async (uuid: string) => deleteFunction(uuid),
        onSuccess: (result) => {
            message.success(itemLangActions.successful_delete_message);
            if (afterSuccessfulDeleteFn) {
                afterSuccessfulDeleteFn();
            }
        },
        onError: (error) => {
            message.error(itemLangActions.fail_delete_message);
        },
    });

    // state confirm delete modal is open
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

    // handle delete item function, calls mutation
    const handleDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        deleteMutation.mutateAsync(uuid)
    }

    return (
        <div className={classNames(st.main, {[st.horizontal]: direction === 'horizontal'})}>
            {
                includeDetails &&
                <Tooltip title={itemLangActions.details}>
                    <Button
                        type='default'
                        icon={<InfoCircleOutlined
                            style={getIconStyle(isDetailsButtonHovered)}
                        />}
                        style={getButtonStyles(isDetailsButtonHovered)}
                        onMouseEnter={() => setIsDetailsButtonHovered(true)}
                        onMouseLeave={() => setIsDetailsButtonHovered(false)}
                        onClick={onDetailsClick}
                    />
                </Tooltip>
            }
            <Tooltip title={itemLangActions.edit}>
                <Button
                    type='default'
                    icon={<EditOutlined className="no-fill-icon" style={getIconStyle(isUpdateButtonHovered)}/>}
                    style={getButtonStyles(isUpdateButtonHovered)}
                    onMouseEnter={() => setIsUpdateButtonHovered(true)}
                    onMouseLeave={() => setIsUpdateButtonHovered(false)}
                    onClick={onEditClick}
                />
            </Tooltip>
            <Tooltip title={itemLangActions.delete}>
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
            {
                includeBackButton &&
                <Button
                    type="primary"
                    onClick={() => navigate(-1)}>
                    {itemLangActions.back_button}
                </Button>
            }

            {/* Confirm delete good modal */}
            <Modal
                title={itemLangActions.delete_confirm_modal.title}
                open={isConfirmDeleteModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsConfirmDeleteModalOpen(false)}
                okText={itemLangActions.delete_confirm_modal.ok_button_text}
                cancelText={itemLangActions.delete_confirm_modal.cansel_button_text}
                okButtonProps={{danger: true}}
            >
                <p>{itemLangActions.delete_confirm_modal.getDeleteConfirmText(itemName)}</p>
            </Modal>

            {/* Loader of deleting goods */}
            <LoadingModalComponent visible={deleteMutation.isPending}/>
        </div>
    );
};

export default ItemActionsPanelComponent;