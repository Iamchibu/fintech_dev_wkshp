import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import User from "../../assets/svgs/user";

const color = (due_for_servicing) => {
  let color = "";
  if (due_for_servicing == true) {
    color = "#FF0000";
  } else if (due_for_servicing == false) {
    color = "#4848";
  } else {
    color = "#4848FF";
  }
  return color;
};

const { width } = Dimensions.get("window");
const TransactionItem = (props) => {
  return (
        <View style={styles.cardStyle} backgroundColor="#fff">
        <View style={styles.cardStyleInner}>
            <User/>
            <View style={{ flexDirection:"row", justifyContent: "space-between", width: width * 0.8 }}>
            <Text style={styles.title}>{props.item.title}</Text>
            {props.item.amount < 50 ?
            <Text style={styles.subtitleRed}>${props.item.amount}</Text>:
            <Text style={styles.subtitleGreen}>${props.item.amount}</Text>}
            </View>
            
        </View>
        <View style={{ flexDirection:"row"}}>
            <Text style={styles.subtitle}>10:23am</Text>
            <Text style={styles.subtitle}>02/02/23</Text> 
        </View>
        <View
                width={width * 0.9}
                height={1.5}
                marginTop={15}
                alignSelf={"center"}
                backgroundColor={"#D8E4EC"}
            />
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F6F6",
    top: 182,
    left: 19,
    right: 20,
    width: 164,
    height: 99,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    color: "#0A1017",
    marginStart: 13,
    width: width * 0.35,
    marginEnd: 38
  },
  subtitle:{
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    textAlign: "left",
    color: "#959595",
    top: 10,
    marginEnd: 19
  },
  subtitleRed: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    textAlign: "left",
    color: "#E10000",
    // textDecorationLine: "underline",
  },
  subtitleGreen: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    textAlign: "left",
    color: "#00CC2D",
    // textDecorationLine: "underline",
  },
  textDesign: {
    backgroundColor: "#E0F4FB",
    borderRadius: 11.93,
    bottom: 2, 
    marginStart: 7
  },
  textDesignStyle: {
    fontSize: 10,
    color: "#00A2CF",
    padding: 5
  },
  greenTitle: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
    color: "#359240"
  },
  imageStyle: {
    color: "#FFF",
    marginEnd: -40,
  },
  descriptionText: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 15,
    marginBottom: 27,
    left: 17,
    width: 111,
    marginEnd: 40,
    textAlign: "left",
    color: "#414D5B",
  },
  imageScoreText: {
    fontSize: 15,
    alignSelf: "center",
    color: "#323C47",
    fontWeight: "bold",
  },
  cardTitle: {
    fontWeight: "normal",
    fontSize: 20,
  },
  cardListTextTwo: {
    fontSize: 10,
    marginBottom: 5,
    fontWeight: "bold",
    flexWrap: "wrap",
    textAlign: "left",
    marginStart: 4,
    color: "#7C7C7C",
  },
  position: {
    position: "absolute",
    bottom: 3,
    right: 3
  },
  cardListTextTwoRed: {
    fontSize: 10,
    marginBottom: 5,
    fontWeight: "bold",
    flexWrap: "wrap",
    textAlign: "left",
    marginStart: 4,
    color: "#FF0000",
  },
  cardListTextTwoGreen: {
    fontSize: 10,
    marginBottom: 5,
    fontWeight: "bold",
    flexWrap: "wrap",
    textAlign: "left",
    marginStart: 4,
    color: "#3BC34E",
  },
  cardStyle: {
    // alignSelf: "center",
    width: width * 0.94,
    padding: 10,
    opacity: 1,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    elevation: 10,
  },
  cardStyleInner: {
    flexDirection: "row",
    width: width
  },
  cardStyleInnerLeftColumn: {
    flexDirection: "column",
    top: 4
  },
  cardStyleInnerRightColumn: {
    flexDirection: "column",
    width: width * 0.58,
  },
  cardHeaderText: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cardHeader: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  approvedLabel: {
    paddingTop: 5,
    borderRadius: 3,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
  },
  cardApprovedLabelText: {
    fontSize: 10,
    flex: 1,
    color: "#fff",
    flexWrap: "wrap",
    alignSelf: "center",
    fontWeight: "bold",
  },
  cardDescription: {
    marginBottom: 10,
  },
  staffName: {
    fontWeight: "bold",
  },
  ButtonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  Button: {
    borderRadius: 5,
    margin: 7,
    justifyContent: "center",
    alignContent: "center",
    width: width * 0.8,
    height: 35,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    alignItems: "center",
  },
});

export default TransactionItem;