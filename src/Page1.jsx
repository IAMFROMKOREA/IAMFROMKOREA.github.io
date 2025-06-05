import { use, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Page1() {
    const [arr, setArr] = useState([{ no: 3, title: "글제목입니다.3", content: '글내용3' }, { no: 2, title: "글제목입니다.2", content: '글내용2' }, { no: 1, title: "글제목입니다.1", content: '글내용1' }])
    const [curObj, setCurObj] = useState();


    return (
        <div>
            <Modal curObj={curObj} setCurObj={setCurObj}></Modal>
            <table className='tabStyle1'>
                <colgroup>
                    <col width={"20%"}></col>
                    <col width={"80%"}></col>
                </colgroup>
                <tbody>
                    <tr>
                        <th>글번호</th>
                        <th>제목</th>
                    </tr>

                    {
                        arr.map((tempObj) => {
                            return (
                                <tr>
                                    <td>{tempObj.no}</td>
                                    <td onClick={() => setCurObj(tempObj)} style={{ cursor: 'pointer' }}>
                                        {tempObj.title}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>

    );
}

function Modal(props) {
    if (props.curObj == undefined) {
        return <></>;
    }


    return <>
        <div className='detailPop'>
            <div>{props.curObj.title}</div>
            <div>{props.curObj.content}</div>
            <div onClick={() => props.setCurObj(null)}>닫기</div>
        </div>
    </>
}

export default Page1;