// import { StatusBar } from 'expo-status-bar';
// import { React, useEffect, useState, useCallback } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Alert, Button, ImageBackground } from 'react-native';
// import { Table, Row, Rows } from 'react-native-table-component'
// // import Table from './components/Table';



// export default function SeeResults({ navigation, route }) {

//     // const QID = "QQXXX"
//     let { QID } = route.params
//     let [content, setContent] = useState()

//     let [finalHeader, setFinalHeader] = useState([])
//     const [finalBody, setFinalBody] = useState([])
//     const onPrint = () => {
//         console.log(header + " " + body)
//     }
//     const getHeadings = () => {
//         return Object.keys(data[0]);
//     }

//     const corsHeaders = {
//         'Access-Control-Allow-Origin': '*'
//     }



//     const getQuestionnaireAnswers = async () => {

//         const response = await fetch("http://localhost:9103/intelliq_api/getsessionanswers/" + QID, Headers = { corsHeaders });
//         const data = await response.json();
//         console.log(data);
//         setContent(data)
//         let header = ["SessionID",];
//         let body = [];
//         let track = [];
//         for (let i = 0; i < data.answers.length; i++) {
//             if (!header.includes(data.answers[i].qID)) {
//                 header.push(data.answers[i].qID)
//                 console.log(data.answers[i].qID)
//             }
//             if (!track.includes(data.answers[i].session)) {
//                 track.push(data.answers[i].session)
//                 body.push([data.answers[i].session])
//                 console.log(data.answers[i].session)
//             }
//         }
//         for (let i = 0; i < track.length; i++) {
//             for (let j = 1; j < header.length; j++) {
//                 body[i].push(" - ");
//             }
//         }
//         for (let k = 0; k < data.answers.length; k++) {
//             for (let i = 0; i < track.length; i++) {
//                 for (let j = 1; j < header.length; j++) {

//                     // console.log(k)
//                     // console.log("ss: " + data.answers[k].session)
//                     // console.log("qid: " + data.answers[k].qID)
//                     // console.log("track: " + track[i])
//                     // console.log("header: " + header[j])
//                     if ((data.answers[k].session == track[i]) && (data.answers[k].qID == header[j])) {
//                         console.log("mpjla")
//                         body[i][j] = data.answers[k].ans;
//                     }
//                 }
//             }
//         }
//         console.log(header)
//         console.log(body)
//         console.log(track)
//         setFinalBody(body);
//         setFinalHeader(header);

//     }

//     useEffect(() => {
//         // setFinalBody([])
//         // setFinalHeader([])
//         console.log(QID);
//         getQuestionnaireAnswers();
//     }, [])


//     return (

//         <ImageBackground
//             style={{
//                 flex: 1, justifyContent: "space-between",
//                 alignItems: 'center',
//                 textAlignVertical: 'center', width: "100%"
//             }}
//             source={require("./assets/inteliqbg.png")}
//             resizeMethod={'flex'}>
//             <View style={styles.container}>

//                 <View style={{ alignItems: 'center', top: -15 }}>
//                     <Text adjustsFontSizeToFit={true}
//                         numberOfLines={1}
//                         style={{
//                             fontSize: 40,
//                             fontWeight: 'bold',
//                             // margin: 50,

//                             //textShadowRadius: 1,
//                             // shadowColor: 'white',
//                             //textShadowColor: 'white',
//                             color: '#474747',
//                             top: -15
//                         }}>See Results</Text>
//                 </View>


//                 <View style={{ marginTop: 200 }}>
//                     <Text style={{ fontSize: 18, color: "#474747", fontWeight: "700" }}>Results for Questionnaire {QID}</Text>
//                     <Table style={{ width: "100%", flex: 1, marginTop: 26 }} borderStyle={{
//                         borderWidth: 5,
//                         borderColor: '#c8e1ff',
//                     }} >
//                         <Row data={finalHeader} style={{ height: 40, }} textStyle={{ alignSelf: "center", fontWeight: "600" }} />
//                         <Rows data={finalBody} style={{ height: 25, backgroundColor: "white" }} textStyle={{ alignSelf: "center", fontWeight: "200" }} />
//                     </Table>
//                 </View>

//             </View>
//         </ImageBackground>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         width: "100%",
//         // backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });
