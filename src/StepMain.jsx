
import { createContext, useContext, useEffect, useState } from 'react'
import TreeElement from './TreeElement';
import DetailInfo from './DetailInfo';
import { cloneObject, getData, getEntityData, getProductData, scrollToCurId, searchAttribute, searchData } from './ApiTest';
import ScrollToTop from './ScrollToTop';
import { AppContext } from './App';
import CustomCompControl from './CustomCompControl';


export const TreeViewContext = createContext();

function StepMain() {

    console.log("stepmain")
    const [detailData, setDetailData] = useState({ id: "" });
    const [init, setInit] = useState(false);  //화면 최초 로딩시 데이터 추출유무
    const [entityData, setEntityData] = useState({}); //entity 루트
    const [productData, setProductData] = useState({});//product 루트
    const curTabArea = document.getElementById('curTabArea');//top 버튼 클릭시 상단이동
    let [treeAreaWidth, setTreeAreaWidth] = useState(500);
    const { setIsLoading } = useContext(AppContext);
    const [curTabNo, setCurTabNo] = useState(((sessionStorage.getItem("curTabNo") + "") == "null") ? 1 : sessionStorage.getItem("curTabNo")); //현재 탭번호

    const [conditionArr, setConditionArr] = useState([{ id: "id", value: "" }, { id: "name", value: "" }]); //조회조건
    const [resultArr, setResultArr] = useState([]); //조회 결과리스트
    const [attListArr, setAttListArr] = useState([]); //조회 속성값 후보리스트
    const [attValueListArr, setAttValueListArr] = useState([{ valueList: [] }, { valueList: [] }]); //조회 속성값 후보리스트
    const [isMainWS, setIsMainWS] = useState(sessionStorage.getItem("isMainWS") + "");
    const [isCurSource, setIsCurSource] = useState(true);
    const [mainRefresh, setMainRefresh] = useState(false);


    useEffect(() => {
        if (!init) {
            //window.sessionStorage.clear();
            getEntityData("Entity hierarchy root", (data) => {
                setEntityData(data.data.entity);
            });

            getProductData("Product hierarchy root", (data) => {
                setProductData(data.data.product);
            });
            setInit(true);
        }
    }, [init]);


    function updateConditionArr(index, event, isValue) {

        //conditionArr[index].value = value;
        let copyArr = [...conditionArr];
        const targetValue = event.target.value;
        if (isValue) {
            copyArr[index].value = targetValue;
            // let tempIndex = -1;
            // try {
            //     let copyAttValueList = [...attValueListArr];
            //     copyAttValueList[index].valueList.forEach((obj, valueIndex) => {
            //         if (targetValue != null && obj.value.indexOf(targetValue) >= 0) {
            //             tempIndex = valueIndex;
            //             throw new Error("");
            //             //copyAttValueList[index].valueList[tempIndex].isFocus = true;
            //         } else {
            //             //copyAttValueList[index].valueList[tempIndex].isFocus = false;
            //         }
            //     });
            //     //setAttValueListArr(copyAttValueList);
            // } catch (e) {

            // }

            // if (tempIndex > 0) {
            //     const tempElementId = "attValue_" + index + "_" + attValueListArr[index].valueList[tempIndex].value.replaceAll(" ", "");
            //     const tempElement = document.getElementById(tempElementId);
            //     const tempParentElement = "attValueListArea_" + index;
            //     if (tempElement != undefined) {
            //         document.getElementById(tempParentElement).scrollTo({ top: tempElement.offsetTop, behavior: 'smooth' });
            //     }
            // }

        } else {
            copyArr[index].id = targetValue;

            if (targetValue.length > 2) {
                let conditions = [{ id: { queryString: "*" + targetValue + "*", operator: "like" } }, { name: { queryString: "*" + targetValue + "*", operator: "like" } }];
                searchAttribute(conditions, (data) => {
                    setAttListArr(data.data.searchForAttributes.pageElements);
                })
            }
        }
        setConditionArr(copyArr);
    }

    function selectAttributeId(index, attid, listOfValues) {
        let copyArr = [...conditionArr];
        let copyAttValueList = [...attValueListArr];
        copyArr[index].id = attid;
        if (listOfValues != null && listOfValues.valueEntries.pageElements.length > 0) {
            let tempValueArr = [];
            listOfValues.valueEntries.pageElements.map((element) => {
                tempValueArr = [...tempValueArr, { valueId: element.valueId, value: element.value }]
            })

            {
                copyAttValueList[index].valueList = tempValueArr;
                setAttValueListArr(copyAttValueList);
            }

        } else {
            copyAttValueList[index].valueList = [];
            setAttValueListArr(copyAttValueList);
        }

        setConditionArr(copyArr);
        setAttListArr([]);
    }

    function selectAttributeValue(index, attvalue) {
        let copyArr = [...conditionArr];
        copyArr[index].value = attvalue;
        setConditionArr(copyArr);

    }



    function addCondition() {
        let tempArr = [...conditionArr, { id: "", value: "" }];

        setConditionArr(tempArr);
        setAttValueListArr([...attValueListArr, { valueList: [] }])
        console.log(tempArr);
    }

    function removeCondition(curIndex) {
        let tempArr = [...conditionArr];
        setConditionArr(tempArr.filter((obj, index) => curIndex != index));
    }

    function doSearchData() {
        let conditions = [];
        let isValid = false;
        conditionArr.forEach(element => {
            if (element.value != null && element.value.length > 0) {
                isValid = true;
            }
            let tempValue = element.value;
            let conditionObj = null;
            if (element.id == "id") {
                if (tempValue == "") tempValue = "*";
                conditionObj = { id: { queryString: tempValue, operator: "like" } };
            } else {
                if (tempValue != null && tempValue.length > 0) {
                    if (element.id == "name") {
                        conditionObj = { name: { queryString: tempValue, operator: "like" } };
                    } else {
                        conditionObj = { textValue: { queryString: tempValue, attribute: element.id, operator: "like" } };

                    }
                }
            }
            if (conditionObj != null) {
                conditions = [...conditions, conditionObj]
            }


        });

        if (isValid) {
            setIsLoading(true)
            console.log(conditions);
            searchData(conditions, callback_doSearchData);
        } else {
            alert("Input more than one condition.");
        }

    }

    function callback_doSearchData(data) {
        let data_entity = data.data.data_entity.pageElements;
        let data_product = data.data.data_product.pageElements;

        data_entity.map((obj) => {
            obj.superType = "entity";
        })
        data_product.map((obj) => {
            obj.superType = "product";
        })

        let tempResultArr = [...data_entity, ...data_product];
        setResultArr(tempResultArr);
        setIsLoading(false)
    }





    let isAreaControlBtnDown = false;
    let curMouseX = -1;

    window.addEventListener('mouseup', () => {
        isAreaControlBtnDown = false;
        curMouseX = -1;
    })
    window.addEventListener('mousemove', (event) => {

        if (isAreaControlBtnDown) {
            if (curMouseX == -1) {
                curMouseX = event.clientX;
            } else {
                let moveLength = event.clientX - curMouseX;
                setTreeAreaWidth(treeAreaWidth + moveLength);
            }

        }

    })

    function doLogout() {
        sessionStorage.clear();
        window.location.href = "/";
    }



    async function changeWorkSpace() {

        const toBeIsMainWS = isMainWS == "true" ? "false" : "true";
        sessionStorage.setItem("isMainWS", toBeIsMainWS);
        const tempArr = Object.keys(sessionStorage).filter(key => key.indexOf("tree_child_") >= 0);
        tempArr.map(key => {
            sessionStorage.setItem(key, null);
        });
        setIsMainWS(toBeIsMainWS);
        doRefreshMain(2000);
    }

    function doRefreshMain(timeSec) {
        setIsLoading(true);
        setTimeout(() => {
            console.log("setTimeout");
            setMainRefresh(!mainRefresh);
            setTimeout(() => {
                scrollToCurId(detailData.id);
                setIsLoading(false);
            }, 500);

        }, timeSec);
    }



    return (

        <TreeViewContext.Provider value={{ detailData, setDetailData, isMainWS, mainRefresh, setMainRefresh }}>

            <div className='header'>
                <div>
                    <img src="/graphql.png" width={"50"}></img>
                    <div>GraphQL + STEP</div>
                </div>
                <div className='basicBtn' onClick={doLogout}>
                    Logout
                </div>

            </div>
            <div className='commonArea'>
                {
                    curTabNo < 2 ? <>
                        <div className='workSpaceArea'>
                            <input type="checkbox" id="workSpaceCheck" style={{ display: "none" }} checked={isMainWS == "true" ? false : true} onChange={changeWorkSpace} />
                            <label htmlFor="workSpaceCheck" className='workSpaceSlide'>
                                <div>Main</div>
                                <div>Approved</div>
                            </label>
                        </div>
                    </> : <>
                        <div className='sourceSelectArea'>
                            <input type="checkbox" id="sourceSelectCheck" style={{ display: "none" }} checked={isCurSource ? false : true} onChange={() => { setIsCurSource(!isCurSource) }} />
                            <label htmlFor="sourceSelectCheck" className='sourceSelectSlide'>
                                <div>Current</div>
                                <div>Desired</div>
                            </label>
                        </div>
                    </>
                }



            </div>
            <div style={{ display: "flex" }}>

                <div id="main_left" className='main_left'>
                    <input type="checkbox" id="areaControl" style={{ display: "none" }} />
                    <div className='tabArea'>
                        <div className={curTabNo == 1 ? "curTab" : ""} onClick={() => { setCurTabNo(1); sessionStorage.setItem("curTabNo", 1) }}><img src="/icon/tree.svg" width={"12px"} /></div>
                        <div className={curTabNo == 2 ? "curTab" : ""} onClick={() => { setCurTabNo(2); sessionStorage.setItem("curTabNo", 2) }}><img src="/icon/search.svg" width={"12px"} /></div>
                        <div className={curTabNo == 3 ? "curTab" : ""} onClick={() => { setCurTabNo(3); sessionStorage.setItem("curTabNo", 3) }}><img src="/icon/cloud.svg" width={"12px"} /></div>
                    </div>
                    {//Tree Tab===========================================================================================
                        curTabNo == 1 ? <>
                            <div className='treeArea' id="curTabArea" >

                                {entityData.id != undefined ? <>
                                    <TreeElement parentData={entityData} superType={"entity"} area={curTabArea} />
                                </> : ""}
                                {productData.id != undefined ? <>
                                    <TreeElement parentData={productData} superType={"product"} area={curTabArea} />
                                </> : ""}

                            </div>
                        </> : <></>}
                    {//Search Tab===========================================================================================
                        curTabNo == 2 ? <>
                            <div className='searchArea' id="curTabArea" >
                                <table className='tabStyle2'>
                                    <colgroup>
                                        <col width={'30%'}></col>
                                    </colgroup>
                                    <tbody>

                                        {conditionArr.map((obj, index) => {
                                            if (index < 2) {
                                                return <tr>
                                                    <td>{obj.id}</td>
                                                    <td>
                                                        <input className='Input searchConInput' type="text" key="searchCon_id" id="searchCon_id"
                                                            onChange={(e) => { updateConditionArr(index, e, true) }} value={conditionArr[index].value} autoComplete='off' />
                                                    </td>
                                                </tr>
                                            } else {
                                                return <tr>
                                                    <td>
                                                        <div style={{ position: "relative" }}>
                                                            <input className='Input' type="text" key={"searchLabel" + index}
                                                                style={{ width: "100px" }}
                                                                id={"searchLabel" + index}
                                                                onChange={(e) => { updateConditionArr(index, e, false) }} value={conditionArr[index].id} autoComplete='off' />

                                                            <div className='attListArea'>
                                                                {attListArr.map((attObj) => {
                                                                    return <div onClick={() => { selectAttributeId(index, attObj.id, attObj.listOfValues) }}>
                                                                        {attObj.name}({attObj.id})
                                                                    </div>
                                                                })}
                                                            </div>
                                                        </div>

                                                    </td>
                                                    <td>
                                                        <div style={{ display: "flex" }}>
                                                            <div style={{ position: "relative" }}>
                                                                <input className='Input searchConInput' type="text" key={"searchCon" + index}
                                                                    id={"searchCon" + index} onChange={(e) => { updateConditionArr(index, e, true) }}
                                                                    value={conditionArr[index].value} autoComplete='off' />
                                                                <div className='attValueListArea' id={"attValueListArea_" + index}>
                                                                    {attValueListArr[index].valueList.filter(valueObj => valueObj.value.indexOf(conditionArr[index].value) >= 0).map((valueObj) => {
                                                                        return <div id={"attValue_" + index + "_" + valueObj.value.replaceAll(" ", "")} onClick={() => { selectAttributeValue(index, valueObj.value) }}
                                                                        >
                                                                            {conditionArr[index].value != null && conditionArr[index].value.length > 0 ? <>
                                                                                {valueObj.value.split(conditionArr[index].value)[0]}
                                                                                <b>{conditionArr[index].value}</b>
                                                                                {valueObj.value.split(conditionArr[index].value)[1]}
                                                                            </> : <>{valueObj.value}</>}

                                                                        </div>
                                                                    })}
                                                                </div>
                                                            </div>

                                                            <div className='searchPanel_btn' onClick={() => removeCondition(index)}>
                                                                <img src="/icon/minus.svg" width={15}></img>
                                                            </div>

                                                        </div>

                                                    </td>
                                                </tr>
                                            }

                                        })}

                                        <tr>
                                            <td colSpan={2} style={{ padding: "0px" }}>
                                                <div style={{ display: "block" }}>
                                                    <div className='searchPanel_btn custombtn' onClick={addCondition}><img src="/icon/plus.svg" width={"15px"} title={"Add Condition"} />Add</div>
                                                    <div className='searchPanel_btn custombtn' onClick={doSearchData}><img src="/icon/search.svg" width={"15px"} title={"Search"} tabIndex={0} id="searchBtn" />Search</div>
                                                </div>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {resultArr.length > 0 ? <>
                                    <div className='searchPanel_resultArea'>
                                        <div className='resultCntArea'>Result: {resultArr.length}</div>
                                        {resultArr.map((element) => {
                                            return <div className="resultElement" onClick={() => { setDetailData(element) }}>
                                                <span className={element.superType == 'product' ? "supertype_p" : "supertype_e"}></span>
                                                <div className={detailData.id == element.id ? "currentDetail" : ""}>{element.name}({element.id})</div>
                                            </div>;
                                        })}
                                    </div>
                                </> : <></>}

                            </div>
                        </> : <></>}

                </div>

                {//Search Tab===========================================================================================
                    curTabNo == 3 ? <>

                    </> : ""
                }


                { //Main Right===========================================================================================
                }
                <div className='main_right'>
                    <div style={{ position: "relative", width: "20px" }}>
                        {curTabNo != 3 ? <>
                            <div className='locationArea' onClick={() => doRefreshMain(100)}>
                                {/* <div className='titleArea'></div> */}
                                <div className='imgArea'><img src="/icon/location.svg" width={20} title='find location' /></div>
                            </div>
                        </> : ""}



                        <div className='areaControl'>
                            <label htmlFor='areaControl'>⟨⟩</label>
                        </div>

                        {curTabNo != 3 ? <>
                            <ScrollToTop area={curTabArea} />
                        </> : ""}

                    </div>

                    {curTabNo < 3 ? <>
                        <div className='detailArea'>
                            <DetailInfo detailData={detailData} ></DetailInfo>
                        </div>
                    </> : ""}

                    {curTabNo == 3 ? <>
                        <div className='detailArea'>
                            <CustomCompControl isCurSource={isCurSource}></CustomCompControl>
                        </div>
                    </> : ""}

                </div>
            </div>



        </TreeViewContext.Provider >


    );
}



export default StepMain;