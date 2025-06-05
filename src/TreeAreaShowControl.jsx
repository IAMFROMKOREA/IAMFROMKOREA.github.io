

function TreeAreaShowControl(props) {

    return (
        <>
            <div style={{ color: "#2ba1b1", cursor: "pointer", fontSize: "12px" }} onClick={() => { props.setShowTreeArea(!props.showTreeArea) }}>
                ⇆
            </div>
        </>
    );
}

export default TreeAreaShowControl;