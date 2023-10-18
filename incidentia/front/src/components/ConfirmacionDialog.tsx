import {useState, useImperativeHandle, forwardRef} from 'react';
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

const ConfirmacionDialog = (props:ConfirmacionProps, ref?:any) => {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        if(props.validateData != undefined) {
             if(props.validateData()) setOpen(true)
             else return;
        }
        setOpen(true)
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    useImperativeHandle(ref, () => {
      return { handleClose }
    })
  
    return (
      <>
        <Button
        fullWidth
        onClick={handleClickOpen}
        variant="contained"
        color="secondary"
        style={{color:"white", width:'80%', margin:'auto', marginTop:-20, borderRadius:10}} 

        >
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
            <DialogContentText sx = {{fontWeight: 600}}>
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

  export default forwardRef(ConfirmacionDialog)