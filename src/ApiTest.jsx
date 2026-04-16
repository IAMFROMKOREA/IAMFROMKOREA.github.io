import axios from 'axios';

//const { setIsLoading } = useContext(AppContext);
let tag = {
    values: "values{\r\n"
        + "        simpleValue\r\n"
        + "        inherited\r\n"
        + "        calculated\r\n"
        + "        editable\r\n"
        + "        values{\r\n"
        + "          valueId\r\n"
        + "        }\r\n"
        + "        attribute{\r\n"
        + "          id\r\n"
        + "          name\r\n"
        + "          specification\r\n"
        + "          listOfValuesBased\r\n"
        + "          listOfValues{\r\n"
        + "            id\r\n"
        + "            valueEntries{\r\n"
        + "              pageElements{\r\n"
        + "                valueId\r\n"
        + "                value\r\n"
        + "              }\r\n"
        + "            }\r\n"
        + "          }\r\n"
        + "        }\r\n"
        + "      }",
    objectType: "    objectType{\r\n"
        + "      id\r\n"
        + "      name\r\n"
        + "      children{\r\n"
        + "        id\r\n"
        + "        name\r\n"
        + "      }\r\n"
        + "    }\r\n",
    basic: "    id\r\n"
        + "    name\r\n"
        + "    hasChildren\r\n"
        + "    currentRevision\r\n"
        + "    currentRevisionLastEdited\r\n"
        + "    approvalStatus\r\n"
        + "    path { id name }\r\n",
    basic_asset: "    id\r\n"
        + "    name\r\n"
        + "    currentRevision\r\n"
        + "    currentRevisionLastEdited\r\n"
        + "    approvalStatus\r\n"
        + "    path { id name }\r\n",

    dataContainers: "  dataContainers{\r\n"
        + "        dataContainerType{\r\n"
        + "          id\r\n"
        + "          name\r\n"
        + "          validAttributes{\r\n"
        + "             id\r\n"
        + "             name\r\n"
        + "          }\r\n"
        + "        }\r\n"
        + "        dataContainers{\r\n"
        + "          id\r\n"
        + "          values{\r\n"
        + "            attribute{\r\n"
        + "              id\r\n"
        + "              name\r\n"
        + "              multivalued\r\n"
        + "              validListOfValuesEntries{\r\n"
        + "                pageElements{\r\n"
        + "                  value\r\n"
        + "                  valueId\r\n"
        + "                }  \r\n"
        + "              }\r\n"
        + "            }\r\n"
        + "            simpleValue            \r\n"
        + "            values{\r\n"
        + "              valueId\r\n"
        + "            }\r\n"
        + "          }\r\n"
        + "        }\r\n"
        + "      }"

}

tag = {...tag, 
    assets :"    assets {\r\n"
        + "      pageElements {\r\n"
        + "        id\r\n"
        + "        name\r\n"
        + tag.objectType
        + "      }\r\n"
        + "    }\r\n"
}

const typeids = {
    product: "Product",
    entity: "Entity"
}

function getCarData(callBack) {
    let formData = new FormData();
    formData.append("compCd", "H");
    formData.append("cntrtNo", "E4625ME000016");
    formData.append("cntrPersonNm", "김덕현");
    axios
        .post("/api/newcar/getTrackingInfo.do", formData).then((response) => {
            console.log(response.data.cntrPersonNm)
            callBack(response.data);
        });

}


function searchData(conditions, callBack) {
    let query = "query _query($condition: ConditionInput!){\r\n"
        + "  data_entity:searchForEntities(context: \"Context1\", workspace: #WORKSPACE#,   \r\n"
        + "    condition: $condition\r\n"
        + "    ) {\r\n"
        + "    pageElements {\r\n"
        + tag.basic
        + tag.values
        + tag.dataContainers
        + tag.objectType
        + "    }\r\n"
        + "  }\r\n"
        + "  \r\n"
        + "  data_product:searchForProducts(context: \"Context1\", workspace: #WORKSPACE#,    \r\n"
        + "    condition: $condition\r\n"
        + "    ) {\r\n"
        + "    pageElements {\r\n"
        + tag.basic
        + tag.values
        + tag.dataContainers
        + tag.objectType
        + "    }\r\n"
        + "  }\r\n"
        + "}";
    let condition;
    if (conditions.length > 1) {
        condition = { and: { conditions: conditions } };
    } else {
        condition = conditions[0];
    }


    callGraphQL(query, { "condition": condition }, callBack);
}



