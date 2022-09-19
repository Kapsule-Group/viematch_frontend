import React from 'react';

import { Image, Document, Page, Text, StyleSheet, Font, View } from '@react-pdf/renderer';

import MontserratRegular from '../../CustomerStatements/CustomerStatementsInner/pdfFonts/Montserrat-Regular.ttf';
import MontserratSemiBold from '../../CustomerStatements/CustomerStatementsInner/pdfFonts/Montserrat-SemiBold.ttf';

import moment from 'moment';

// Register font
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: MontserratRegular, fontWeight: 400 },
    { src: MontserratSemiBold, fontWeight: 600 },
  ],
});

const s = StyleSheet.create({
  logo: {
    width: 195,
    height: 83,
    marginBottom: 48,
    marginRight: 48,
  },
  page: {
    padding: 48,
    paddingBottom: 36,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  row_relative: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  rowMargin: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 12,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableLeftAlign: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  tableRightAlign: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  headerTxtBold: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    marginBottom: 2,
    fontWeight: 600,
    color: '#204569',
  },
  headerTxtBoldMargin: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    marginBottom: 6,
    fontWeight: 600,
    color: '#204569',
    zIndex: 5,
  },
  headerTxt: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    marginBottom: 2,
    fontWeight: 400,
    color: '#204569',
  },
  headerTxtMargin: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    marginBottom: 6,
    fontWeight: 400,
    color: '#204569',
    zIndex: 5,
  },
  headerTxtBlock: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  mainTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat',
    textTransform: 'uppercase',
    marginBottom: 2,
    fontWeight: 600,
    color: '#204569',
    marginBottom: 8,
  },
  proformaInfoBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBlockLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoBlockRight: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 120,
  },
  hr: {
    borderTop: '1px solid #204569',
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
    opacity: 0.25,
  },
  hrDashed: {
    borderTop: '1px dashed #204569',
    width: '100%',
    marginTop: 8,
    opacity: 0.25,
  },

  infoBlockTextBold: {
    fontSize: 10,
    fontFamily: 'Montserrat',
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: 600,
    color: '#204569',
    marginRight: 4,
  },
  infoBlockText: {
    fontSize: 10,
    fontFamily: 'Montserrat',
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: 400,
    color: '#204569',
  },
  infoBlockTextCapitalize: {
    fontSize: 10,
    fontFamily: 'Montserrat',
    marginBottom: 2,
    fontWeight: 400,
    color: '#204569',
  },
  tableHead: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EBF4FE',

    paddingBottom: 6,
    paddingTop: 6,
    paddingLeft: 12,
    paddingRight: 12,
  },

  tableHeadCellM: {
    display: 'flex',
    fontSize: 9,
    fontFamily: 'Montserrat',
    textTransform: 'uppercase',
    fontWeight: 400,
    width: 80,
    marginLeft: 24,
    color: '#204569',
  },
  tableHeadCellS: {
    display: 'flex',
    fontSize: 9,
    fontFamily: 'Montserrat',
    textTransform: 'uppercase',
    fontWeight: 400,
    width: 45,
    marginLeft: 24,
    color: '#204569',
  },
  tableHeadCellFirst: {
    display: 'flex',
    fontSize: 9,
    fontFamily: 'Montserrat',
    textTransform: 'uppercase',
    fontWeight: 400,
    width: 240,
    color: '#204569',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingBottom: 6,
    paddingTop: 6,
    paddingLeft: 12,
    paddingRight: 12,
  },

  tableCellM: {
    display: 'flex',
    fontSize: 7,
    fontFamily: 'Montserrat',
    fontWeight: 400,
    width: 80,
    marginLeft: 24,
    color: '#204569',
  },
  tableCellS: {
    display: 'flex',
    fontSize: 7,
    fontFamily: 'Montserrat',
    fontWeight: 400,
    width: 45,
    marginLeft: 24,
    color: '#204569',
  },
  tableCellFirst: {
    display: 'flex',
    fontSize: 7,
    fontFamily: 'Montserrat',
    fontWeight: 600,
    width: 240,
    color: '#204569',
  },
  totalBlock: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 16,
  },
  totalBlockText: {
    display: 'flex',
    fontSize: 10,
    fontFamily: 'Montserrat',
    fontWeight: 400,
    textTransform: 'uppercase',
    marginLeft: 280,
    width: 200,
    color: '#204569',
  },
  totalBlockValue: {
    display: 'flex',
    fontSize: 14,
    fontFamily: 'Montserrat',
    fontWeight: 600,
    textTransform: 'uppercase',
    width: 200,
    color: '#204569',
  },
  notesBlock: {
    display: 'flex',
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 'auto',
  },
  notesBlockText: {
    display: 'flex',
    fontSize: 8,
    fontFamily: 'Montserrat',
    width: 115,
    fontWeight: 400,
    marginTop: 15,
    color: '#204569',
  },
  stamp: {
    width: 100,
    height: 100,
    display: 'flex',
    position: 'absolute',
    zIndex: 10,
    left: 90,
  },
  footer: {
    display: 'flex',
    fontSize: 8,
    fontFamily: 'Montserrat',
    fontWeight: 400,
    color: '#204569',
    opacity: 0.5,
    marginBottom: 8,
  },
  tableFooter: {
    display: 'flex',
    marginLeft: 220,
    marginTop: 15,
  },
  rowFooter: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px dashed #c7d0d9',
    paddingTop: 6,
    paddingBottom: 6,
  },
  tableFooterCellM: {
    display: 'flex',
    fontSize: 9,
    fontFamily: 'Montserrat',
    fontWeight: 400,
    width: 80,
    marginLeft: 24,
    color: '#204569',
  },
  tableFooterCellMBold: {
    display: 'flex',
    fontSize: 9,
    fontFamily: 'Montserrat',
    fontWeight: 600,
    width: 80,
    marginLeft: 24,
    color: '#204569',
  },
  tableFooterCellS: {
    display: 'flex',
    fontSize: 9,
    fontFamily: 'Montserrat',
    fontWeight: 400,
    width: 60,
    marginLeft: 24,
    color: '#204569',
  },
  total: {
    display: 'flex',
    marginLeft: 90,
    marginTop: 15,
    width: 250,
    // border: "1px solid #204569",
  },
  rowTotal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  totalTxt: {
    display: 'flex',
    fontSize: 9,
    fontFamily: 'Montserrat',
    textTransform: 'uppercase',
    fontWeight: 400,
    width: 80,
    color: '#204569',
  },
  totalTxtBold: {
    display: 'flex',
    fontSize: 9,
    fontFamily: 'Montserrat',
    textTransform: 'uppercase',
    fontWeight: 600,
    // marginLeft: 120,
    color: '#204569',
  },
  totalTxtBoldL: {
    display: 'flex',
    fontSize: 12,
    fontFamily: 'Montserrat',
    textTransform: 'uppercase',
    fontWeight: 600,
    // marginLeft: 95,
    color: '#204569',
  },
  none: {
    display: 'none',
  },
});

