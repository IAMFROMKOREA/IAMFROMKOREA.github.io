
import { useRef, useState } from 'react'
import { getCarData } from '/src/ApiTest'

function Page2() {

    const isCall = useRef(0);
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    function updateData(newData) {
        if (isLoading) {
            setData(newData);
            setIsLoading(false);
        }

    }
    getCarData(updateData);

    return (
        <div>
            <div style={{ cursor: "pointer" }} onClick={() => { setIsLoading(true); getCarData(updateData); }}>
                <img src="/icon/refresh.svg" width={20} className={isLoading ? "spinning_fast" : ""}></img>
            </div>
            <table className='tabStyle2'>
                <tbody>
                    <tr>
                        <td>cntrPersonNm</td>
                        <td>{data.cntrPersonNm}</td>
                    </tr>

                    <tr>
                        <td>demanderNm</td>
                        <td>{data.demanderNm}</td>
                    </tr>

                    <tr>
                        <td>trackings</td>
                        <td>
                            {data.trackings != undefined ? data.trackings.map((obj, index) => {
                                return <table className='tabStyle2' style={{ fontWeight: index == 0 ? "bold" : "" }}>
                                    <tr><td>date</td><td>{obj.dateTime}</td></tr>
                                    <tr><td>description</td><td>{obj.description}</td></tr>
                                    <tr><td>location</td><td>{obj.location}</td></tr>
                                    <tr><td>status</td><td>{obj.status}</td></tr>
                                    <tr><td colSpan={2}>&nbsp;</td></tr>
                                </table>
                            }) : <></>}
                        </td>
                    </tr>

                    <tr>
                        <td>demanderTelNo</td>
                        <td>{data.demanderTelNo}</td>
                    </tr>

                    <tr>
                        <td>transTelNo</td>
                        <td>{data.transTelNo}</td>
                    </tr>

                    <tr>
                        <td>positionCode</td>
                        <td>{data.positionCode}</td>
                    </tr>

                    <tr>
                        <td>cntrtNo</td>
                        <td>{data.cntrtNo}</td>
                    </tr>

                    <tr>
                        <td>compCd</td>
                        <td>{data.compCd}</td>
                    </tr>
                </tbody>
            </table>
        </div >

    );
}

export default Page2;