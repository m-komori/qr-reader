import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
} from "@chakra-ui/react";

type AlertModalProps = {
    onClose: () => void;
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
};

const AlertModal = ({ onClose, isOpen, title, children }: AlertModalProps) => {
    return (
        <Modal onClose={onClose} isOpen={isOpen} size="xs" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>{children}</ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>OK</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AlertModal;
