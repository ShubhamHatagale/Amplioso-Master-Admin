import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useHistory } from 'react-router-dom';

export default function MaxWidthDialog(props) {
  const { confirmDialog, setConfirmDialog } = props;

  const history = useHistory();
  const HandleClose = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false, type: true });
    const user = JSON.parse(localStorage.getItem("company"));
    if (user) {
      history.push(props.link);
    } else {
      history.push("/");
    }
  }
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  return (
    <React.Fragment>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open max-width dialog
      </Button> */}
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={confirmDialog.isOpen}
        onClose={confirmDialog.isOpen}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">{confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.subTitle}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={HandleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

