const Checkbutton = (props) => {
    return(
        <div className="text-center">
            <button type="button" className="btn btn-success mt-4" onClick={props.onCheck}>Check</button>
        </div>
    );
};

export default Checkbutton;