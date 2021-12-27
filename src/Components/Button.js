const Button = (props) => {
  return (
    <>
      <div className="text-center">
        <button type="button" className="btn btn-outline-dark mt-4" onClick={props.onFetch}>
          Generate CrossWord
        </button>
      </div>
    </>
  );
};

export default Button;
