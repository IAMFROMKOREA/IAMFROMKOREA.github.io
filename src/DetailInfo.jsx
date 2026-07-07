
import { useContext, useEffect, useRef, useState } from 'react'
import { getEntityData, getToken } from '/src/ApiTest'
import { AppContext } from './App';
import { cloneObject, getData, getProductData, scrollToCurId, setNodeName, setNodeSimpleValue, setNodeValueById, setPathChildDataToSession, SUPERTYPE } from './ApiTest';
import { TreeViewContext } from './StepMain';

function DetailInfo(props) {

    //const SUPERTYPE = ["product", "entity", "classification", "asset"];
    const [curData, setCurData] = useState(props.detailData);
    const { setDetailData, detailData, isMainWS, mainRefresh, setMainRefresh } = useContext(TreeViewContext);
    const { setIsLoading } = useContext(AppContext);
    const [flipStatus, setFilpStatus] = useState([true, true, true]);
    const [curTab, setCurTab] = useState(0);

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


    function setValue(attid, value, isLov, setTempValue) {
        let copyobj = { ...detailData };
        if (attid == "name") {
            setTempValue(value);
        } else {
            if (!isLov) {
                setTempValue(value);
            } else {
                setTempValue([{ valueId: value }]);
            }
        }
        //setCurData(copyobj);

        // {
        //     if (attid == "name") {
        //         setNodeName(detailData.id, detailData.superType, value, callback_setValue);
        //     } else {
        //         if (!isLov) {
        //             setNodeSimpleValue(detailData.id, detailData.superType, attid, value, callback_setValue);
        //         } else {
        //             setNodeValueById(detailData.id, detailData.superType, attid, value, callback_setValue);
        //         }
        //     }

        // }

    }

    function setNodeValue(attid, value, isLov) {

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
        console.log("setNodeValue", copyobj);
        setCurData(copyobj);

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

    function getDetailData(stepId) {
        setIsLoading(true);
        getData(stepId, detailData.superType, callback_getDetailData)
    }


    function getDetailData(stepId, superType) {
        if (superType == undefined || superType.length == 0) {
        } else {
            console.log("getDetailData", stepId, superType.toLowerCase());
            setIsLoading(true);
            getData(stepId, superType.toLowerCase(), callback_getDetailData)
        }


    }

    function callback_getDetailData(data) {
        setCurTab(0);
        let isSet = false;
        SUPERTYPE.map((superType) => {
            if (!isSet) {
                if (data.data[superType] != undefined) {
                    let tempObj = data.data[superType];
                    tempObj.superType = superType;
                    console.log("getDetailData callback", tempObj);

                    setDetailData(tempObj);
                    scrollToCurId(tempObj.id);
                    isSet = true;
                } else {
                    setDetailData({ id: "" })
                }
            }

        });
        setIsLoading(false);

        // if (data.data[superType] != undefined) {
        //     let tempObj = data.data[superType];
        //     tempObj.superType = superType;
        //     console.log("getDetailData callback", tempObj);
        //     setDetailData(tempObj);

        //     scrollToCurId(tempObj.id);
        // } else {
        //     setDetailData({ id: "" })
        // }


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


    function ATTNAME(props) {
        const element = props.element;
        return (
            <div>
                <div>
                    {element.attribute.name != null && element.attribute.name.length > 0 ?
                        <>{element.attribute.name}</> :
                        <>({element.attribute.id})</>}
                </div>
                <div className={element.inherited ? "inherited" : ""}></div>
                <div className={element.calculated ? "calculated" : ""}></div>
            </div>
        );
    }
    function ATTVALUE(props) {
        const element = props.element;
        const [tempValue, setTempValue] = useState(element.simpleValue);
        return (
            <>{element.attribute.listOfValuesBased ? <>
                <select className="Input" key={element.attribute.id}
                    value={element.values.length > 0 && element.values[0].valueId != null ? element.values[0].valueId : ""}
                    onChange={(event) => { setNodeValue(element.attribute.id, event.target.value, true) }}
                    disabled={isMainWS == "true" && element.editable != false ? false : true}
                >
                    <option value=""></option>
                    {element.attribute.listOfValues.valueEntries.pageElements.map((lov) => {
                        return <option value={lov.valueId}>{lov.value}</option>;
                    })}
                </select>
            </> : <>
                <input className="Input" key={element.attribute.id} type="text" value={tempValue}
                    onChange={(event) => setValue(element.attribute.id, event.target.value, false, setTempValue)}
                    style={{ width: "90%" }}
                    onBlur={(event) => { setNodeValue(element.attribute.id, event.target.value, false) }}
                    disabled={isMainWS == "true" && element.editable != false && element.calculated != true ? false : true}
                />
            </>}
            </>);
    }


    function TABMAIN() {
        const tabArr = ["Basic", "Data Container", "References"];
        return (<>
            <div className='tabMain'>
                <span className={curData.superType == 'product' ? "supertype_p"
                    : curData.superType == 'entity' ? "supertype_e"
                        : curData.superType == 'classification' ? "supertype_c"
                            : curData.superType == 'asset' ? "supertype_a" : ""}></span>
                {tabArr.map((element, index) => {
                    return (<div className={index == curTab ? 'curTab' : ''} onClick={e => { setCurTab(index) }}>{element}</div>)
                })}
            </div>
            <div>
                {(() => {   // 즉시 실행 함수로 감싸기
                    switch (curTab) {
                        case 0:
                            return <TAB1 />;
                        case 1:
                            return <TAB2 />;
                        case 2:
                            return <TAB3 />;
                        default:
                            return null; // React에서 아무것도 안 그릴 때는 null이 더 권장됩니다.
                    }
                })()}
            </div>
        </>
        );
    }

    function TAB3() {
        const referencesByReferenceTypes = curData.referencesByReferenceType;
        if (referencesByReferenceTypes != undefined && referencesByReferenceTypes.length > 0) {
            return (<>
                {
                    referencesByReferenceTypes.map(referencesByReferenceType => {
                        return <REFTYPE referencesByReferenceType={referencesByReferenceType} />
                    })
                }

            </>

            );
        } else {
            return "";
        }

    }


    function REFTYPE(props) {
        const referencesByReferenceType = props.referencesByReferenceType;
        if (referencesByReferenceType != undefined) {
            const referenceType = referencesByReferenceType != undefined ? referencesByReferenceType.referenceType : null;
            const referenceEntries = referencesByReferenceType != undefined ? referencesByReferenceType.referenceEntries : [];
            // const attList = dataContainerType != undefined ? dataContainerType.validAttributes.sort((a, b) => a.name - b.name) : [];
            // const dataContainers = dataContainer != undefined ? dataContainer.dataContainers : [];

            return (
                <>
                    <div className='sectionLabel'>{referenceType.name}</div>
                    <table className='tabStyle1'>
                        <thead>
                            <tr>
                                <th style={{ width: "300px" }}>Target ID</th>
                                <th>Target Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                referenceEntries.map(referenceEntry => {
                                    return (
                                        <tr>
                                            <td>
                                                <span className='pathlink' onClick={() => { getDetailData(referenceEntry.target.id, referenceEntry.target.__typename) }}>{referenceEntry.target.id}</span>
                                            </td>
                                            <td>{referenceEntry.target.name}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table >
                </>

            )
        }
    }


    function TAB2() {
        const dataContainers = curData.dataContainers;
        if (dataContainers != undefined && dataContainers.length > 0) {
            return (<>
                {
                    dataContainers.map(dataContainer => {
                        return <DATACONTAINER dataContainer={dataContainer} />
                    })
                }

            </>

            );
        } else {
            return "";
        }

    }

    function DATACONTAINER(props) {
        const dataContainer = props.dataContainer;
        if (dataContainer != undefined) {
            const dataContainerType = dataContainer != undefined ? dataContainer.dataContainerType : null;
            const attList = dataContainerType != undefined ? dataContainerType.validAttributes.sort((a, b) => a.name - b.name) : [];
            const dataContainers = dataContainer != undefined ? dataContainer.dataContainers : [];

            return (
                <>
                    <div className='sectionLabel'>{dataContainer.dataContainerType.name}</div>
                    <table className='tabStyle1'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                {attList.map(validAttribute => {
                                    return (
                                        <th>{validAttribute.name}</th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataContainers.map(obj => {
                                    return (
                                        <tr>
                                            <td>{obj.id}</td>
                                            {attList.map(validAttribute => {
                                                return <>
                                                    <td>
                                                        <ATTVALUE element={obj.values.filter(value => value.attribute.id == validAttribute.id)[0]} />
                                                    </td>

                                                </>
                                            })}
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </>

            )
        }

    }

    function TAB1() {
        return (
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
                                                    {element.name}({element.id})
                                                    {curData.path.length - 1 == index ? <>

                                                    </> : <>
                                                        <span style={{ color: "orange" }}>⨠</span>
                                                    </>}

                                                </span>
                                            );
                                        })}
                                    </td>

                                </tr>
                                {curData.superType == "asset" && curData.contentUri != undefined && curData.contentUri.length > 0 ?
                                    <tr>
                                        <td>Attach File Link</td>
                                        <td><a href={curData.contentUri} target="_blank"><img src="/icon/download.svg" width={17} height={17} />Download</a></td>

                                    </tr> : ""}
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
                                            <ATTNAME element={element} />
                                        </td>
                                        <td>
                                            <ATTVALUE element={element} />
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
                                            <ATTNAME element={element} />
                                        </td>
                                        <td>
                                            <ATTVALUE element={element} />
                                        </td>
                                    </tr>
                                ))}
                            </> : <></>}




                        </>

                        : <></>
                    }
                </tbody>

            </table>
        )
    }

    return (
        <div>
            {curData != null && curData.superType != null ? <>
                <TABMAIN />

            </> : ""}

        </div>

    );
}

export default DetailInfo;