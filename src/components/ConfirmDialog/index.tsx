import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    loading?: boolean;
}

const ConfirmDialog = ({
    open,
    title = 'Confirm',
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    loading = false,
}: ConfirmDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent id="confirm-dialog-description">
                {message}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary" disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
