import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    main: {
        background: "#FFF",
        borderRadius: 15,
        boxSizing: "border-box",
        color: "#222529",
        paddingBottom: 18,
        paddingTop: 18,
        paddingLeft: 22,
        paddingRight: 22,
        width: "100%"
    },
    inner: {
        color: "inherit",
        textDecoration: "none"
    },
    title: {
        fontSize: 21,
        fontWeight: "bold",
        marginBottom: 12
    },
    meta: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row"
    },
    progress: {
        height: 116,
        marginRight: 16,
        width: "25%"
    },
    metaDetails: {
        flex: 1,
        flexDirection: "column"
    },
    metaAmount: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        marginBottom: 8,
        marginLeft: -6
    },
    metaAmountText: {
        color: "#03A88A",
        fontSize: 34,
        fontWeight: 600,
    },
    metaAmountSymbol: {
        width: 22
    },
    metaDescription: {
        color: "#777",
        fontSize: 12,
        fontWeight: 400,
        letterSpacing: 0.3
    },
    creator: {
        alignItems: "center",
        color: "#333",
        display: "flex",
        flexDirection: "row",
        marginTop: 12
    },
    creatorText: {
        fontSize: 15,
        fontWeight: 700
    },
    support: {
        marginTop: 13
    },
    supportTitle: {
        fontSize: 12,
    },
    supporters: {
        display: "flex",
        flexDirection: "row",
        marginTop: 5,
        paddingLeft: 8
    },
    contributorImage: {
        borderColor: "#FFF",
        borderRadius: 13,
        borderWidth: 2,
        marginBottom: 0,
        marginLeft: -8,
        marginRight: 4,
        marginTop: 0,
        height: 25,
        width: 25
    },
    additionalContributors: {
        backgroundColor: "#f4f4f4",
        borderColor: "#FFF",
        borderRadius: 13,
        borderWidth: 2,
        height: 25,
        marginLeft: -8,
        width: 25
    },
    additionalContributorsText: {
        fontSize: 8,
        lineHeight: 22,
        textAlign: "center",
    }
})