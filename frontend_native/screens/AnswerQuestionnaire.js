// import { StatusBar } from 'expo-status-bar';
// import { React, useEffect, useState, useCallback } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Alert, Button, ImageBackground } from 'react-native';
// import { Table, Row, Rows } from 'react-native-table-component'
// // import RadioButtonRN from 'radio-buttons-react-native'
// import RadioButton from 'react-native-paper'

// export default function AnswerQuestionnaire({ navigation, route }) {

//     const { QID } = route.params;
//     let [title, setTitle] = useState("Questionnaire")
//     let [nQID, setNQID] = useState("P00")
//     let [question, setQuestion] = useState("")
//     let [nQIDArray, setNQIDArray] = useState([])
//     let [completed, setCompleted] = useState(false)
//     let [ans, setAns] = useState([])
//     let [session, setSession] = useState("no-session")
//     let [options, setOptions] = useState([])
//     let [API, setAPI] = useState("");
//     const corsHeaders = {
//         'Access-Control-Allow-Origin': '*'
//     }

//     // program to generate random strings

//     // declare all characters
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     const onPressButton = () => {
//         console.log("peops")
//         navigation.navigate("Questionnaires", { admin: false })
//     }
//     function generateString(length) {
//         let result = ' ';
//         const charactersLength = characters.length;
//         for (let i = 0; i < length; i++) {
//             result += characters.charAt(Math.floor(Math.random() * 20));
//         }

//         return result;
//     }
//     const getQuestionnaireAnswers = async () => {
//         const response = await fetch("http://localhost:9103/intelliq_api/questionnaire/" + QID, Headers = { corsHeaders });
//         const data = await response.json();
//         //randomize session
//         let toBeSession = generateString(6)
//         console.log(toBeSession)
//         setSession(toBeSession)
//         console.log(data);
//         getFirstQ()
//         setTitle(data.questionnaireTitle)

//     }

//     let answerArray = [];
//     let nextqidArray = [];
//     let optionsArray = [];

//     const send = () => {
//         fetch(APItoFetch, {
//             method: 'POST', headers: { corsHeaders }
//         })
//             .then((response) => response.json())
//             .then((responseJson) => {
//                 console.log(responseJson);
//                 // this.setState({
//                 //    data: responseJson
//                 // })
//             })
//             .catch((error) => {
//                 console.error(error);
//             });
//         // const res2 = await res.json();
//         // console.log(res2)
//     }
//     const getFirstQ = async () => {
//         // send(API)
//         answerArray = [];
//         nextqidArray = [];
//         optionsArray = [];
//         console.log(nQID + "is NQID")
//         let quetionTxt;

//         const response2 = await fetch("http://localhost:9103/intelliq_api/question/" + QID + '/' + nQID, Headers = { corsHeaders });
//         console.log("http://localhost:9103/intelliq_api/question/" + QID + '/' + nQID)
//         const data2 = await response2.json();
//         console.log(data2);
//         console.log(data2.qtext);
//         quetionTxt = data2.qtext;
//         // setAnswer(data2.options);
//         for (let i = 0; i < data2.options.length; i++) {
//             answerArray.push(data2.options[i].opttxt);
//             nextqidArray.push(data2.options[i].nextqID);
//             optionsArray.push(data2.options[i].optID)
//         }
//         console.log(quetionTxt)
//         console.log(nextqidArray)
//         console.log(answerArray)
//         setAns(answerArray);
//         setNQIDArray(nextqidArray)
//         setQuestion(quetionTxt)
//         setOptions(optionsArray)


//     }
//     let APItoFetch;




//     const answerList = <View style={{ alignSelf: 'center', width: "100%" }}>
//         <View style={{ alignSelf: 'center', width: "100%" }}>{ans?.map((value, index) => {
//             return <TouchableOpacity
//                 key={index}
//                 onPress={() => {
//                     APItoFetch = ("http://localhost:9103/intelliq_api/doanswer/" + QID + '/' + nQID + '/' + session + '/' + options[index])
//                     setAPI(APItoFetch)
//                     send(API)
//                     console.log("pressed" + value)

//                     if (nQIDArray[index] != '-') {
//                         setNQID(nQIDArray[index])
//                         console.log("Stuck in != -")

//                         console.log(nQIDArray[index])

//                         getFirstQ();
//                         // send(API)cd
//                         // console.log("sent get ")
//                     }
//                     else {
//                         setCompleted(true);
//                         console.log(completed)
//                     }
//                     // APItoFetch = ("http://localhost:9103/intelliq_api/doanswer/" + QID + '/' + nQID + '/' + session + '/' + options[index]).replace(/\s+/g, '')

//                 }
//                 }
//                 style={{
//                     width: "90%",
//                     margin: 4,
//                     height: 40,
//                     backgroundColor: "#de5d83",
//                     alignItems: 'center',
//                     textShadowColor: 'white',
//                     borderRadius: 10,
//                     paddingVertical: 3,
//                     alignSelf: 'center'
//                 }}><Text style={{ fontWeight: 'bold', color: 'white', alignContent: 'center', paddingTop: 4 }} adjustsFontSizeToFit={true} numberOfLines={1}>
//                     {value}</Text></TouchableOpacity>
//         })}
//         </View>
//     </View >

//     const completedText = completed ? <View> <Text adjustsFontSizeToFit={true}
//         numberOfLines={1}
//         style={{
//             fontSize: 40,
//             fontWeight: 'bold',
//             color: '#474747',
//             top: -15,
//             alignSelf: "center"
//         }}>Questionnaire completed!</Text>
//         <TouchableOpacity
//             onPress={onPressButton}
//             style={{
//                 width: "30%",
//                 margin: 4,
//                 height: 40,
//                 backgroundColor: "red",
//                 alignItems: 'center',
//                 textShadowColor: 'white',
//                 borderRadius: 10,
//                 paddingVertical: 3,
//                 alignSelf: 'center'
//             }}>
//             <Text adjustsFontSizeToFit={true}
//                 numberOfLines={1}
//                 style={{
//                     fontSize: 20,
//                     fontWeight: 'bold',
//                     color: 'white',
//                     top: -15,
//                     alignSelf: "center"
//                 }}>Go Back</Text>
//         </TouchableOpacity> </View> : <Text></Text>

//     const titles = <Text style={{ fontSize: 18, color: "#474747", fontWeight: "700" }}>{title}{QID}</Text>
//     const setNextQuestion = () => {
//         setNQID(data2.options[selection].nextqID)
//     }

//     const getNextQ = async () => {
//         const response3 = await fetch("http://localhost:9103/intelliq_api/question/" + QID + '/' + nQID, Headers = { corsHeaders });
//         const data2 = await response3.json();
//         console.log(data2);
//     }

//     useEffect(() => {
//         console.log(QID);
//         getQuestionnaireAnswers();
//     }, [])

//     // const showQuestion = (data) => <View><Text>{data.qtext}</Text></View>

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
//                             color: '#474747',
//                             top: -15
//                         }}>{title}</Text>
//                 </View>


//                 <View style={{ marginTop: 200 }}>
//                     <Text adjustsFontSizeToFit={true}
//                         numberOfLines={1}
//                         style={{
//                             fontSize: 30,
//                             fontWeight: 'bold',
//                             color: '#474747',
//                             top: -15
//                         }}>{question}</Text>
//                     <View style={{ marginTop: 70 }}></View>
//                     {/* <Table style={{ width: "100%", flex: 1, marginTop: 26 }} borderStyle={{
//                         borderWidth: 5,
//                         borderColor: '#c8e1ff',
//                     }} >

//                         <Row data={finalHeader} style={{ height: 40, }} textStyle={{ alignSelf: "center", fontWeight: "600" }} />
//                         <Rows data={finalBody} style={{ height: 25, backgroundColor: "white" }} textStyle={{ alignSelf: "center", fontWeight: "200" }} />
//                     </Table> */}
//                     {answerList}
//                     <View style={{ margin: 30 }}></View>
//                     {completedText}
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
