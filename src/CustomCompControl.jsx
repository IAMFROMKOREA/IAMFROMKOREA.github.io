
import { useContext, useEffect, useRef, useState } from 'react'
import { getExtensionInfo, putExtensionInfo } from './ApiTest';
import { AppContext } from './App';

function CustomCompControl(props) {



    //const [curTabNo, setCurTabNo] = useState(1);
    const [currentExtension, setCurrentExtension] = useState([]);
    const [desiredExtension, setDesiredExtension] = useState([]);
    const [applyInfos, setApplyInfos] = useState([]);
    //const [init, setInit] = useState(false);
    const { setIsLoading } = useContext(AppContext);

    useEffect(() => {
        // if (!init) {
        //     document.getElementById("areaControl").checked = true;
        //     getExtensionInfo("current", (returnObj) => {
        //         setCurrentExtension(returnObj.data);
        //     });


        //     getExtensionInfo("desired", (returnObj) => {
        //         let tempData = returnObj.data;
        //         tempData.map((obj, index) => {
        //             obj.isNew = false;
        //             obj.toBeVersion = obj.version;
        //             obj.isDel = false;
        //         });
        //         setDesiredExtension(tempData);
        //     });
        //     setInit(true);
        // }
        document.getElementById("areaControl").checked = true;
        if (props.isCurSource) {
            getExtensionInfo("current", (returnObj) => {
                setCurrentExtension(returnObj.data);
            });
        } else {
            getExtensionInfo("desired", (returnObj) => {
                let tempData = returnObj.data;
                tempData.map((obj, index) => {
                    obj.isNew = false;
                    obj.toBeVersion = obj.version;
                    obj.isDel = false;
                });
                setDesiredExtension(tempData);
            });
        }
    }, [props.isCurSource]);


    function removeComp(remove_index) {

        let tempData = [...desiredExtension];
        tempData = tempData.filter((obj, index) => index != remove_index);
        setDesiredExtension(tempData);
    }


    function changeTobeVersion(p_index, e) {
        let tempData = [...desiredExtension];

        tempData.map((obj, index) => {
            if (index == p_index) {
                obj.recipe = obj.recipe.replaceAll(obj.toBeVersion, e.target.value)
                obj.toBeVersion = e.target.value;
            }
        })

        setDesiredExtension(tempData);
    }

    function addComp() {
        let tempData = [...desiredExtension, { isNew: true, recipe: "" }];
        setDesiredExtension(tempData);
    }

    function changeRecipe(p_index, e) {
        let tempData = [...desiredExtension];
        tempData.map((obj, index) => {
            if (index == p_index) {
                obj.recipe = e.target.value;
            }
        })

        setDesiredExtension(tempData);
    }


    function changeIsDel(p_index, e) {
        let tempData = [...desiredExtension];
        tempData.map((obj, index) => {
            if (index == p_index) {
                obj.isDel = e.target.checked;
            }
        })

        setDesiredExtension(tempData);
    }

    function applyComp() {
        setIsLoading(true);
        let copyApplyInfos = [];
        desiredExtension.map((obj, index) => {
            console.log(obj.recipe);

            if (obj.isNew || !obj.isDel) {
                copyApplyInfos.push(obj.recipe);
            }

        })

        putExtensionInfo(copyApplyInfos, (returnObj) => {
            if (returnObj.data != undefined) {
                alert(returnObj.data.message);

            } else {
                alert(returnObj);

            }
            setIsLoading(false);

        })

        setApplyInfos(copyApplyInfos);
    }


    function restartServer() {

    }



    return (
        <div className='customCompMain'>
            <div>
                <table className='tabStyle1'>
                    <thead>
                        <tr>
                            <th>no</th>
                            <th>name</th>

                            {props.isCurSource ? <>
                                <th>version(As-Is)</th>
                            </> : <>
                                <th>version(To-Be)</th>
                            </>}

                            <th>recipe</th>
                            {!props.isCurSource ? <>
                                <th></th>
                            </> : ""}
                        </tr>

                    </thead>

                    <tbody>

                        {props.isCurSource ? <>
                            {
                                //Current Tab=============================================================================
                            }
                            {currentExtension.map((obj, index) => {
                                return <tr>
                                    <td>{index + 1}</td>
                                    <td>{obj.name}</td>
                                    <td>{obj.version}</td>
                                    <td>{obj.recipe}</td>
                                </tr>
                            })}
                        </> : <>
                            {
                                //Desired Tab=============================================================================
                            }
                            {desiredExtension.map((obj, index) => {
                                if (!obj.isNew) {
                                    return <tr>
                                        <td>{index + 1}</td>
                                        <td>{obj.name}</td>
                                        <td>
                                            <div>
                                                <input type="text" className="Input versionInput" value={obj.toBeVersion} onChange={(e) => { changeTobeVersion(index, e) }} />
                                                <input type="checkbox" className='Input' id={obj.name + "_isDeleted"} value={obj.isDel} onChange={(e) => { changeIsDel(index, e) }} />
                                                <label htmlFor={obj.name + "_isDeleted"}>Del</label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={currentExtension.filter(element => element.name == obj.name)[0].version != obj.toBeVersion ? "changed" : ""}
                                                style={{ textDecorationLine: obj.isDel ? "line-through" : "" }}
                                            >
                                                {obj.recipe}
                                            </div>

                                        </td>
                                        <td>
                                        </td>
                                    </tr>
                                } else {
                                    return <tr>
                                        <td>{index + 1}</td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div className="changed">
                                                <input type="text" className='Input recipeInput' value={obj.recipe} onChange={(e) => changeRecipe(index, e)} />
                                            </div>

                                        </td>
                                        <td>
                                            <div>
                                                <div className='searchPanel_btn' onClick={() => removeComp(index)}>
                                                    <img src="/icon/minus.svg" width={15}></img>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                }

                            })}
                        </>}
                    </tbody>
                </table>
            </div>

            {!props.isCurSource ? <>
                <div className='extensionBottom'>
                    <div className='searchPanel_btn custombtn' onClick={addComp} ><img src="/icon/plus.svg" width={"15px"} title={"Add"} />Add</div>
                    <div className='searchPanel_btn custombtn' onClick={applyComp} ><img src="/icon/upload.svg" width={"15px"} title={"Apply to server"} />Apply</div>
                    <div className='searchPanel_btn custombtn' onClick={restartServer} ><img src="/icon/refresh.svg" width={"15px"} title={"Restart server"} />Sever Restart</div>
                </div>

                <div style={{ color: "black" }}>
                    {JSON.stringify(applyInfos)}
                </div>
            </> : ""}

        </div>

    );
}

export default CustomCompControl;