function searchDataByIdOrName(conditionValue, callBack) {
    let query = "query _query($condition: ConditionInput!){\r\n"
        + "  data_entity:searchForEntities(context: \"Context1\", workspace: #WORKSPACE#, first:20,  \r\n"
        + "    condition: $condition\r\n"
        + "    ) {\r\n"
        + "    pageElements {\r\n"
        + tag.basic
        + tag.values
        + tag.dataContainers
        + tag.objectType
        + "    }\r\n"
        + "  }\r\n"
        + "  \r\n"
        + "  data_product:searchForProducts(context: \"Context1\", workspace: #WORKSPACE#, first:20,   \r\n"
        + "    condition: $condition\r\n"
        + "    ) {\r\n"
        + "    pageElements {\r\n"
        + tag.basic
        + tag.values
        + tag.dataContainers
        + tag.objectType
        + "    }\r\n"
        + "  }\r\n"
        + "}";

    callGraphQL(query, { "condition": { or: { conditions: [{ id: { queryString: conditionValue + "*", operator: "like" } }, { name: { queryString: conditionValue + "*", operator: "like" } }] } } }, callBack);
}


function searchAttribute(conditions, callBack) {
    let query = "query _query($condition:ConditionInput!){\r\n"
        + "  searchForAttributes(context:\"Context1\" workspace:#WORKSPACE# \r\n"
        + "    condition:$condition){\r\n"
        + "    pageElements{\r\n"
        + "      id\r\n"
        + "      name\r\n"
        + "      listOfValues{\r\n"
        + "        id\r\n"
        + "        name\r\n"
        + "        valueEntries{\r\n"
        + "          pageElements{\r\n"
        + "            valueId\r\n"
        + "            value\r\n"
        + "          }\r\n"
        + "        }\r\n"
        + "      }\r\n"
        + "    }\r\n"
        + "  }\r\n"
        + "}";
    let condition = { or: { conditions: conditions } };
    callGraphQL(query, { "condition": condition }, callBack);
}


function setNodeSimpleValue(stepId, type, attId, attValue, callBack) {
    let query = "mutation _mutation($stepId: String! $type: SetNodeValueType! $attId:String! $attValue:String!) {\r\n"
        + "  setNodeValue(context: \"Context1\", workspace: #WORKSPACE#, input: {id: $stepId, type:$type , attribute: $attId, value: {simpleValue: $attValue }}) {\r\n"
        + "    success\r\n"
        + "    errors{message}"
        + "    value {\r\n"
        + "      attribute {\r\n"
        + "        id\r\n"
        + "      }\r\n"
        + "      simpleValue\r\n"
        + "    }\r\n"
        + "  }\r\n"
        + "}\r\n";
    callGraphQL(query, { "stepId": stepId, "type": typeids[type], "attId": attId, "attValue": attValue }, callBack);
}

function setNodeValueById(stepId, type, attId, attValueId, callBack) {
    let query = "mutation _mutation($stepId: String! $type: SetNodeValueType! $attId:String! $attValueId:String!) {\r\n"
        + "  setNodeValue(context: \"Context1\", workspace: #WORKSPACE#, input: {id: $stepId, type:$type , attribute: $attId, value: {valueId: $attValueId }}) {\r\n"
        + "    success\r\n"
        + "    errors{message}"
        + "    value {\r\n"
        + "      attribute {\r\n"
        + "        id\r\n"
        + "      }\r\n"
        + "      simpleValue\r\n"
        + "    }\r\n"
        + "  }\r\n"
        + "}\r\n";
    callGraphQL(query, { "stepId": stepId, "type": typeids[type], "attId": attId, "attValueId": attValueId }, callBack);
}


function setNodeName(stepId, type, name, callBack) {
    let query = "mutation _mutation($stepId:String!, $type:SetNodeNameType!, $name:String! ){\r\n"
        + "  setNodeName(context:\"Context1\" workspace:#WORKSPACE# input:{id:$stepId type:$type name:$name}){\r\n"
        + "    success\r\n"
        + "    errors{message}"
        + "  }\r\n"
        + "}";
    callGraphQL(query, { "stepId": stepId, "type": typeids[type], "name": name }, callBack);
}

function createData(parentId, superType, objectTypeId, callBack) {
    if (superType == 'product') {
        createProductData(parentId, objectTypeId, callBack)
    } else if (superType == 'entity') {
        createEntityData(parentId, objectTypeId, callBack)
    }
}

function createEntityData(parentId, objectTypeId, callBack) {
    let query = "mutation _mutation($parentId:String!, $objectTypeId:String!){\r\n"
        + "  createEntity(context: \"Context1\", workspace: #WORKSPACE#, input: {name: \"\", objectType: $objectTypeId, parent: $parentId}) {\r\n"
        + "    success\r\n"
        + "    errors {\r\n"
        + "      message\r\n"
        + "    }\r\n"
        + "    entity {\r\n"
        + tag.basic
        + tag.objectType
        + tag.values
        + "    }\r\n"
        + "  }\r\n"
        + "}";
    callGraphQL(query, { "parentId": parentId, "objectTypeId": objectTypeId }, callBack);
}

