import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme } from '@mui/material';
import { tokens } from '../theme';

const Modal = ({
  open,
  onClose,
  title,
  children,
  styleProps,
  onConfirm,
  confirmMessage,
  noConfirm
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { backgroundColor, color, padding, overflowY, ...customStyles } = styleProps || {};

  const handleConfirm = () => {
      onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: backgroundColor || theme.palette.background.paper,
          color: color || theme.palette.text.primary,
          padding: padding || theme.spacing(2), // Ensure sufficient padding
          overflowY: overflowY || 'visible',
          ...customStyles,
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {noConfirm ?
      <DialogActions>
        <Button onClick={onClose} sx={{color: colors.greenAccent[500]}}>
          Cancel
        </Button>
      </DialogActions>
      :
      <DialogActions>
        <Button onClick={onClose} sx={{color: colors.greenAccent[500]}}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" sx={{color: colors.greenAccent[500]}}>
          Confirm
        </Button>
      </DialogActions>
      }
    </Dialog>
  );
};

export default Modal;
