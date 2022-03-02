import Button from '@mui/material/Button'
import '../Assets/Grid.css'
const GenerateBtn = (props) => {
  return (
    <>
      <div className="text-center">
        <Button type="button" className="mt-4 genBtn" onClick={props.onFetch} variant="contained">
          Generate CrossWord
        </Button>
      </div>
    </>
  );
};

export default GenerateBtn;