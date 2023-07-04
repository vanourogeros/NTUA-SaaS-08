// import { StatusBar } from 'expo-status-bar';
// import { React, useEffect, useState, useCallback } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Alert, Button, ImageBackground, ScrollView } from 'react-native';
// import { Searchbar } from 'react-native-paper';

// export default function SearchQuestionnaire({ navigation, route }) {

//     let [content, setContent] = useState()



//     //searchbar functionality
//     let [searchQuery, setSearchQuery] = useState("");
//     let [isSearching, setSearching] = useState(false);

//     const { admin } = route.params;
//     const onChangeSearch = (query) => {
//         setSearchQuery(query);
//         if (query == "") {
//             setSearching(false);
//         }

//     }
//     const getSearchData = async () => {

//         if (searchQuery != "") {
//             setSearching(true);
//         }
//     }




//     const corsHeaders = {
//         'Access-Control-Allow-Origin': '*'
//     }


//     const getAndPrintResults = async () => {
//         const response = await fetch("http://localhost:9103/intelliq_api/questionnaire/QQ000", Headers = { corsHeaders }
//         )
//         const data = await response.json();
//         setContent(data.questions);

//         for (let i = 0; i < content.length; i++) {

//         }
//     }
//     const onPressUp = () => {
//         navigation.navigate("Upload")
//     }

//     const getQuestionaireList = async () => {
//         const response = await fetch("http://localhost:9103/intelliq_api/questionnaires/", Headers = { corsHeaders });
//         const data = await response.json();
//         console.log(data);
//         setContent(data)
//     };
//     let QID

//     const adminHeader = admin ? <View style={{ width: "100%", backgroundColor: "green", }}>
//         <Text style={{ alignSelf: "center", fontWeight: "600", color: "white" }}>
//             You have logged in as admin
//         </Text>
//     </View> :
//         <View style={{ width: "100%", backgroundColor: "grey", }}>
//             <Text style={{ alignSelf: "center", fontWeight: "600", color: "white" }}>
//                 You have logged in as guest
//             </Text>
//         </View>

//     const questionnaireList = !isSearching ?
//         <View style={{ alignSelf: 'center', width: "100%" }}>
//             <View style={{ alignSelf: 'center', width: "100%" }}>{content?.map((value, index) => {
//                 return <TouchableOpacity
//                     key={index}
//                     onPress={() => {
//                         console.log("pressed" + value.questionnaireID)
//                         admin ? navigation.navigate("SR", { QID: value.questionnaireID }) : navigation.navigate("Answer", { QID: value.questionnaireID })
//                     }
//                     }
//                     style={{
//                         width: "60%",
//                         margin: 4,
//                         height: 40,
//                         backgroundColor: "#de5d83",
//                         alignItems: 'center',
//                         textShadowColor: 'white',
//                         borderRadius: 10,
//                         paddingVertical: 3,
//                         alignSelf: 'center'
//                     }}><Text style={{ fontWeight: 'bold', color: 'white', alignContent: 'center', paddingTop: 4 }} adjustsFontSizeToFit={true} numberOfLines={1}>{value.questionnaireTitle}</Text></TouchableOpacity>
//             })}
//             </View>
//         </View > : <View style={{ alignSelf: 'center', width: "100%" }}>
//             <View style={{ alignSelf: 'center', width: "100%" }}>{content.filter(function (item) { return item.keywords.includes(searchQuery) }).map((value, index) => {
//                 return <TouchableOpacity
//                     key={index}
//                     onPress={() => {
//                         console.log("pressed" + value.questionnaireID)
//                         admin ? navigation.navigate("SR", { QID: value.questionnaireID }) : navigation.navigate("Answer", { QID: value.questionnaireID })
//                         // newTranslationID = content[index].questionnaireID;
//                         // console.log("n = " + newTranslationID)
//                         // navigation.navigate('metafrasi', {translationID: newTranslationID });
//                     }
//                     }
//                     style={{
//                         width: "60%",
//                         margin: 4,
//                         height: 40,
//                         backgroundColor: "#de5d83",
//                         alignItems: 'center',
//                         textShadowColor: 'white',
//                         borderRadius: 10,
//                         paddingVertical: 3,
//                         alignSelf: 'center'
//                     }}>
//                     <Text style={{ fontWeight: 'bold', color: 'white', alignContent: 'center', paddingTop: 4 }} adjustsFontSizeToFit={true} numberOfLines={1}>{value.questionnaireTitle}</Text></TouchableOpacity>
//             })}
//             </View>
//         </View >

//     const getQuestionnaireAnswers = async () => {
//         const response = await fetch("http://localhost:9103/intelliq_api/questionnaires/", Headers = { corsHeaders });
//         const data = await response.json();
//         console.log(data.data);
//         setContent(data.data)
//     }

//     // const uploadQuestionnaire
//     const onPressB = () => {
//         console.log("Navigate to use case 3")
//     }

//     useEffect(() => {
//         getQuestionaireList();
//     }, [])

//     return (
//         <ImageBackground
//             style={styles.container}
//             source={require("./assets/inteliqbg.png")}
//         >
//             {adminHeader}
//             <View width={"80%"}>
//                 <Text
//                     style={{
//                         fontSize: 40,
//                         fontWeight: 'bold',
//                         margin: 90,
//                         color: '#474747',


//                     }}>Select Questionnaire</Text>


//                 <Searchbar
//                     adjustsFontSizeToFit={true}
//                     onSubmitEditing={getSearchData}
//                     placeholder='Search by keyword...'
//                     onChangeText={onChangeSearch}
//                     value={searchQuery}
//                     style={{
//                         shadowColor: '#de5d83',
//                         width: "85%", marginBottom: 60, marginTop: 30,
//                         iconColor: '#de5d83',
//                         color: "#de5d83",
//                         shadowOpacity: 0.7,
//                         shadowRadius: 2,
//                         alignSelf: "center",
//                         fontSize: 12,
//                         margin: 10,

//                     }}
//                     inputStyle={{ color: '#de5d83' }}
//                     // placeholderTextColor="#ff6a00"

//                     iconColor='#de5d83'
//                     fontSize="6"
//                     onIconPress={getSearchData}
//                 />
//             </View>
//             <ScrollView style={{ flex: 1, width: "100%" }} >

//                 {questionnaireList}

//             </ScrollView>
//         </ImageBackground >
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         // backgroundColor: "white"
//     },
// });
