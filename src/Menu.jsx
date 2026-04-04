const Menu = ({ downloadImage, onImport }) => {
    const openLink = (url) => window.open(url, "_blank");

    return (
        <div className="menu-cont">
            <button className="menu-btn" onClick={downloadImage} title="Export">
                <i className="fa-regular fa-file-image"></i>
            </button>

            <button className="menu-btn" onClick={onImport} title="Import">
                <i className="fa-solid fa-upload"></i>
            </button>

            <button className="menu-btn" onClick={() => openLink("https://github.com/Rohan-Shridhar/gridcraft")}>
                <i className="fab fa-github"></i>
            </button>

            <button className="menu-btn" onClick={() => openLink("https://github.com/Rohan-Shridhar/gridcraft/forks")}>
                <i className="fa-solid fa-code-fork"></i>
            </button>
        </div>
    );
};