import Button from '@mui/material/Button';

const Checkbutton = (props) => {
    return(
        <div className="text-center">
            <Button type="button" className="mt-4" onClick={props.onCheck} variant="contained" color="success">Check</Button>
        </div>
    );
};

export default Checkbutton;