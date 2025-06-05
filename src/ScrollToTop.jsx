

function ScrollToTop(props) {

    // 클릭하면 스크롤이 위로 올라가는 함수
    const handleTop = () => {
        props.area.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    };

    return (
        <div>
            <div className="top-btn-container" onClick={handleTop}>
            </div >

        </div>
    );
}

export default ScrollToTop;