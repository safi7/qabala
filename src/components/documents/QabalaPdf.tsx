import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type { DocType, GardenProperty, HouseProperty, LandProperty, QabalaFormData, ShopProperty, VehicleProperty } from '@/lib/types';
import type { Translations } from '@/lib/translations';
import { formatAreaLine } from '@/lib/area';
import { formatDeedDate } from '@/lib/hijri';

let fontsReady = false;

function fontFile(name: string) {
  if (typeof window === 'undefined') return `${process.cwd()}/public/fonts/${name}`;
  return `/fonts/${name}`;
}

export function registerQabalaFonts() {
  if (fontsReady) return;
  fontsReady = true;
  Font.register({
    family: 'Amiri',
    fonts: [
      { src: fontFile('Amiri-Regular.ttf'), fontWeight: 400 },
      { src: fontFile('Amiri-Bold.ttf'), fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]);
}

const GOLD = '#8B6914';
const GOLD_SOFT = '#C8972A';
const INK = '#1A1000';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Amiri',
    fontSize: 8.5,
    backgroundColor: '#FFFCF0',
    color: INK,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 28,
  },
  frame: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    borderWidth: 1.6,
    borderColor: GOLD,
  },
  frameInner: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    borderWidth: 0.4,
    borderColor: GOLD_SOFT,
  },
  body: { flexGrow: 1 },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1.4,
    borderBottomColor: GOLD,
    paddingBottom: 4,
  },
  bismillah: { fontSize: 11, fontWeight: 700, color: '#5A4200', textAlign: 'center' },
  title: { fontSize: 15, fontWeight: 700, color: '#0A3D22', textAlign: 'center', marginTop: 1 },
  metaRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 2 },
  meta: { fontSize: 8, textAlign: 'center' },
  star: { fontSize: 8, color: GOLD, marginHorizontal: 8 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 2 },
  sectionLine: { flex: 1, height: 0.6, backgroundColor: GOLD },
  sectionLabel: { fontSize: 9, fontWeight: 700, color: '#5A4200', marginHorizontal: 6 },
  box: {
    borderWidth: 0.6,
    borderColor: GOLD_SOFT,
    paddingTop: 3,
    paddingBottom: 2,
    paddingHorizontal: 4,
  },
  grid: { flexDirection: 'row', flexWrap: 'nowrap' },
  partyTitle: {
    fontWeight: 700,
    fontSize: 9,
    color: '#5A4200',
    borderBottomWidth: 0.4,
    borderBottomColor: GOLD_SOFT,
    marginBottom: 2,
    paddingBottom: 1,
  },
  label: { fontWeight: 700, fontSize: 8, flexGrow: 0, flexShrink: 0 },
  colon: { fontWeight: 700, fontSize: 8, flexGrow: 0, flexShrink: 0, marginHorizontal: 1 },
  value: { fontSize: 8 },
  underline: {
    flex: 1,
    borderBottomWidth: 0.4,
    borderBottomColor: '#9CA3AF',
    marginHorizontal: 2,
    paddingBottom: 0,
  },
  note: { fontSize: 8, lineHeight: 1.35 },
  declaration: { fontSize: 7.5, color: '#444', lineHeight: 1.35, marginTop: 3 },
  footer: { marginTop: 'auto', borderTopWidth: 1.4, borderTopColor: GOLD, paddingTop: 3 },
  notice: { fontSize: 7, textAlign: 'center', color: '#555', marginBottom: 3 },
  signs: { flexDirection: 'row', justifyContent: 'space-between' },
  sig: { width: 110, alignItems: 'center' },
  sigBox: { width: 88, height: 32, borderWidth: 0.7, borderColor: GOLD, backgroundColor: '#FFFFFF' },
  sigLabel: { fontSize: 7, textAlign: 'center', marginTop: 1, color: '#555' },
  witnessSigns: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 },
});