function createProductData(parentId, objectTypeId, callBack) {
    let query = "mutation _mutation($parentId:String!, $objectTypeId:String!){\r\n"
        + "  createProduct(context: \"Context1\", workspace: #WORKSPACE#, input: {name: \"\", objectType: $objectTypeId, parent: $parentId}) {\r\n"
        + "    success\r\n"
        + "    errors {\r\n"
        + "      message\r\n"
        + "    }\r\n"
        + "    product {\r\n"
        + tag.basic
        + tag.objectType
        + tag.values
        + "    }\r\n"
        + "  }\r\n"
        + "}";
    callGraphQL(query, { "parentId": parentId, "objectTypeId": objectTypeId }, callBack);
}


function getTopEntityRoot(callBack) {
    let query = "query{\n  topEntity(context:\"Context1\" workspace:#WORKSPACE#){\n    id\n  hasChildren }\n}";
    callGraphQL(query, null, callBack);
}

function getData(stepId, superType, callBack) {
    if (superType == 'product') {
        getProductData(stepId, callBack);
    } else if (superType == 'entity') {
        getEntityData(stepId, callBack);
    } else if (superType == 'classification') {
        getClassificationData(stepId, callBack);
    } else {
        getAssetData(stepId, callBack);
    }
}


function getEntityData(stepId, callBack) {

    let query = "query _query($id: String!) {\r\n"
        + "  entity(context: \"Context1\", workspace: #WORKSPACE#, id: $id) {\r\n"
        + tag.basic
        + tag.values
        + tag.dataContainers
        + tag.objectType
        + "    children {\r\n"
        + "      pageElements {\r\n"
        + "        id\r\n"
        + "        name\r\n"
        + "        hasChildren\r\n"
        + tag.objectType
        + "      }\r\n"
        + "    }\r\n"
        + "  }\r\n"
        + "}\r\n"
        + "";
    callGraphQL(query, { "id": stepId }, callBack);

}

function deleteData(stepId, superType, callBack) {


    let query = "mutation _mutation($id:String!, $superType:DeleteNodeType!){\r\n"
        + "  deleteNode(context:\"Context1\" workspace:\"Main\" input:{node:$id nodeType:$superType}){\r\n"
        + "    success\r\n"
        + "    errors{\r\n"
        + "      message\r\n"
        + "    }\r\n"
        + "  }\r\n"
        + "}";

    ;
    callGraphQL(query, { id: stepId, superType: typeids[superType] }, callBack);
}


function getProductData(stepId, callBack) {
    let query = "query _query($id: String!) {\r\n"
        + "  product(context: \"Context1\", workspace: #WORKSPACE#, id: $id) {\r\n"
        + tag.basic
        + tag.values
        + tag.dataContainers
        + tag.objectType
        + "    children {\r\n"
        + "      pageElements {\r\n"
        + "        id\r\n"
        + "        name\r\n"
        + "        hasChildren\r\n"
        + tag.objectType
        + "      }\r\n"
        + "    }\r\n"
        + "  }\r\n"
        + "}";
    callGraphQL(query, { "id": stepId }, callBack);
}


function getAssetData(stepId, callBack) {
    let query = "query _query($id: String!) {\r\n"
        + "  asset(context: \"Context1\", workspace: #WORKSPACE#, id: $id) {\r\n"
        + tag.basic_asset
        + tag.values
        + tag.objectType
        +"      contentUri"
        + "  }\r\n"
        + "}";
    callGraphQL(query, { "id": stepId }, callBack);
}


function getClassificationData(stepId, callBack) {
    let query = "query _query($id: String!) {\r\n"
        + "  classification(context: \"Context1\", workspace: #WORKSPACE#, id: $id) {\r\n"
        + tag.basic
        + tag.values
        + tag.objectType
        + tag.assets
        + "    children {\r\n"
        + "      pageElements {\r\n"
        + "        id\r\n"
        + "        name\r\n"
        + "        hasChildren\r\n"
        + tag.assets
        + tag.objectType
        + "      }\r\n"
        + "    }\r\n"

       

        + "  }\r\n"
        + "}";
    callGraphQL(query, { "id": stepId }, callBack);
}



async function callGraphQL(query, variables, callBack) {
    //const { setIsLoading } = useContext(AppContext);
    const stepId = sessionStorage.getItem("stepId");
    const stepPassword = sessionStorage.getItem("stepPassword");
    const workSpace = sessionStorage.getItem("isMainWS") == "true" ? "Main" : "Approved";
    const domain = sessionStorage.getItem("domain");
    query = query.replaceAll("#WORKSPACE#", "\"" + workSpace + "\"");
    let token = await getToken(stepId, stepPassword);
    await axios
        .post(domain + "/graphqlv2/graphql", { "query": query, "variables": variables }, { headers: { Authorization: token } }).then((response) => {
            callBack(response.data);
        }).catch((err) => {
            console.log("callGraphQLERR==" + err)
        });

}


