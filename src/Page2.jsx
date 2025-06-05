
import { useRef, useState } from 'react'
import { getCarData } from '/src/ApiTest'

function Page2() {

    const isCall = useRef(0);
    const [data, setData] = useState({});

    function updateData(newData) {
        if (isCall.current == 0) {
            setData(newData);
            isCall.current = 1;
        }

    }
    getCarData(updateData);

    return (
        <div>
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
                        <td>{data.trackings}</td>
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
        </div>

    );
}

export default Page2;