
import { useContext, useEffect, useRef, useState } from 'react'
import { getEntityData, getToken } from '/src/ApiTest'
import { AppContext } from './App';
import { cloneObject, getData, getProductData, scrollToCurId, setNodeName, setNodeSimpleValue, setNodeValueById, setPathChildDataToSession } from './ApiTest';
import { TreeViewContext } from './StepMain';

function DetailInfo(props) {


    const [curData, setCurData] = useState(props.detailData);
    const { setDetailData, detailData, isMainWS, mainRefresh, setMainRefresh } = useContext(TreeViewContext);
    const { setIsLoading } = useContext(AppContext);
    const [flipStatus, setFilpStatus] = useState([true, true, true]);

    useEffect(() => {
        setCurData(props.detailData);
        setIsLoading(true);
        if (props.detailData.id != undefined) {
            setPathChildDataToSession(props.detailData);
        }


        setIsLoading(false);

    }, [props.detailData]);


    useEffect(() => {
        if (detailData.id != undefined && detailData.id.length > 0) {
            getDetailData(detailData.id);
            //setInit(true);
        }

    }, [isMainWS]);


    function setValue(attid, value, isLov) {
        let copyobj = { ...detailData };
        if (attid == "name") {
            copyobj.name = value;
        } else {
            copyobj.values.map((element) => {
                if (element.attribute.id == attid) {
                    if (!isLov) {
                        element.simpleValue = value;
                    } else {
                        element.values = [{ valueId: value }];
                    }
                }
            });
        }
        setCurData(copyobj);

        {
            if (attid == "name") {
                setNodeName(detailData.id, detailData.superType, value, callback_setValue);
            } else {
                if (!isLov) {
                    setNodeSimpleValue(detailData.id, detailData.superType, attid, value, callback_setValue);
                } else {
                    setNodeValueById(detailData.id, detailData.superType, attid, value, callback_setValue);
                }
            }

        }

    }

    function getDetailData(stepId) {
        setIsLoading(true);
        getData(stepId, detailData.superType, callback_getDetailData)
    }

    function callback_getDetailData(data) {
        if (data.data[detailData.superType] != undefined) {
            let tempObj = data.data[detailData.superType];
            tempObj.superType = detailData.superType;
            setDetailData(tempObj);

            scrollToCurId(tempObj.id);
            // if (document.querySelector('#treeElement_' + tempObj.id) != null) {
            //     let divTop = document.querySelector('#treeElement_' + tempObj.id).offsetTop;
            //     props.area.scrollTo({ top: divTop - 200, behavior: 'smooth' });
            // }
        } else {
            setDetailData({ id: "" })
        }

        setIsLoading(false);
    }

    // function scrollToCurId(stepId) {
    //     if (document.querySelector('#treeElement_' + stepId) != null) {
    //         let divTop = document.querySelector('#treeElement_' + stepId).offsetTop;
    //         props.area.scrollTo({ top: divTop - 200, behavior: 'smooth' });
    //     }
    // }


    function callback_setValue(data) {
        let tempObj = {};
        if (data.data.setNodeValue != undefined) {
            tempObj = data.data.setNodeValue;
        } else if (data.data.setNodeName != undefined) {
            tempObj = data.data.setNodeName;
        }

        if (!tempObj.success) {
            const errmsg = data.data.setNodeValue.errors.message;
            alert(errmsg);
        }
    }

    function func_setFlipStatus(index, value) {
        let tempObj = [...flipStatus];
        tempObj[index] = value;
        setFilpStatus(tempObj);
    }


    return (
        <div>
            <table className='tabStyle2'>
                <tbody>
                    {(curData != undefined) && (curData.id != undefined && curData.id != "") ?
                        <>
                            <tr>
                                <td colSpan={"2"} className='attTypeLabel'>
                                    <span onClick={() => { func_setFlipStatus(0, !flipStatus[0]) }} className={flipStatus[0] ? "rotating" : "flipbutton"}>
                                        {flipStatus[0] ? "▽" : "▶"}
                                    </span>
                                    General
                                </td>
                            </tr>
                            {flipStatus[0] ? <>
                                <tr>
                                    <td>Id</td>
                                    <td>{curData.id}</td>

                                </tr>
                                <tr>
                                    <td>Name</td>
                                    <td>
                                        <input type="text" key="name" value={curData.name == null ? "" : curData.name} onChange={(event) => { setValue("name", event.target.value) }}
                                            className="Input" style={{ width: "90%" }}
                                            disabled={isMainWS == "true" ? false : true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Object Type</td>
                                    <td>{curData.objectType.name}</td>

                                </tr>
                                <tr>
                                    <td>Revision</td>
                                    <td>{curData.currentRevision} - {curData.currentRevisionLastEdited}</td>

                                </tr>
                                <tr>
                                    <td>Approval Status</td>
                                    <td>{curData.approvalStatus}</td>

                                </tr>

                                <tr>
                                    <td>
                                        <div style={{ display: "flex" }}>
                                            Path
                                            {/* <div className='refreshArea' onClick={() => { setMainRefresh(!mainRefresh); setTimeout(() => { console.log("setTimeout"); scrollToCurId(detailData.id) }, 500); }}>
                                                <img src="/icon/refresh.svg" width={15} height={15} />
                                            </div> */}
                                        </div>
                                    </td>
                                    <td>
                                        {curData.path.map((element, index) => {
                                            return (
                                                <span className='pathlink' onClick={() => { getDetailData(element.id) }}>
                                                    {curData.path.length - 1 == index ? <>
                                                        {element.name}({element.id})
                                                    </> : <>
                                                        {element.name}({element.id})⨠
                                                    </>}

                                                </span>
                                            );
                                        })}
                                    </td>

                                </tr>
                            </> : <></>

                            }

                            {//Description==============================================================================================================
                            }
                            <tr>
                                <td colSpan={"2"} className='attTypeLabel'>
                                    <span onClick={() => { func_setFlipStatus(1, !flipStatus[1]) }} className={flipStatus[0] ? "rotating" : "flipbutton"}>
                                        {flipStatus[1] ? "▽" : "▶"}
                                    </span>
                                    Description
                                </td>
                            </tr>
                            {flipStatus[1] ? <>
                                {curData.values.filter((element) => element.attribute.specification == false).map((element) => (
                                    <tr>
                                        <td>
                                            <div>
                                                <div>
                                                    {element.attribute.name != null && element.attribute.name.length > 0 ?
                                                        <>{element.attribute.name}</> :
                                                        <>({element.attribute.id})</>}
                                                </div>
                                                <div className={element.inherited ? "inherited" : ""}></div>
                                                <div className={element.calculated ? "calculated" : ""}></div>
                                            </div>

                                        </td>
                                        <td>
                                            {element.attribute.listOfValuesBased ? <>
                                                <select className="Input" key={element.attribute.id}
                                                    value={element.values.length > 0 && element.values[0].valueId != null ? element.values[0].valueId : ""}
                                                    onChange={(event) => { setValue(element.attribute.id, event.target.value, true) }}
                                                    disabled={isMainWS == "true" && element.editable != false ? false : true}
                                                >
                                                    <option value=""></option>
                                                    {element.attribute.listOfValues.valueEntries.pageElements.map((lov) => {
                                                        return <option value={lov.valueId}>{lov.value}</option>;
                                                    })}
                                                </select>
                                            </> : <>
                                                <input className="Input" key={element.attribute.id} type="text" value={element.simpleValue == null ? "" : element.simpleValue} onChange={(event) => { setValue(element.attribute.id, event.target.value, false) }}
                                                    style={{ width: "90%" }}
                                                    disabled={isMainWS == "true" && element.editable != false ? false : true}
                                                />
                                            </>}

                                        </td>
                                    </tr>
                                ))}
                            </> : <></>}


                            {//Specification==============================================================================================================
                            }

                            {curData.superType == "product" ? <tr>
                                <td colSpan={"2"} className='attTypeLabel'>
                                    <span onClick={() => { func_setFlipStatus(2, !flipStatus[2]) }} className={flipStatus[0] ? "rotating" : "flipbutton"}>
                                        {flipStatus[2] ? "▽" : "▶"}
                                    </span>
                                    Specification
                                </td>
                            </tr> : ""}
                            {flipStatus[2] ? <>
                                {curData.values.filter((element) => element.attribute.specification == true).sort((a, b) => b.inherited - a.inherited).map((element) => (
                                    <tr>
                                        <td>
                                            <div>
                                                <div>
                                                    {element.attribute.name != null && element.attribute.name.length > 0 ?
                                                        <>{element.attribute.name}</> :
                                                        <>({element.attribute.id})</>}
                                                </div>
                                                <div className={element.inherited ? "inherited" : ""}></div>
                                                <div className={element.calculated ? "calculated" : ""}></div>
                                            </div>
                                        </td>
                                        <td>
                                            {element.attribute.listOfValuesBased ? <>
                                                <select className="Input" key={element.attribute.id}
                                                    value={element.values.length > 0 && element.values[0].valueId != null ? element.values[0].valueId : ""}
                                                    onChange={(event) => { setValue(element.attribute.id, event.target.value, true) }}
                                                    disabled={isMainWS == "true" && element.editable != false ? false : true}
                                                >
                                                    <option value=""></option>
                                                    {element.attribute.listOfValues.valueEntries.pageElements.map((lov) => {
                                                        return <option value={lov.valueId}>{lov.value}</option>;
                                                    })}
                                                </select>
                                            </> : <>
                                                <input className="Input" key={element.attribute.id} type="text"
                                                    value={element.simpleValue == null ? "" : element.simpleValue}
                                                    onChange={(event) => { setValue(element.attribute.id, event.target.value, false) }}
                                                    disabled={isMainWS == "true" && element.editable != false ? false : true}
                                                    style={{ width: "90%" }} />
                                            </>}

                                        </td>
                                    </tr>
                                ))}
                            </> : <></>}
                        </>

                        : <></>
                    }
                </tbody>

            </table>

        </div>

    );
}

export default DetailInfo;