function InvoicePDF(pdfData) {
  const info = pdfData.pdfData;

  const logoFormat =
    info.region &&
    info.region.logo &&
    info.region.logo.url &&
    info.region.logo.url.split('.')[info.region.logo.url.split('.').length - 1];

  const logo = `data:image/${logoFormat};base64,${info &&
    info.region &&
    info.region.logo &&
    info.region.logo.logo &&
    info.region.logo.logo}`;

  const stampFormat =
    info.region &&
    info.region.image &&
    info.region.image.url &&
    info.region.image.url.split('.')[info.region.image.url.split('.').length - 1];
  const stamp = `data:image/${stampFormat};base64,${info &&
    info.region &&
    info.region.image &&
    info.region.image.image &&
    info.region.image.image}`;

  let vatValue =
    info && info.region && info.region.vat
      ? (info.total * info.region.vat) / (100 + +info.region.vat)
      : 0;
  let discountValue =
    info && info.discount && info.discount
      ? (info.total * info.discount) / (100 + +info.discount)
      : 0;

  let subTotalValue = info.total - vatValue;

  let isVat = info && info.region && info.region.vat && info.region.vat;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* PDF HEADER WITH LOGO AND ADDRESS */}
        <View style={s.header}>
          {logo && <Image src={logo} style={s.logo} />}

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

        <Text style={s.mainTitle}>{info && info.status}</Text>

        <View style={s.proformaInfoBlock}>
          <View style={s.infoBlockLeft}>
            <Text style={s.infoBlockTextBold}>Bill to</Text>
            <Text style={s.infoBlockText}>
              {info && info.user && info.user.username && info.user.username}
            </Text>
            <View style={s.row}>
              <Text style={s.infoBlockTextBold}>Tin</Text>
              <Text style={s.infoBlockText}>
                {info && info.user && info.user.tin && info.user.tin}
              </Text>
            </View>
          </View>
          <View style={s.infoBlockRight}>
            <View style={s.tableRightAlign}>
              <Text style={s.infoBlockTextBold}>
                {info && info.status !== 'invoice' ? 'ID' : 'Invoice no'}
              </Text>

              <Text style={s.infoBlockTextBold}>Date</Text>
              <Text style={s.infoBlockTextBold}>DUE DATE</Text>

              <Text style={s.infoBlockTextBold}>TERMS</Text>
              <Text style={s.infoBlockTextBold}>Sales rep</Text>
            </View>
            <View style={s.tableLeftAlign}>
              <Text style={s.infoBlockText}>{info && info.request && info.request}</Text>

              <Text style={s.infoBlockText}>
                {moment(info && info.date && info.date).format('DD/MM/YYYY')}
              </Text>
              <Text style={s.infoBlockText}>
                {info && info.due_date && info.due_date !== null
                  ? moment(info.due_date).format('DD/MM/YYYY')
                  : '-'}
              </Text>

              <Text style={s.infoBlockTextCapitalize}>Net 30</Text>
              <Text style={s.infoBlockText}>
                {info && info.sales_pdf && info.sales_pdf
                  ? info.sales_pdf === 'VIEBEG MEDICAL LTD'
                    ? 'Viebeg Medical LTD'
                    : info.sales_pdf
                  : '-'}
              </Text>
            </View>
          </View>
        </View>
        <View style={s.hr} />
        <View style={s.tableHead}>
          <Text style={s.tableHeadCellFirst}></Text>
          <Text style={s.tableHeadCellS}>QTY</Text>
          <Text style={s.tableHeadCellM}>Rate</Text>
          <Text style={s.tableHeadCellM}>Amount</Text>
        </View>

        {/* TABLE */}

        <View style={s.table}>
          {info &&
            info.items &&
            info.items.map((row) => {
              return (
                <View style={s.tableRow} key={row && row.id && row.id}>
                  <Text style={s.tableCellFirst}>{row.product.name}</Text>

                  <Text style={s.tableCellS}>{row.quantity}</Text>

                  <Text style={s.tableCellM}>
                    {info && info.currency && info.currency}{' '}
                    {new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 0,
                    }).format(Number(row.price_per_unit).toFixed(0))}
                  </Text>
                  <Text style={s.tableCellM}>
                    {info && info.currency && info.currency}{' '}
                    {new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 0,
                    }).format(Number(row.quantity * row.price_per_unit).toFixed(0))}
                  </Text>
                </View>
              );
            })}
        </View>

        {/* TABLE FOOTER */}

        {!!isVat && (
          <View
            style={
              info && info.region && info.region.vat && info.region.vat !== 0
                ? s.tableFooter
                : s.none
            }>
            <View style={s.rowFooter}>
              <Text style={s.tableFooterCellS}>SUBTOTAL</Text>
              <Text style={s.tableFooterCellM}></Text>
              <Text style={s.tableFooterCellM}>
                {info && info.currency && info.currency}{' '}
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                }).format(Number(subTotalValue).toFixed(0))}
              </Text>
            </View>
            <View style={s.rowFooter}>
              <Text style={s.tableFooterCellS}>VAT</Text>
              <Text style={s.tableFooterCellM}>
                {info && info.region && info.region.vat && info.region.vat}%
              </Text>
              <Text style={s.tableFooterCellM}>
                {info && info.currency && info.currency}{' '}
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                }).format(Number(vatValue).toFixed(0))}
              </Text>
            </View>
            <View style={s.rowFooter}>
              <Text style={s.tableFooterCellS}>DISCOUNT</Text>
              <Text style={s.tableFooterCellM}>{info && info.discount && info.discount}%</Text>
              <Text style={s.tableFooterCellM}>
                {info && info.currency && info.currency}{' '}
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                }).format(Number(discountValue).toFixed(0))}
              </Text>
            </View>
            <View style={s.rowFooter}>
              <Text style={s.tableFooterCellS}>TOTAL</Text>
              <Text style={s.tableFooterCellM}></Text>
              <Text style={s.tableFooterCellMBold}>
                {info && info.currency && info.currency}{' '}
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                }).format(Number(info && info.total && info.total).toFixed(0))}
              </Text>
            </View>
          </View>
        )}

        <View style={s.hrDashed} />

        {/*BANK INFO*/}
        <View style={s.rowMargin}>
          <View style={s.headerTxtBlock}>
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

          <View style={s.total}>
            <View style={s.rowTotal}>
              <Text style={s.totalTxt}>Payment</Text>
              <Text style={s.totalTxtBold}>
                {info && info.currency && info.currency}{' '}
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                }).format(Number(info && info.total && info.total).toFixed(0))}
              </Text>
            </View>
            <View style={s.rowTotal}>
              <Text style={s.totalTxt}>BALANCE DUE</Text>
              <Text style={s.totalTxtBoldL}>
                {info && info.currency && info.currency}{' '}
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                }).format(Number(info && info.balance && info.balance).toFixed(0))}
              </Text>
            </View>
            {/*Notes*/}
            <View style={s.notesBlock}>
              <Text style={s.notesBlockText}>{info && info.notes && info.notes}</Text>
            </View>
          </View>
        </View>

        <View style={s.row_relative}>
          {/*Sign docs*/}
          <View style={s.column}>
            <View style={s.column}>
              <Text style={s.headerTxtBoldMargin}>Prepared by</Text>
              <Text style={s.headerTxtMargin}>
                Name: __________________________________________
              </Text>
              <Text style={s.headerTxtMargin}>
                Signature: ______________________________________
              </Text>
            </View>
            <View style={s.column}>
              <Text style={s.headerTxtBoldMargin}>Received by</Text>
              <Text style={s.headerTxtMargin}>
                Name: __________________________________________
              </Text>
              <Text style={s.headerTxtMargin}>
                Signature: ______________________________________
              </Text>
            </View>
          </View>
          {/*STAMP*/}
          {info.region && info.region.image && info.region.image.image && (
            <Image src={stamp} style={s.stamp} />
          )}
        </View>
        {/*FOOTER*/}
        <Text style={s.footer}>
          {info && info.region && info.region.footer1 && info.region.footer1}
        </Text>
        <Text style={s.footer}>
          {info && info.region && info.region.footer2 && info.region.footer2}
        </Text>

        <Text style={s.footer}>
          {info && info.region && info.region.footer3 && info.region.footer3}
        </Text>
      </Page>
    </Document>
  );
}

export default InvoicePDF;
