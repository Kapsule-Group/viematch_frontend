import React from "react";

import {
  Image,
  Document,
  Page,
  Text,
  StyleSheet,
  Font,
  View,
} from "@react-pdf/renderer";
import { data_image } from "../../Orders/OrdersInner/imagedata";
import MontserratRegulsar from "./pdfFonts/Montserrat-Regular.ttf";
import MontserratSemiBold from "./pdfFonts/Montserrat-SemiBold.ttf";
import moment from "moment";

// Register font
Font.register({
  family: "Montserrat",
  fonts: [
    { src: MontserratRegulsar, fontWeight: 400 },
    { src: MontserratSemiBold, fontWeight: 600 },
  ],
});

const styles = StyleSheet.create({
  logo: {
    width: 159,
    height: 48,
    marginBottom: 48,
  },
  page: {
    padding: 48,
    paddingBottom: 36,
    display: "flex",
    flexDirection: "column",
  },
  mainTitle: {
    fontSize: 20,
    textAlign: "left",
    color: "#204569",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    width: "100%",
  },
  header_column: {
    display: "flex",
    flexDirection: "column",
  },
  text_bold: {
    fontSize: 10,
    color: "#204569",
    fontFamily: "Montserrat",
    fontWeight: 600,
    marginBottom: 4,
    textAlign: "left",
  },
  text_bold_right: {
    fontSize: 10,
    color: "#204569",
    fontFamily: "Montserrat",
    fontWeight: 600,
    marginBottom: 4,
    textAlign: "right",
    marginLeft: 47,
  },
  text_light: {
    fontSize: 10,
    color: "#204569",
    fontFamily: "Montserrat",
    fontWeight: 600,
    marginBottom: 4,
    textAlign: "left",
  },
  text: {
    fontSize: 10,
    color: "#204569",
    marginBottom: 4,
    textAlign: "left",
    justifyContent: "flex-start",
  },
  textAfterBold: {
    fontSize: 10,
    color: "#204569",
    marginBottom: 3,
    marginLeft: 5,
    textTransform: "capitalize",
  },
  textAfterBoldLow: {
    fontSize: 10,
    color: "#204569",
    marginBottom: 4,
    marginLeft: 5,
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  hr: {
    borderTop: "1px solid #204569",
    opacity: 0.25,
    marginBottom: 5,
    marginTop: 5,
  },
  hr_dashed: {
    borderTop: "1px dashed #204569",
    opacity: 0.25,
    marginBottom: 5,
    marginTop: 5,
  },
  tableHeader: {
    backgroundColor: "#EBF4FE",
    padding: "6px 12px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableHeaderBordered: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  tableBordered: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: -5,
  },
  tableCellSmall: {
    fontSize: 9,
    marginBottom: 4,
    color: "#204569",
    display: "flex",
    height: 26,
    display: "flex",
    padding: "6px 12px",
    flexDirection: "column",
    textAlign: "left",
    alignContent: "center",
    maxWidth: 84,
    borderLeft: "1px solid #d0d8df",
    borderBottom: "1px solid #d0d8df",
    width: "100%",
    letterSpacing: "-0.25px",
  },
  tableCellSmallLast: {
    fontSize: 9,
    color: "#204569",
    marginBottom: 4,
    display: "flex",
    height: 26,
    display: "flex",
    padding: "6px 12px",
    flexDirection: "column",
    textAlign: "left",
    alignContent: "center",
    maxWidth: 84,
    borderLeft: "1px solid #d0d8df",
    borderRight: "1px solid #d0d8df",
    borderBottom: "1px solid #d0d8df",
    width: "100%",
    letterSpacing: "-0.25px",
  },

  headerCellSmall: {
    fontSize: 9,
    color: "#204569",
    marginBottom: 4,
    display: "flex",
    height: 32,
    display: "flex",
    backgroundColor: "#EBF4FE",
    padding: "6px 12px",
    flexDirection: "column",
    textAlign: "left",
    alignContent: "center",
    maxWidth: 84,
    borderLeft: "1px solid #d0d8df",
    borderTop: "1px solid #d0d8df",
    width: "100%",
    letterSpacing: "-0.25px",
  },
  headerCellSmallLast: {
    fontSize: 9,
    color: "#204569",
    display: "flex",
    flexDirection: "column",
    marginBottom: 4,
    height: 32,
    display: "flex",
    backgroundColor: "#EBF4FE",
    padding: "6px 12px",
    flexDirection: "column",
    alignContent: "center",
    textAlign: "left",
    maxWidth: 84,
    borderLeft: "1px solid #d0d8df",
    borderRight: "1px solid #d0d8df",
    borderTop: "1px solid #d0d8df",
    width: "100%",
    letterSpacing: "-0.25px",
  },

  tableRow: {
    display: "flex",
    flexDirection: "row",
    padding: "4px 12px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableRowLight: {
    display: "flex",
    flexDirection: "row",
    padding: "4px 12px",
    justifyContent: "space-between",
    alignItems: "center",
    opacity: 0.5,
  },

  tableRowMarked: {
    display: "flex",
    flexDirection: "row",
    padding: "6px 12px",
    justifyContent: "space-between",
    alignItems: "center",

    borderTop: "1px dashed #d0d8df",
    borderBottom: "1px dashed #d0d8df",
  },

  headerCell: {
    fontSize: 10,
    color: "#204569",
    marginBottom: 4,
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    justifyContent: "flex-start",
    maxWidth: "25%",
    width: "100%",
  },
  headerCellDate: {
    fontSize: 10,
    color: "#204569",
    marginBottom: 4,
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    justifyContent: "flex-start",
    maxWidth: "13%",
    width: "100%",
  },

  headerCellLast: {
    fontSize: 10,
    color: "#204569",
    marginBottom: 4,
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    justifyContent: "flex-start",
    maxWidth: "10%",
    width: "100%",
  },

  headerCellLarge: {
    fontSize: 10,
    color: "#204569",
    marginBottom: 4,
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    justifyContent: "flex-start",
    maxWidth: "52%",
    width: "100%",
  },

  cell: {
    fontSize: 10,
    color: "#204569",
    marginBottom: 4,
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    justifyContent: "flex-start",
    maxWidth: "25%",
    width: "100%",
    textTransform: "capitalize",
  },
  cellDate: {
    fontSize: 10,
    color: "#204569",
    marginBottom: 4,
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    justifyContent: "flex-start",
    maxWidth: "13%",
    width: "100%",
    textTransform: "capitalize",
  },
  cellLast: {
    fontSize: 10,
    color: "#204569",
    marginBottom: 4,
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    justifyContent: "flex-start",
    maxWidth: "10%",
    width: "100%",
  },

  cellLarge: {
    fontSize: 9,
    color: "#204569",
    marginBottom: 4,
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    justifyContent: "flex-start",
    maxWidth: "52%",
    width: "100%",
  },
  cellLargeMarked: {
    fontSize: 10,
    color: "#204569",
    marginBottom: 4,
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
    justifyContent: "flex-start",
    maxWidth: "77%",
    width: "100%",
  },
});

function PrintPDF(pdfData) {
  const info = pdfData.pdfData;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={data_image} style={styles.logo} />
        <Text style={styles.mainTitle}>STATEMENT</Text>

        <View style={styles.header}>
          <View style={styles.header_column}>
            <Text style={styles.text_bold}>TO</Text>
            <Text style={styles.text}>
              {info && info.username && info.username}
            </Text>
            <View style={styles.row}>
              <Text style={styles.text_bold}>TIN</Text>
              <Text style={styles.textAfterBold}>
                {info && info.tin ? info.tin : "-"}
              </Text>
            </View>
          </View>
          <View style={styles.header_column}>
            <View style={styles.row}>
              <Text style={styles.text_bold_right}>{"DATE"}</Text>
              <Text style={styles.textAfterBold}>
                {moment(info && info.date && info.date).format("DD/MM/YYYY")}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text_bold}>AMOUNT DUE</Text>
              <Text style={styles.textAfterBold}>
                {" "}
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                }).format(
                  Number(
                    info && info.current_balance && info.current_balance > 0
                      ? Math.abs(info.current_balance)
                      : 0
                  ).toFixed(0)
                )}{" "}
                {info && info.currency && info.currency}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.hr}></Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.headerCellDate}>DATE</Text>
          <Text style={styles.headerCellLarge}>TYPE</Text>
          <Text style={styles.headerCell}>METHOD</Text>
          <Text style={styles.headerCellLast}>AMOUNT</Text>
        </View>

        {info &&
          info.balance_activity &&
          info.balance_activity.map((row) => {
            return (
              <>
                {row.type.type_obj !== "balance_forward" && (
                  <View
                    style={
                      row.type.type_obj === "order_auto_payment" && !row.count
                        ? styles.tableRowLight
                        : styles.tableRow
                    }
                    key={row.id}
                  >
                    <Text style={styles.cellDate}>{row.date}</Text>
                    <View style={styles.cellLarge}>
                      <Text style={styles.text_bold}>
                        {row.type.type_obj === "order_auto_payment" && !row.count && "–"}
                        {row.type.type_obj === "clinic_payment" ||
                        row.type.type_obj === "refund_payment"
                          ? "Submitted amount"
                          : row.type.type_obj === "order_payment"
                          ? `Payment for ${row.type.name}`
                          : row.type.type_obj === "order_auto_payment" &&
                          row.count === true
                          ? `Refunded Invoice ${row.type.name}`
                          : row.type.type_obj === "order_auto_payment" &&
                          row.count === false
                          ? `Auto-payment for ${row.type.name}`
                          : row.type.type_obj === "order" &&
                            `Invoice ${row.type.name}`}
                      </Text>
                      {/* {row.type.name} */}
                      {row.payment_status && (
                        <Text style={styles.textAfterBold}>
                          ({row.payment_status})
                        </Text>
                      )}
                    </View>
                    <Text style={styles.cell}>
                      {row.method
                        ? row.method === "transfer"
                          ? "Bank Transfer"
                          : row.method === "mobile"
                          ? "Mobile Money"
                          : row.method
                        : "-"}{" "}
                      {row.type &&
                        row.type.type_obj &&
                        row.type.type_obj === "refund_payment" &&
                        " - Refund"}
                    </Text>
                    <Text style={styles.cellLast}>
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 0,
                      }).format(Number(row.amount).toFixed(0))}
                    </Text>
                  </View>
                )}

                {row.type.type_obj === "balance_forward" && (
                  <View style={styles.tableRowMarked} key={row.id}>
                    <Text style={styles.cellDate}>{row.date}</Text>
                    <View style={styles.cellLargeMarked}>
                      <Text style={styles.text_bold}>{" Balance forward"}</Text>
                      <Text
                        style={styles.textAfterBoldLow}
                      >{`by the end of the quarter ${
                        row.type.name === 1
                          ? "I"
                          : row.type.name === 2
                          ? "II"
                          : row.type.name === 3
                          ? "III"
                          : "IV"
                      }`}</Text>
                    </View>
                    <Text style={styles.cellLast}>
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 0,
                      }).format(Number(row.amount).toFixed(0))}
                    </Text>
                  </View>
                )}
              </>
            );
          })}

        <View>
          <Text style={styles.hr_dashed}></Text>
        </View>

        <View wrap={false} break={false}>
          <View style={styles.tableHeaderBordered}>
            <Text style={styles.headerCellSmall}>CURRENT</Text>
            <Text style={styles.headerCellSmall}>1-30 DAYS PAST DUE</Text>
            <Text style={styles.headerCellSmall}>31-60 DAYS PAST DUE</Text>
            <Text style={styles.headerCellSmall}>61-90 DAYS PAST DUE</Text>
            <Text style={styles.headerCellSmall}>OVER 90 DAYS PAST DUE</Text>
            <Text style={styles.headerCellSmallLast}>AMOUNT DUE</Text>
          </View>
          <View style={styles.tableBordered}>
            <Text style={styles.tableCellSmall}>
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
              }).format(
                Number(
                  info && info.current_balance && info.current_balance < 0
                    ? Math.abs(info.current_balance)
                    : 0
                ).toFixed(0)
              )}
            </Text>
            <Text style={styles.tableCellSmall}>
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
              }).format(
                Number(info && info.days_30 && info.days_30).toFixed(0)
              )}
            </Text>
            <Text style={styles.tableCellSmall}>
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
              }).format(
                Number(info && info.days_60 && info.days_60).toFixed(0)
              )}
            </Text>
            <Text style={styles.tableCellSmall}>
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
              }).format(
                Number(info && info.days_90 && info.days_90).toFixed(0)
              )}
            </Text>
            <Text style={styles.tableCellSmall}>
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
              }).format(
                Number(info && info.over_90_days && info.over_90_days).toFixed(
                  0
                )
              )}
            </Text>
            <Text style={styles.tableCellSmallLast}>
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
              }).format(
                Number(
                  info && info.current_balance && info.current_balance > 0
                    ? Math.abs(info.current_balance)
                    : 0
                ).toFixed(0)
              )}{" "}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default PrintPDF;
