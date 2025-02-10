import React from 'react';
import {Modal, Spin} from "antd";

interface ILoadingModalProps {
    visible: boolean;
}

const LoadingModalComponent = ({visible}: ILoadingModalProps) => {
    return (
        <Modal
            open={visible}
            footer={null}
            closable={false}
            centered
            width={150}
            styles={{
                body: {
                    height: 100,
                    width: 100,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 0,
                },
            }}
        >
            <Spin size="large"/>
        </Modal>
    );
};

export default LoadingModalComponent;