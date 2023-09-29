import React from "react";

import { Image, Document, Page, Text, StyleSheet, Font, View } from "@react-pdf/renderer";

// import MontserratRegular from "./pdfFonts/Helvetica-Regular.ttf";
// import MontserratSemiBold from "./pdfFonts/Helvetica-SemiBold.ttf";

import moment from "moment";

// Register font
// Font.register({
//     family: "Helvetica",
//     fonts: [
//         { src: MontserratRegular, fontWeight: 400 },
//         { src: MontserratSemiBold, fontWeight: 600 }
//     ]
// });

const s = StyleSheet.create({
    logo: {
        width: 195,
        height: 83,
        marginBottom: 48,
        marginRight: 48
    },
    page: {
        padding: 48,
        paddingBottom: 36,
        display: "flex",
        flexDirection: "column"
    },
    row: {
        display: "flex",
        flexDirection: "row"
    },
    table: {
        display: "flex",
        flexDirection: "column"
    },
    tableLeftAlign: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    tableRightAlign: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 5
    },
    headerTxtBold: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        marginBottom: 2,
        fontWeight: 600,
        color: "#204569"
    },
    headerTxt: {
        fontSize: 8,
        fontFamily: "Helvetica",
        marginBottom: 2,
        fontWeight: 400,
        color: "#204569"
    },
    headerTxtBlock: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    mainTitle: {
        fontSize: 20,
        fontFamily: "Helvetica-Bold",
        fontWeight: 600,
        color: "#204569",
        marginBottom: 8
    },
    proformaInfoBlock: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    infoBlockLeft: {
        display: "flex",
        flexDirection: "column"
    },
    infoBlockRight: {
        display: "flex",
        flexDirection: "row",
        marginLeft: 120
    },
    hr: {
        borderTop: "1px solid #204569",
        borderTopWidth: 1,
        width: "100%",
        marginTop: 8,
        marginBottom: 8,
        opacity: 0.25
    },
    hrDashed: {
        borderTop: "1px dashed #204569",
        borderTopWidth: 1,
        width: "100%",
        marginTop: 8,
        opacity: 0.25
    },

    infoBlockTextBold: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        marginBottom: 4,
        textTransform: "uppercase",
        fontWeight: 600,
        color: "#204569",
        marginRight: 4
    },
    infoBlockText: {
        fontSize: 10,
        fontFamily: "Helvetica",
        marginBottom: 4,
        textTransform: "uppercase",
        fontWeight: 400,
        color: "#204569"
    },
    tableHead: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#EBF4FE",

        paddingBottom: 6,
        paddingTop: 6,
        paddingLeft: 12,
        paddingRight: 12
    },

    tableRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",

        paddingBottom: 6,
        paddingTop: 6,
        paddingLeft: 12,
        paddingRight: 12
    },

    tableCellM: {
        display: "flex",
        fontSize: 7,
        fontFamily: "Helvetica",
        fontWeight: 400,
        width: 60,
        marginLeft: 10,
        color: "#204569"
    },
    tableHeadCellM: {
        display: "flex",
        fontSize: 9,
        fontFamily: "Helvetica",
        textTransform: "uppercase",
        fontWeight: 400,
        width: 60,
        marginLeft: 10,
        color: "#204569"
    },
    tableCellS: {
        display: "flex",
        fontSize: 7,
        fontFamily: "Helvetica",
        fontWeight: 400,
        width: 40,
        marginLeft: 10,
        color: "#204569"
    },
    tableHeadCellS: {
        display: "flex",
        fontSize: 9,
        fontFamily: "Helvetica",
        textTransform: "uppercase",
        fontWeight: 400,
        width: 40,
        marginLeft: 10,
        color: "#204569"
    },
    tableCellFirst: {
        display: "flex",
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        fontWeight: 600,
        width: 180,
        color: "#204569"
    },
    tableHeadCellFirst: {
        display: "flex",
        fontSize: 9,
        fontFamily: "Helvetica",
        textTransform: "uppercase",
        fontWeight: 400,
        width: 180,
        color: "#204569"
    },

    totalBlock: {
        display: "flex",
        flexDirection: "row",
        marginTop: 16
    },
    totalBlockText: {
        display: "flex",
        fontSize: 10,
        fontFamily: "Helvetica",
        fontWeight: 400,
        textTransform: "uppercase",
        marginLeft: 200,
        width: 190,
        color: "#204569"
    },
    totalBlockValue: {
        display: "flex",
        fontSize: 14,
        fontFamily: "Helvetica-Bold",
        fontWeight: 600,
        textTransform: "uppercase",
        width: 210,
        color: "#204569"
    },
    notesBlock: {
        display: "flex",
        marginTop: 15
    },
    notesBlockText: {
        display: "flex",
        fontSize: 8,
        fontFamily: "Helvetica",
        width: 115,
        fontWeight: 400,
        marginLeft: 380,
        color: "#204569"
    },
    stamp: {
        width: 100,
        height: 100,
        marginTop: 15,
        display: "flex",
        marginLeft: "auto",
        marginBottom: 10
    },
    footer: {
        display: "flex",
        fontSize: 8,
        fontFamily: "Helvetica",
        fontWeight: 400,
        color: "#204569",
        opacity: 0.5,
        marginBottom: 8
    },
    rowFooter: {
        display: "flex",
        flexDirection: "row",
        borderTop: "1px dashed #c7d0d9",
        borderTopWidth: 1,
        paddingTop: 6,
        paddingBottom: 6,
        marginLeft: "auto"
    },
    tableFooterCellM: {
        display: "flex",
        fontSize: 9,
        fontFamily: "Helvetica",
        fontWeight: 400,
        marginLeft: 24,
        color: "#204569",

        marginRight: 20
    },
    tableFooterCellMBold: {
        display: "flex",
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        fontWeight: 600,
        width: 80,
        marginLeft: 24,
        color: "#204569"
    },
    tableFooterCellS: {
        display: "flex",
        fontSize: 9,
        fontFamily: "Helvetica",
        fontWeight: 400,
        marginLeft: 24,
        marginRight: 24,
        color: "#204569"
    }
});