function SectionTitle({ children }: { children: string }) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionLine} />
      <Text style={styles.sectionLabel}>{children}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function Cell({
  label,
  value,
  width = '33%',
  rtl,
}: {
  label: string;
  value?: string;
  width?: '25%' | '33%' | '50%' | '66%' | '100%';
  rtl: boolean;
}) {
  if (!value) return null;
  const shown = /[A-Za-z]/.test(value) ? `\u200E${value}\u200E` : value;
  return (
    <View style={{ width, flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'flex-end', marginBottom: 2, paddingRight: 4 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.colon}>{rtl ? '\u200F:\u200F' : ':'}</Text>
      <View style={[styles.underline, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
        <Text style={styles.value}>{shown}</Text>
      </View>
    </View>
  );
}

function SigBox({ label }: { label: string }) {
  return (
    <View style={styles.sig}>
      <View style={styles.sigBox} />
      <Text style={styles.sigLabel}>{label}</Text>
    </View>
  );
}

export interface QabalaPdfProps {
  data: QabalaFormData;
  docType: DocType;
  tr: Translations;
}

export function QabalaPdf({ data, docType, tr }: QabalaPdfProps) {
  registerQabalaFonts();
  const doc = tr.document;
  const f = tr.fields;
  const s = tr.sections;
  const rtl = tr.dir === 'rtl';
  const localeCode = tr.lang as string;
  const deedLang = localeCode === 'en' ? 'english' : localeCode === 'ps' ? 'pashto' : 'dari';
  const prop = data.property as LandProperty & Partial<HouseProperty & ShopProperty & VehicleProperty & GardenProperty>;
  const area = formatAreaLine(
    prop,
    {
      meters: tr.options.areaUnits[0],
      jerib: tr.options.areaUnits[1],
      biswa: tr.options.areaUnits[2],
      and: deedLang === 'english' ? 'and' : 'و',
    },
    deedLang !== 'english',
  );
  const sellers = data.sellers ?? [];
  const buyers = data.buyers ?? [];
  const witnesses = (data.witnesses ?? []).slice(0, 4);
  const row = rtl ? 'row-reverse' : 'row';
  const writing = { textAlign: rtl ? 'right' as const : 'left' as const };
  const singleParty = sellers.length === 1 && buyers.length === 1;

  return (
    <Document title={doc.titles[docType]} author="Qabala" subject={doc.sampleNotice} language={localeCode}>
      <Page size="A4" style={[styles.page, { direction: rtl ? 'rtl' : 'ltr', textAlign: rtl ? 'right' : 'left' }]}>
        <View style={styles.frame} fixed />
        <View style={styles.frameInner} fixed />

        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.bismillah}>{doc.bismillah}</Text>
            <Text style={styles.title}>{doc.titles[docType]}</Text>
            <View style={[styles.metaRow, { flexDirection: row }]}>
              <Text style={styles.meta}>{`${doc.docNumber}: ${data.documentNumber || '—'}`}</Text>
              <Text style={styles.star}>✦</Text>
              <Text style={styles.meta}>{`${doc.date}: ${formatDeedDate(data.date, deedLang)}`}</Text>
            </View>
          </View>

          <SectionTitle>{rtl ? `${s.seller} · ${s.buyer}` : `${s.seller} & ${s.buyer}`}</SectionTitle>
          <View style={styles.box}>
            {singleParty ? (
              <View style={[styles.grid, { flexDirection: row, flexWrap: 'nowrap' }]}>
                <View style={{ width: '50%', paddingHorizontal: 3, ...(rtl
                  ? { borderLeftWidth: 0.4, borderLeftColor: GOLD_SOFT }
                  : { borderRightWidth: 0.4, borderRightColor: GOLD_SOFT }) }}>
                  <Text style={[styles.partyTitle, writing]}>{s.seller}</Text>
                  <Cell label={f.fullName} value={sellers[0].fullName} width="100%" rtl={rtl} />
                  <Cell label={f.fatherName} value={sellers[0].fatherName} width="100%" rtl={rtl} />
                  <Cell label={f.grandfatherName} value={sellers[0].grandfatherName} width="100%" rtl={rtl} />
                  <Cell label={f.tazkiraNumber} value={sellers[0].tazkiraNumber} width="100%" rtl={rtl} />
                </View>
                <View style={{ width: '50%', paddingHorizontal: 3 }}>
                  <Text style={[styles.partyTitle, writing]}>{s.buyer}</Text>
                  <Cell label={f.fullName} value={buyers[0].fullName} width="100%" rtl={rtl} />
                  <Cell label={f.fatherName} value={buyers[0].fatherName} width="100%" rtl={rtl} />
                  <Cell label={f.grandfatherName} value={buyers[0].grandfatherName} width="100%" rtl={rtl} />
                  <Cell label={f.tazkiraNumber} value={buyers[0].tazkiraNumber} width="100%" rtl={rtl} />
                </View>
              </View>
            ) : (
              <View>
                <Text style={[styles.partyTitle, writing]}>{s.seller}</Text>
                {sellers.map((person, index) => (
                  <View key={`s${index}`} style={[styles.grid, { flexDirection: row }]}>
                    <Cell label={f.fullName} value={person.fullName} width="25%" rtl={rtl} />
                    <Cell label={f.fatherName} value={person.fatherName} width="25%" rtl={rtl} />
                    <Cell label={f.grandfatherName} value={person.grandfatherName} width="25%" rtl={rtl} />
                    <Cell label={f.tazkiraNumber} value={person.tazkiraNumber} width="25%" rtl={rtl} />
                  </View>
                ))}
                <Text style={[styles.partyTitle, writing, { marginTop: 3 }]}>{s.buyer}</Text>
                {buyers.map((person, index) => (
                  <View key={`b${index}`} style={[styles.grid, { flexDirection: row }]}>
                    <Cell label={f.fullName} value={person.fullName} width="25%" rtl={rtl} />
                    <Cell label={f.fatherName} value={person.fatherName} width="25%" rtl={rtl} />
                    <Cell label={f.grandfatherName} value={person.grandfatherName} width="25%" rtl={rtl} />
                    <Cell label={f.tazkiraNumber} value={person.tazkiraNumber} width="25%" rtl={rtl} />
                  </View>
                ))}
              </View>
            )}
          </View>

          <SectionTitle>{s.propertyDetails}</SectionTitle>
          <View style={styles.box}>
            {docType === 'vehicle' ? (
              <>
                <View style={[styles.grid, { flexDirection: row }]}>
                  <Cell label={f.vehicleType} value={prop.vehicleType} rtl={rtl} />
                  <Cell label={f.make} value={prop.make} rtl={rtl} />
                  <Cell label={f.model} value={prop.model} rtl={rtl} />
                </View>
                <View style={[styles.grid, { flexDirection: row }]}>
                  <Cell label={f.year} value={prop.year} rtl={rtl} />
                  <Cell label={f.color} value={prop.color} rtl={rtl} />
                  <Cell label={f.plateNumber} value={prop.plateNumber} rtl={rtl} />
                </View>
                <View style={[styles.grid, { flexDirection: row }]}>
                  <Cell label={f.chassisNumber} value={prop.chassisNumber} rtl={rtl} />
                  <Cell label={f.engineNumber} value={prop.engineNumber} rtl={rtl} />
                  <Cell label={f.trafficRegNumber} value={prop.trafficRegNumber} rtl={rtl} />
                </View>
              </>
            ) : (
              <>
                <View style={[styles.grid, { flexDirection: row }]}>
                  <Cell label={f.province} value={prop.province} rtl={rtl} />
                  <Cell label={f.district} value={prop.district} rtl={rtl} />
                  <Cell label={f.village} value={prop.village} rtl={rtl} />
                </View>
                {docType === 'shop' ? (
                  <View style={[styles.grid, { flexDirection: row }]}>
                    <Cell label={f.marketName} value={prop.marketName} width="66%" rtl={rtl} />
                    <Cell label={f.shopNumber} value={prop.shopNumber} rtl={rtl} />
                  </View>
                ) : (
                  <View style={[styles.grid, { flexDirection: row }]}>
                    <Cell label={f.blockNumber} value={prop.blockNumber} rtl={rtl} />
                    <Cell label={f.lotNumber} value={prop.lotNumber} rtl={rtl} />
                    <Cell label={f.landType} value={prop.landType} rtl={rtl} />
                  </View>
                )}
                <View style={[styles.grid, { flexDirection: row }]}>
                  {docType === 'shop' && <Cell label={f.floor} value={prop.floor} rtl={rtl} />}
                  <Cell label={f.area} value={area} width={docType === 'shop' ? '66%' : '100%'} rtl={rtl} />
                </View>
                {docType !== 'shop' && prop.previousDeedNumber ? (
                  <Cell label={f.previousDeedNumber} value={prop.previousDeedNumber} width="100%" rtl={rtl} />
                ) : null}
                {docType === 'house' && (
                  <View style={[styles.grid, { flexDirection: row }]}>
                    <Cell label={f.floors} value={prop.floors} rtl={rtl} />
                    <Cell label={f.rooms} value={prop.rooms} rtl={rtl} />
                    <Cell label={f.yearBuilt} value={prop.yearBuilt} rtl={rtl} />
                  </View>
                )}
                {docType === 'garden' && (
                  <View style={[styles.grid, { flexDirection: row }]}>
                    <Cell label={f.waterSource} value={prop.waterSource} rtl={rtl} />
                    <Cell label={f.waterShare} value={prop.waterShare} rtl={rtl} />
                    <Cell label={f.treeCount} value={prop.treeCount} rtl={rtl} />
                  </View>
                )}
              </>
            )}
          </View>

          {docType !== 'vehicle' && (
            <>
              <SectionTitle>{s.boundaries}</SectionTitle>
              <View style={styles.box}>
                <View style={[styles.grid, { flexDirection: row }]}>
                  <Cell label={f.boundaryNorth} value={prop.boundaryNorth} width="50%" rtl={rtl} />
                  <Cell label={f.boundarySouth} value={prop.boundarySouth} width="50%" rtl={rtl} />
                </View>
                <View style={[styles.grid, { flexDirection: row }]}>
                  <Cell label={f.boundaryEast} value={prop.boundaryEast} width="50%" rtl={rtl} />
                  <Cell label={f.boundaryWest} value={prop.boundaryWest} width="50%" rtl={rtl} />
                </View>
              </View>
            </>
          )}

          {data.notes ? (
            <>
              <SectionTitle>{rtl ? 'ملاحظات' : 'Notes'}</SectionTitle>
              <View style={styles.box}>
                <Text style={[styles.note, writing]}>{data.notes}</Text>
              </View>
            </>
          ) : null}

          <SectionTitle>{s.transaction}</SectionTitle>
          <View style={styles.box}>
            <Cell label={doc.transactionLabel} value={`${data.amount || '—'} ${data.currency || ''}`} width="100%" rtl={rtl} />
            <Cell label={doc.inWords} value={data.amountWords || '—'} width="100%" rtl={rtl} />
          </View>

          <Text style={[styles.declaration, writing]}>{data.declarationText || doc.sellerDeclaration}</Text>

          <SectionTitle>{doc.witnessLabel}</SectionTitle>
          <Text style={[styles.declaration, writing]}>{doc.witnessDeclaration}</Text>
          <View style={styles.box}>
            {[0, 2].map((start) => {
              const pair = witnesses.slice(start, start + 2);
              if (pair.length === 0) return null;
              return (
                <View key={start} style={[styles.grid, { flexDirection: row }]}>
                  {pair.map((witness, offset) => (
                    <View key={start + offset} style={{ width: '50%', paddingHorizontal: 3 }}>
                      <Text style={[styles.partyTitle, writing, { borderBottomWidth: 0 }]}>{`${doc.witnessLabel} ${start + offset + 1}`}</Text>
                      <Cell label={f.fullName} value={witness.fullName || '—'} width="100%" rtl={rtl} />
                      <Cell label={f.fatherName} value={witness.fatherName || '—'} width="100%" rtl={rtl} />
                    </View>
                  ))}
                </View>
              );
            })}
          </View>

          <View style={styles.footer}>
            <Text style={styles.notice}>{doc.sampleNotice}</Text>
            <View style={[styles.signs, { flexDirection: row }]}>
              <SigBox label={doc.sellerSig} />
              <SigBox label={doc.officialSeal} />
              <SigBox label={doc.buyerSig} />
            </View>
            <View style={[styles.witnessSigns, { flexDirection: row }]}>
              {witnesses.map((_, index) => (
                <SigBox key={index} label={`${doc.witnessLabel} ${index + 1} — ${doc.signature}`} />
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