async function getExtensionInfo(source, callBack) {
    const setpId = sessionStorage.getItem("stepId");
    const stepPassword = sessionStorage.getItem("stepPassword");
    const domain = sessionStorage.getItem("domain");
    let token = await getToken(setpId, stepPassword);
    await axios
        .get(domain + "/system-management/step/extensions", { params: { source: source }, headers: { Authorization: token } }).then((response) => {
            callBack(response);
        }).catch((err) => {
            console.log("call getExtensionInfo==" + err);
            callBack(err);
        });
}


async function putExtensionInfo(body, callBack) {
    const setpId = sessionStorage.getItem("stepId");
    const stepPassword = sessionStorage.getItem("stepPassword");
    const domain = sessionStorage.getItem("domain");
    let token = await getToken(setpId, stepPassword);
    await axios
        .put(domain + "/system-management/step/extensions", body, { headers: { Authorization: token } }).then((response) => {
            callBack(response);
        }).catch((err) => {
            console.log("call putExtensionInfo==" + err)
            callBack(err);
        });
}


async function doRestartServer(callBack) {
    const setpId = sessionStorage.getItem("stepId");
    const stepPassword = sessionStorage.getItem("stepPassword");
    const domain = sessionStorage.getItem("domain");
    let token = await getToken(setpId, stepPassword);
    await axios
        .post(domain + "/system-management/step/restart", {}, { headers: { Authorization: token } }).then((response) => {
            callBack(response);
        }).catch((err) => {
            console.log("call doRestartServer==" + err)
            callBack(err);
        });
    return token;
}





async function getToken(stepId, stepPassword) {
    let token = "";
    const domain = sessionStorage.getItem("domain");
    let url = domain + "/graphqlv2/auth?userId=#STEPID#&password=#STEPPASSWORD#";
    url = url.replaceAll("#STEPID#", stepId).replaceAll("#STEPPASSWORD#", stepPassword);
    await axios
        .post(url, {}, { headers: { "Content-Type": "application/x-www-form-urlencoded" } }).then((response) => {
            if (response.status == 200) {
                token = "Bearer " + response.data;
            }
        }).catch((err) => {
            console.log("getTokenERR==" + err)
        });
    return token;
}


function getTokenWithDomain(stepId, stepPassword, domain, callBack) {
    let token = "";
    let url = domain + "/graphqlv2/auth?userId=#STEPID#&password=#STEPPASSWORD#";
    url = url.replaceAll("#STEPID#", stepId).replaceAll("#STEPPASSWORD#", stepPassword);
    axios
        .post(url, {}, { headers: { "Content-Type": "application/x-www-form-urlencoded" } }).then((response) => {
            if (response.status == 200) {
                token = "Bearer " + response.data;
                callBack(token, "");
            }

        }).catch((err) => {
            callBack("", err);
        });
    return token;
}

async function setPathChildDataToSession(curData, callBack) {
    if (curData.id != "") {
        await curData.path.map((obj) => {
            getData(obj.id, curData.superType, (data) => {
                let tempObj = {};
                if (data.data[curData.superType] != undefined) {
                    tempObj = cloneObject(data.data[curData.superType]);
                }
                sessionStorage.setItem("tree_child_" + obj.id, JSON.stringify({ superType: curData.superType, children: tempObj.children.pageElements }));
            });
        })

        if (callBack != null) {
            callBack();
        }
    }
}

function cloneObject(obj) {
    let clone = {};
    for (let i in obj) {
        if (typeof (obj[i]) == "object" && obj[i] != null) {
            if (Array.isArray(obj[i])) {
                clone[i] = [];
                for (let k in obj[i]) {
                    clone[i][k] = JSON.parse(JSON.stringify(obj[i][k]));
                }
            } else {
                clone[i] = cloneObject(obj[i]);
            }
        } else {
            let j = Object.getOwnPropertyDescriptor(obj, i);
            clone[i] = j.value
        }
    }
    return clone;
}


function scrollToCurId(stepId) {
    if (document.querySelector('#treeElement_' + stepId) != null) {
        let divTop = document.querySelector('#treeElement_' + stepId).offsetTop;
        document.getElementById('curTabArea').scrollTo({ top: divTop - 200, behavior: 'smooth' });
    }
}

export {
    getData, getCarData, getEntityData, getToken, cloneObject, getProductData, getTopEntityRoot, createEntityData,
    createData, createProductData, setNodeSimpleValue, setNodeValueById, setNodeName, searchData, searchAttribute,
    setPathChildDataToSession, scrollToCurId, deleteData, getExtensionInfo, putExtensionInfo, searchDataByIdOrName,
    doRestartServer, getTokenWithDomain, getAssetData, getClassificationData
};