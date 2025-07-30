import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// Adjust logo path as needed
const LOGO_PATH = '/invoice-logo.png';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  logo: {
    width: 160,
    height: 80,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 10,
    marginBottom: 12,
  },
  tableSection: {
    marginBottom: 0,
    paddingBottom: 3,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 5,
    paddingBottom: 3,
  },
  textBold: {
    fontWeight: 'bold',
  },
  textFont: {
    fontSize: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  col: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  table: {
    // const identityId = "c3a6b8c1-e2ca-473d-a648-755a4aa6250e"

    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  td: {
    flex: 1,
    fontSize: 10,
  },
  textRight: {
    textAlign: 'right',
  },
  totalsTable: {
    alignSelf: 'flex-end',
    width: '60%',
    marginTop: 20,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: 1,
    paddingVertical: 4,
  },
  grandTotal: {
    backgroundColor: '#e8f4f8',
    fontWeight: 'bold',
  },
  notes: {
    marginTop: 20,
    fontSize: 10,
    borderTop: 1,
    paddingTop: 8,
  },
});

const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const InvoicePreviewTemplate = ({ invoice, application }: any) => (
  <Document>
    <Page style={styles.page} size={'A4'}>
      {/* Logo */}
      <Image src={LOGO_PATH} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>INVOICE - #{invoice?.id}</Text>
      <Text style={styles.subheading}>
        Ministry of Environment and Climate Change Strategy - Environmental
        Protection Division
      </Text>

      {/* Invoice Details */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>
          <Text style={styles.textFont}>
            <Text style={styles.textBold}>Application: </Text>
            {application?.appType?.description}
          </Text>
          <Text style={styles.textFont}>
            <Text style={styles.textBold}>Issued: </Text>{' '}
            {formatDate(invoice?.issuedDate)}
          </Text>
          <Text style={styles.textFont}>
            <Text style={styles.textBold}>Due: </Text>{' '}
            {formatDate(invoice?.dueDate)}
          </Text>
          <Text style={styles.textFont}>
            <Text style={styles.textBold}>Status: </Text>{' '}
            {invoice?.invoiceStatus}
          </Text>
        </View>
      </View>

      {/* Invoice Issued To*/}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.sectionTitle}>Issued To</Text>
          <Text style={styles.textFont}>
            <Text style={styles.textBold}>Recipient: </Text>
            {invoice?.recipient?.value || `ID: ${invoice?.personId}`}
          </Text>
          <Text style={styles.textFont}>
            <Text style={styles.textBold}>Subject: </Text>
            {invoice?.subject}
          </Text>
        </View>
      </View>

      {/* Line Items Table */}
      <Text style={styles.sectionTitle}>Invoice Items</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.td}>Description</Text>
          <Text style={styles.td}>Type</Text>
          <Text style={[styles.td, styles.textRight]}>Quantity</Text>
          <Text style={[styles.td, styles.textRight]}>Cost</Text>
          <Text style={[styles.td, styles.textRight]}>Total</Text>
        </View>
        {invoice?.invoiceItems.map((item: any, idx: number) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={styles.td}>{item.description}</Text>
            <Text style={styles.td}>{item.itemType}</Text>
            <Text style={[styles.td, styles.textRight]}>{item.quantity}</Text>
            <Text style={[styles.td, styles.textRight]}>
              {`$${item.unitPriceInCents}`}
            </Text>
            <Text style={[styles.td, styles.textRight]}>
              {`$${item.totalInCents}`}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsTable}>
        <View style={styles.totalsRow}>
          <Text>Subtotal:</Text>
          <Text>{formatCurrency(invoice?.subtotalInCents)}</Text>
        </View>
        <View style={styles.totalsRow}>
          <Text>GST (5%):</Text>
          <Text>
            {invoice?.taxExempt
              ? 'Tax Exempt'
              : formatCurrency(invoice?.gstInCents)}
          </Text>
        </View>
        <View style={styles.totalsRow}>
          <Text>PST (7%):</Text>
          <Text>
            {invoice?.pstExempt || invoice?.taxExempt
              ? 'Tax Exempt'
              : formatCurrency(invoice?.pstInCents)}
          </Text>
        </View>
        <View style={[styles.totalsRow, styles.grandTotal]}>
          <Text>Total:</Text>
          <Text>{formatCurrency(invoice?.totalInCents)}</Text>
        </View>
      </View>

      {/* Notes */}
      {invoice?.invoiceNotes && (
        <View style={styles.notes}>
          <Text style={{ fontWeight: 'bold' }}>Notes</Text>
          <Text>{invoice?.invoiceNotes}</Text>
        </View>
      )}
    </Page>
  </Document>
);

export default InvoicePreviewTemplate;
