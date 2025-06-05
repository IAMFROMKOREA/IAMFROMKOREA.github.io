
import { useContext, useRef, useState } from 'react'
import { getEntityData, getToken } from '/src/ApiTest'
import { AppContext } from './App';

function Page3() {

    const [condition, setCondition] = useState("");
    const [curData, setCurData] = useState({ id: "", name: "", values: [] });
    const { setIsLoading } = useContext(AppContext);


    function setConditionValue(event) {
        setCondition(event.target.value);
    }

    function setCurrentData(data) {
        try {
            if (data.data.entity != undefined) {
                let tempObj = data.data.entity;
                setCurData(tempObj);
            } else {
                setCurData({});
            }
        } catch {

        } finally {
            setIsLoading(false);
        }


    }

    function searchEntityData() {
        setIsLoading(true);
        getEntityData(condition, setCurrentData);
    }


    return (
        <div>
            <div className='condition'>
                <div><p>STEP ID(Entity)</p></div>
                <div><input type="text" value={condition} onChange={setConditionValue} size="50"></input></div>
                <div><button onClick={() => searchEntityData()}>search</button></div>
            </div>
            <div>
                <table className='tabStyle2'>
                    <tbody>
                        {curData.id != undefined && curData.id != "" ?
                            <>
                                <tr>
                                    <td>ID</td>
                                    <td>{curData.id}</td>

                                </tr>
                                <tr>
                                    <td>NAME</td>
                                    <td>{curData.name}</td>
                                </tr>

                                {curData.values.map((element) => (
                                    <tr>
                                        <td>{element.attribute.id}</td>
                                        <td>{element.simpleValue}</td>
                                    </tr>
                                ))}
                            </>

                            : <></>
                        }


                    </tbody>

                </table>
            </div>

        </div>

    );
}

export default Page3;