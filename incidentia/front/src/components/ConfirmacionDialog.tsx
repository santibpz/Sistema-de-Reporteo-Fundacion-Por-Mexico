import {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
// import Draggable from 'react-draggable';

interface ConfirmacionProps {
    message: string
    validateData?: () => boolean
    onContinue: () => any
}

const ConfirmacionDialog = (props:ConfirmacionProps) => {
    const [open, setOpen] = useState(false);
  
    const handleClickOpen = () => {
        if(props.validateData != undefined) {
             if(props.validateData()) setOpen(true)
             else return;
        }
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <>
        <Button
        onClick={handleClickOpen}
        variant="contained"
        color="secondary" 
        sx = {{margin:'auto', width: '80%'}}>
          Guardar
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move', fontWeight:800, color: 'red'}} id="draggable-dialog-title">
            Atención
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={props.onContinue}>Continuar</Button>
          </DialogActions>
        </Dialog>
        </>
    );
  }

  function PaperComponent(props: PaperProps) {
    return (
    //   <Draggable
    //     handle="#draggable-dialog-title"
    //     cancel={'[class*="MuiDialogContent-root"]'}
    //   >
        <Paper {...props} />
    //   </Draggable>
    );
  }

  export default ConfirmacionDialog