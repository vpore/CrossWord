import GithubCorner from 'react-github-corner';

const Header = () => {
    return(
        <>
            <h3 className="text-center fw-bolder mt-4">Crossword Puzzle for CODERS!</h3>
            <GithubCorner href="https://github.com/vpore" target="_blank"/>
        </>
    );
}

export default Header;