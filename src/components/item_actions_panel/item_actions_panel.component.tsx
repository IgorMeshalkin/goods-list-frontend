import React, {useState} from 'react';
import st from './item_actons_panel.module.scss'
import {Button, Modal, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {TItemActionsLangType} from "../../utils/text_content";
import classNames from "classnames";

interface IItemActionsPanelProps {
    itemName: string;
    itemLangActions: TItemActionsLangType;
    includeDetails?: boolean;
    direction?: 'horizontal' | 'vertical';
    onDetailsClick?: () => void;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
}

const ItemActionsPanelComponent = ({itemName, itemLangActions, includeDetails = true, direction = 'vertical', onDetailsClick, onEditClick, onDeleteClick}: IItemActionsPanelProps) => {
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

    const handleDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        onDeleteClick();
    }

    return (
        <div className={classNames(st.main, {[st.horizontal]:direction === 'horizontal'})}>
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

            {/* Confirm delete good modal */}
            <Modal
                title={itemLangActions.delete_confirm_modal.title}
                open={isConfirmDeleteModalOpen}
                onOk={handleDelete}
                onCancel={() => setIsConfirmDeleteModalOpen(false)}
                okText={itemLangActions.delete_confirm_modal.ok_button_text}
                cancelText={itemLangActions.delete_confirm_modal.cansel_button_text}
                okButtonProps={{ danger: true }}
            >
                <p>{itemLangActions.delete_confirm_modal.getDeleteConfirmText(itemName)}</p>
            </Modal>
        </div>
    );
};

export default ItemActionsPanelComponent;