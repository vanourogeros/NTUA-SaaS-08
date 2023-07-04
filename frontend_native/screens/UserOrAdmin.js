// import { StatusBar } from 'expo-status-bar';
// import { React, useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, ImageBackground, TextInput, Platform } from 'react-native';

// export default function UserOrAdmin(props) {

//     const onPressB = () => {
//         // console.log("Navigate to use case 1")
//         props.navigation.navigate("Questionnaires", { admin: false })
//     }
//     const onPressUser = () => {
//         props.navigation.navigate("Questionnaires", { admin: false })
//     }
//     const onToggleAdmin = () => {
//         setAdminClicked(!adminClicked);
//     }
//     const callAlert = () => {
//         Alert.alert('Invalid Username or Password');
//     }
//     const onPressAdmin = () => {
//         if ((username == "admin") && (password == "admin"))
//             props.navigation.navigate("Questionnaires", { admin: true })
//         else {
//             console.log("Invalid Password")
//         }
//     }
//     let [adminClicked, setAdminClicked] = useState(false)


//     const [username, changeUsername] = useState("")
//     const [password, changePassword] = useState("")

//     const setUsername = (value) => {
//         changeUsername(value)
//     }
//     const setPassword = (value) => {
//         changePassword(value)
//     }


//     const logInForm = adminClicked ? <View>
//         <View style={{ margin: 30 }}></View>

//         <TextInput
//             style={[styles.input, { borderWidth: 2, height: 30, borderRadius: 5, textAlign: "center", backgroundColor: "white", alignSelf: 'center', width: "30%" }]}
//             onChangeText={changeUsername}
//             value={username}
//             placeholder={"username"}
//         />

//         <TextInput
//             style={[styles.input, { borderWidth: 2, height: 30, borderRadius: 5, textAlign: "center", marginTop: 10, backgroundColor: "white", alignSelf: 'center', width: "30%" }]}
//             onChangeText={changePassword}
//             value={password}
//             placeholder={"password"}
//         />
//         <View style={{ margin: 10 }}></View>
//         <TouchableOpacity
//             onPress={onPressAdmin}
//             style={styles.LogInButton}>
//             <Text style={{ fontWeight: 'bold', color: 'white', alignContent: 'center', paddingTop: 5, fontSize: 15 }} adjustsFontSizeToFit={true} numberOfLines={1}>LogIn</Text>
//         </TouchableOpacity>

//     </View> : <View></View>


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
//                 <View style={{ top: 90 }}>
//                     <View style={{ alignItems: 'center', top: -15 }}>
//                         <Text adjustsFontSizeToFit={true}
//                             numberOfLines={1}
//                             style={{
//                                 fontSize: 40,
//                                 fontWeight: 'bold',
//                                 color: '#474747',
//                                 top: -15
//                             }}>Welcome to</Text>
//                     </View>
//                     <Image source={require("./assets/inteliq_logo.png")} style={{
//                         width: 800,
//                         height: 100,
//                         margin: 50
//                     }}
//                         resizeMode={'contain'}
//                     /></View>

//                 <View style={{ width: "80%", margin: 80, }}>
//                     <TouchableOpacity
//                         onPress={onPressB}
//                         style={styles.Button}>
//                         <Text style={{ fontWeight: 'bold', color: 'white', alignContent: 'center', paddingTop: 5, fontSize: 24 }} adjustsFontSizeToFit={true} numberOfLines={1}>User</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         onPress={onToggleAdmin}
//                         style={styles.Button}>
//                         <Text style={{ fontWeight: 'bold', color: 'white', alignContent: 'center', paddingTop: 5, fontSize: 24 }} adjustsFontSizeToFit={true} numberOfLines={1}>Admin</Text>
//                     </TouchableOpacity>
//                     {logInForm}
//                 </View>

//                 <View style={{ alignSelf: "flex- end", }} >
//                     <Text style={styles.footernames}>Ομάδα 9</Text>
//                     <View style={{ flexDirection: "row", alignContent: 'space-between', alignSelf: "center", }}> <Text style={styles.footernamess}>Μιχελάκης Π.  </Text>
//                         <Text style={styles.footernamess}>Μπουσμπουκέα Γ.   </Text>
//                         <Text style={styles.footernamess}>Σαμπάνης Α. </Text></View>
//                     <View style={{ flexDirection: "row", alignContent: 'space-around', alignSelf: "center" }}> <Text style={styles.footernamess}>Σίσκος Κ.  </Text>
//                         <Text style={styles.footernamess}>Τσέλιγκας Γ.   </Text>
//                         <Text style={styles.footernamess}>Φρουδάκης Ε.  </Text></View>

//                     <View style={{ margin: 10 }}></View>
//                 </View>
//             </View>
//         </ImageBackground >
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         width: "100%",
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     footernames: {
//         fontWeight: '500', color: '#1976d2', alignSelf: 'center', fontSize: 24
//     },
//     footernamess: {
//         fontWeight: '500', color: '#64b5f6', alignSelf: 'center', fontSize: 24
//     },
//     Button: {

//         width: "50%",
//         margin: 4,
//         height: 50,
//         backgroundColor: "#de5d83",
//         alignItems: 'center',
//         textShadowColor: 'white',
//         borderRadius: 10,
//         paddingVertical: 3,
//         alignSelf: 'center'

//     },
//     LogInButton: {

//         width: "30%",
//         margin: 4,
//         height: 35,
//         backgroundColor: "#53c24f",
//         alignItems: 'center',
//         textShadowColor: 'white',
//         borderRadius: 10,
//         paddingVertical: 2,
//         alignSelf: 'center'
//     }
// });
