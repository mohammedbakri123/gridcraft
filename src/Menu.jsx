const Menu = ({ downloadImage }) => {
    return (
        <div className="menu-cont">
            <button className="menu-btn" onClick={downloadImage}><i className="fa-regular fa-file-image"></i></button>
            <button className="menu-btn" onClick={() => window.location.href = "https://github.com/Rohan-Shridhar/gridcraft"}>
                <i className="fab fa-github"></i>
            </button>
            <button className="menu-btn" onClick={() => window.location.href = "https://github.com/Rohan-Shridhar/gridcraft/forks"}>
                <i className="fa-solid fa-code-fork"></i>
            </button>
        </div>
    );
}