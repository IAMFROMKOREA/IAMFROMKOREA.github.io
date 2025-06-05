
import { useContext, useEffect, useState } from 'react'
import { cloneObject, createData, deleteData, getData } from './ApiTest';
import { AppContext } from './App';
import { TreeViewContext } from './StepMain';



function TreeElement(props) {
    const sessionStorage = window.sessionStorage;
    let sessionChildInfo = sessionStorage.getItem("tree_child_" + props.parentData.id);
    const [parentData, setParentData] = useState(props.parentData);
    const [refresh, setRefresh] = useState(false);
    const { setIsLoading } = useContext(AppContext);
    const { setDetailData, detailData, isMainWS, mainRefresh, setMainRefresh } = useContext(TreeViewContext);
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        // console.log("useE");
        // if (detailData.id != "" && document.querySelector('#treeElement_' + detailData.id) != null) {
        //     console.log("scroll move==" + detailData.id);
        //     let divTop = document.querySelector('#treeElement_' + detailData.id).offsetTop;
        //     props.area.scrollTo({ top: divTop - 200, behavior: 'smooth' });
        // }
    }, [mainRefresh])
    useEffect(() => {
        //console.log("useE=TreeEle=isMainWS" + props.parentData.id);
        // if ((sessionChildInfo + "") != 'null') {
        //     let tempData = props.parentData;
        //     tempData.superType = props.superType;
        //     sessionChildInfo = "null";
        //     console.log("useE=TreeEle=isMainWS=getChidinfoFor====" + props.parentData.id);
        //     getChildDatas();
        // }
    }, [isMainWS])

    useEffect(() => {

        // if (detailData.id != "" && detailData.path.length > 0) {
        //     console.log(detailData.path)
        //     console.log(parentData.id)
        //     let tempArr = detailData.path.filter((obj) => obj.id == parentData.id);
        //     if (tempArr.length > 0) {
        //         getChildDatas();
        //     }
        // }

        // if (detailData.id != "" && document.querySelector('#treeElement_' + detailData.id) != null) {
        //     let divTop = document.querySelector('#treeElement_' + detailData.id).offsetTop;
        //     props.area.scrollTo({ top: divTop - 200, behavior: 'smooth' });
        // }

    }, [detailData.path])


    function getChildDatas() {

        console.log("getChildDatas===")
        if ((sessionChildInfo + "") == 'null' && parentData.hasChildren) {//자식노드가 닫혀있을떄 실행된 경우 자식노드를  가져오기 수행
            console.log("쿼리")
            setIsLoading(true);
            getData(parentData.id, props.superType, callBack_getChildDatas)
        } else {
            console.log("노쿼리")
            setRefresh(!refresh);
            sessionStorage.setItem("tree_child_" + parentData.id, null);
        }

    }

    function callBack_getChildDatas(data) {
        setIsLoading(true);
        try {
            let tempObj = {};
            if (data.data[props.superType] != undefined) {
                tempObj = cloneObject(data.data[props.superType]);
            }
            sessionStorage.setItem("tree_child_" + parentData.id, JSON.stringify({ superType: props.superType, children: tempObj.children.pageElements }));
            setParentData(tempObj);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }

    }


    function getDetailInfo(stepid) {
        setIsLoading(true);
        getData(stepid, props.superType, callback_getDetailInfo)
    }

    function callback_getDetailInfo(data) {
        try {
            let tempObj = {};
            if (data.data[props.superType] != undefined) {
                tempObj = cloneObject(data.data[props.superType]);
                tempObj.superType = props.superType;
            }

            setDetailData(tempObj);

        } catch (e) {

        } finally {
            setIsLoading(false);
        }
    }

    function doCreateNewNode(parentId, objectTypeId) {
        console.log(isMainWS);

        createData(parentId, props.superType, objectTypeId, callback_doCreateNewNode);
        setShowPopup(false);


    }

    function callback_doCreateNewNode(data) {
        console.log(props);

        let tempobj = {};
        if (props.superType == "product") {
            tempobj = data.data.createProduct;
        } else if (props.superType == "entity") {
            tempobj = data.data.createEntity;
        }
        if (tempobj.success) {
            console.log(tempobj);
            tempobj[props.superType].superType = props.superType;
            if ((sessionChildInfo + "") == 'null') {
                getChildDatas();
            } else {

                const tempSessionChildInfo = JSON.parse(sessionChildInfo);
                const tempSuperType = tempSessionChildInfo.sueprType;
                const tempChildren = [...tempSessionChildInfo.children, tempobj[props.superType]];

                sessionStorage.setItem('tree_child_' + parentData.id, JSON.stringify({ superType: tempSuperType, children: tempChildren }));
            }
            setDetailData(tempobj[props.superType]);
        } else {
            alert(tempobj.errors[0].message);
        }
    }

    function doDeleteData() {
        deleteData(parentData.id, props.superType, callback_doDeleteData)
    }
    function callback_doDeleteData(data) {
        const deleteNode = data.data.deleteNode;
        if (deleteNode.success) {
            setParentData();
            setDetailData({ id: "" })
        } else {
            alert(deleteNode.errors[0].message);
        }
    }

    // if (detailData.id == parentData.id) {

    //     if (document.querySelector('#treeElement_' + parentData.id) != null) {
    //         let divTop = document.querySelector('#treeElement_' + parentData.id).offsetTop;
    //         props.area.scrollTo({ top: divTop - 200, behavior: 'smooth' });
    //     }
    // }


    return (
        <>
            {parentData != undefined ?

                <div className='treeElement' id={'treeElement_' + parentData.id} key={'treeElement_' + parentData.id}>
                    <div>
                        <span onClick={() => { getChildDatas() }} className={(sessionChildInfo + "") != 'null' && parentData.hasChildren ? "rotating" : "flipbutton"}>
                            {(parentData.hasChildren == false) ||
                                (sessionChildInfo + "") != 'null'
                                ? <>▽</> : <>▶</>}
                        </span>
                        <div className='popUpButton'>
                            <button>⁞</button>
                        </div>
                        <div className='popUpMenu'>
                            <div onClick={() => {
                                if (isMainWS == "true") {
                                    setShowPopup(true);
                                } else {
                                    alert("Can not create node at 'Approved' workspace.");
                                }

                            }}>Create Node</div>
                            <div onClick={() => {
                                if (isMainWS == "true") {
                                    doDeleteData();
                                } else {
                                    alert("Can not delete node at 'Approved' workspace.");
                                }
                            }}>
                                Delete Node
                            </div>
                        </div>
                        <span className={props.superType == 'product' ? "supertype_p" : "supertype_e"}></span>
                        <div onClick={() => { getDetailInfo(parentData.id) }} className={parentData.id == detailData.id ? "currentDetail" : ""} >
                            {parentData.name != null && parentData.name.length > 0 ? <>
                                {parentData.name}
                            </> : <>
                                ({parentData.id})
                            </>}
                        </div>
                    </div>
                    {(sessionChildInfo + "") != 'null' ? <>
                        <div style={{ marginLeft: "10px" }}>
                            {JSON.parse(sessionChildInfo).children.map((obj) => {
                                return <>
                                    <TreeElement parentData={obj} superType={props.superType} area={props.area} />
                                </>;
                            })}
                        </div>
                    </> : <></>}
                </div >
                : ""
            }
            {
                showPopup ? <>
                    <div className='objTypeSelect' style={{ display: showPopup ? "" : "none" }}>
                        <div>
                            {parentData.objectType.children.length > 0 ? <>
                                <div>Select Object Type</div>
                                <div>
                                    {parentData.objectType.children.map((obj) => {
                                        return (
                                            <>
                                                <div className='custombtn' onClick={() => { doCreateNewNode(parentData.id, obj.id) }}>{obj.name}({obj.id})</div>
                                            </>
                                        )
                                    })}
                                </div>
                            </> : <>
                                <div>Can not Create Child Node.</div>

                            </>}
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <div className='closebtn' onClick={() => setShowPopup(false)}>close</div>
                            </div>
                        </div>
                    </div>
                </> : ""
            }


        </>

    );
}

export default TreeElement;