function ProformaPDF(pdfData) {
    const info = pdfData.pdfData;

    const logoFormat =
        info.region &&
        info.region.logo &&
        info.region.logo.url &&
        info.region.logo.url.split(".")[info.region.logo.url.split(".").length - 1];

    const logo = `data:image/${logoFormat};base64,${info &&
        info.region &&
        info.region.logo &&
        info.region.logo.logo &&
        info.region.logo.logo}`;
    const stampFormat =
        info.region &&
        info.region.image &&
        info.region.image.url &&
        info.region.image.url.split(".")[info.region.image.url.split(".").length - 1];
    const stamp = `data:image/${stampFormat};base64,${info &&
        info.region &&
        info.region.image &&
        info.region.image.image &&
        info.region.image.image}`;

    let discountValue =
        info && info.discount && info.discount ? (info.total * info.discount) / (100 + +info.discount) : 0;

    let isDiscount = info && info.discount;

    return (
        <Document>
            <Page size="A4" style={s.page}>
                {/* PDF HEADER WITH LOGO AND ADDRESS */}
                <View style={s.header}>
                    <Image src={logo} style={s.logo} />
                    <View style={s.headerTxtBlock}>
                        <Text style={s.headerTxtBold}>
                            {info && info.region && info.region.header && info.region.header}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.address1 && info.region.address1}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.address2 && info.region.address2}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.address3 && info.region.address3}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.address4 && info.region.address4}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.address5 && info.region.address5}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.address6 && info.region.address6}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.address7 && info.region.address7}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.address8 && info.region.address8}
                        </Text>
                    </View>
                </View>

                {/* INFO BEFORE TABLE */}

                <Text style={s.mainTitle}>PROFORMA INVOICE</Text>

                <View style={s.proformaInfoBlock}>
                    <View style={s.infoBlockLeft}>
                        <Text style={s.infoBlockTextBold}>Bill to</Text>
                        <Text style={s.infoBlockText}>{info && info.customer_name && info.customer_name}</Text>
                        <View style={s.row}>
                            <Text style={s.infoBlockTextBold}>Tin</Text>
                            <Text style={s.infoBlockText}>{info && info.tin && info.tin}</Text>
                        </View>
                    </View>
                    <View style={s.infoBlockRight}>
                        <View style={s.tableRightAlign}>
                            <Text style={s.infoBlockTextBold}>ID</Text>
                            <Text style={s.infoBlockTextBold}>Date</Text>
                            <Text style={s.infoBlockTextBold}>Sales rep</Text>
                            <Text style={s.infoBlockTextBold}>Quotation Validity</Text>
                        </View>
                        <View style={s.tableLeftAlign}>
                            <Text style={s.infoBlockText}>{info && info.id && info.id}</Text>
                            <Text style={s.infoBlockText}>
                                {moment(info && info.date && info.date).format("DD/MM/YYYY")}
                            </Text>
                            <Text style={s.infoBlockText}>
                                {info && info.sales_pdf && info.sales_pdf
                                    ? info.sales_pdf === "VIEBEG MEDICAL LTD"
                                        ? "Viebeg Medical LTD"
                                        : info.sales_pdf
                                    : "-"}
                            </Text>
                            <Text style={s.infoBlockText}>
                                {info && info.due_date && info.due_date !== null
                                    ? moment(info.due_date).format("DD/MM/YYYY")
                                    : "-"}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={s.hr} />
                <View style={s.tableHead}>
                    <Text style={s.tableHeadCellFirst}>Item description</Text>
                    <Text style={s.tableHeadCellS}>p. size</Text>
                    <Text style={s.tableHeadCellS}>QTY</Text>
                    <Text style={s.tableHeadCellS}>AVAL</Text>
                    <Text style={s.tableHeadCellM}>Unit price</Text>
                    <Text style={s.tableHeadCellM}>Total</Text>
                </View>

                {/* TABLE */}

                <View style={s.table}>
                    {info &&
                        info.items &&
                        info.items.map(row => {
                            return (
                                <View style={s.tableRow} key={row && row.id && row.id}>
                                    <Text style={s.tableCellFirst}>{row.product_name}</Text>
                                    <Text style={s.tableCellS}>{row.pack_size !== null ? row.pack_size : "-"}</Text>
                                    <Text style={s.tableCellS}>{row.quantity}</Text>
                                    <Text style={s.tableCellS}>{row.availability}</Text>

                                    <Text style={s.tableCellM}>
                                        {info && info.currency && info.currency}{" "}
                                        {new Intl.NumberFormat("en-US", {
                                            minimumFractionDigits: 2
                                        }).format(Number(row.price_per_unit).toFixed(2))}
                                    </Text>
                                    <Text style={s.tableCellM}>
                                        {info && info.currency && info.currency}{" "}
                                        {new Intl.NumberFormat("en-US", {
                                            minimumFractionDigits: 2
                                        }).format(Number(row.quantity * row.price_per_unit).toFixed(2))}
                                    </Text>
                                </View>
                            );
                        })}
                    {!!isDiscount && (
                        <View
                            style={
                                info && info.region && info.region.vat && info.region.vat !== 0 ? s.tableFooter : s.none
                            }
                        >
                            <View style={s.rowFooter}>
                                <Text style={s.tableFooterCellS}>DISCOUNT</Text>
                                <Text style={s.tableFooterCellS}>{info && info.discount && info.discount}%</Text>
                                <Text style={s.tableFooterCellM}>
                                    {info && info.currency && info.currency}{" "}
                                    {new Intl.NumberFormat("en-US", {
                                        minimumFractionDigits: 2
                                    }).format(Number(discountValue).toFixed(2))}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={s.hrDashed} />

                {/* Total */}
                <View style={s.totalBlock}>
                    <Text style={s.totalBlockText}>Total</Text>
                    <Text style={s.totalBlockValue}>
                        {info && info.currency && info.currency}{" "}
                        {new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2
                        }).format(Number(info && info.total && info.total).toFixed(2))}
                    </Text>
                </View>

                {/*Notes*/}
                <View style={s.notesBlock}>
                    <Text style={s.notesBlockText}>{info && info.notes && info.notes}</Text>
                </View>

                <View style={s.row}>
                    {/*BANK INFO*/}

                    <View style={s.headerTxtBlock}>
                        <Text style={s.headerTxtBold}>VAT EXMPTED</Text>

                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.bank_info1 && info.region.bank_info1}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.bank_info2 && info.region.bank_info2}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.bank_info3 && info.region.bank_info3}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.bank_info4 && info.region.bank_info4}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.delivery_info1 && info.region.delivery_info1}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.delivery_info2 && info.region.delivery_info2}
                        </Text>
                        <Text style={s.headerTxt}>
                            {info && info.region && info.region.delivery_info3 && info.region.delivery_info3}
                        </Text>
                    </View>
                    {/*STAMP*/}

                    {info.region && info.region.image && info.region.image.image && (
                        <Image src={stamp} style={s.stamp} />
                    )}
                </View>

                {/*FOOTER*/}
                <Text style={s.footer}>{info && info.region && info.region.footer1 && info.region.footer1}</Text>
                <Text style={s.footer}>{info && info.region && info.region.footer2 && info.region.footer2}</Text>
                <Text style={s.footer}>{info && info.region && info.region.footer3 && info.region.footer3}</Text>
            </Page>
        </Document>
    );
}

export default ProformaPDF;
