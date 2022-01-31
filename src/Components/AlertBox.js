import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import * as React from 'react';

const AlertBox = (props) => {
    var points;
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
      });
      
        const [open, setOpen] = React.useState(false);
      
        const handleClickOpen = () => {
          points = props.onCheck;  
          setOpen(true);
        };
      
        const handleClose = () => {
          setOpen(false);
        };
      
    return(
        <>
        <div className="text-center">
            <Button type="button" className="mt-4" onClick={handleClickOpen} variant="contained" color="success">Check</Button>
        </div>
        <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{points}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
      </>
    );
};

export default AlertBox;