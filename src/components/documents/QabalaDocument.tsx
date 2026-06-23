'use client';

import type { DocType, QabalaFormData, LandProperty, HouseProperty, ShopProperty, VehicleProperty, GardenProperty } from '@/lib/types';
import type { Translations } from '@/lib/translations';

interface QabalaDocumentProps {
  data: QabalaFormData;
  docType: DocType;
  tr: Translations;
}

function Row({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex gap-1 ${className}`}>
      <span className="font-bold text-[10.5px] shrink-0">{label}:</span>
      <span className="text-[10.5px] border-b border-gray-400 flex-1 min-w-0 pb-px">{value || '—'}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 my-2">
      <div className="h-px flex-1 bg-[#8B6914]" />
      <span className="text-[11px] font-bold text-[#5A4200] px-1 bg-[#FFFCF0]"
        style={{ fontFamily: 'var(--font-amiri-var), Amiri, serif' }}>
        {children}
      </span>
      <div className="h-px flex-1 bg-[#8B6914]" />
    </div>
  );
}

function SigBox({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-24 h-14 border border-[#8B6914] rounded bg-white/50" />
      <span className="text-[9px] text-center text-gray-600">{label}</span>
    </div>
  );
}

export default function QabalaDocument({ data, docType, tr }: QabalaDocumentProps) {
  const doc = tr.document;
  const f = tr.fields;
  const s = tr.sections;
  const isRTL = tr.dir === 'rtl';

  const prop = data.property;
  const hasBoundaries = docType !== 'vehicle';
  const lp = prop as LandProperty;
  const hp = prop as HouseProperty;
  const sp = prop as ShopProperty;
  const vp = prop as VehicleProperty;
  const gp = prop as GardenProperty;

  const sellers = data.sellers ?? [];
  const buyers = data.buyers ?? [];
  const witnesses = data.witnesses ?? [];

  const isSingleParty = sellers.length === 1 && buyers.length === 1;

  return (
    <div
      id="qabala-document"
      className="qabala-document print-doc"
      dir={tr.dir}
      style={{
        width: '210mm',
        minHeight: '297mm',
        maxHeight: '297mm',
        padding: '8mm 10mm',
        fontSize: '12px',
        lineHeight: '1.7',
        fontFamily: 'var(--font-amiri-var), Amiri, Scheherazade New, serif',
        background: '#FFFCF0',
        color: '#1A1000',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Outer ornamental border */}
      <div style={{
        position: 'absolute',
        inset: '3mm',
        border: '2px solid #8B6914',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        inset: '4.5mm',
        border: '0.5px solid #C8972A',
        pointerEvents: 'none',
      }} />

      {/* Corner ornaments */}
      {['top-[3.5mm] left-[3.5mm]','top-[3.5mm] right-[3.5mm]','bottom-[3.5mm] left-[3.5mm]','bottom-[3.5mm] right-[3.5mm]'].map((pos) => (
        <div key={pos} className={`absolute ${pos} text-[#8B6914] text-xl leading-none`}
          style={{ fontFamily: 'serif' }}>✦</div>
      ))}

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full gap-1.5">

        {/* ── HEADER ── */}
        <div className="text-center pb-1.5 border-b-2 border-[#8B6914]">
          <p className="text-[13px] font-bold text-[#5A4200] tracking-wide">
            {doc.bismillah}
          </p>
          <p className="text-[17px] font-bold text-[#0A3D22] mt-0.5">
            {doc.titles[docType]}
          </p>
          <div className="flex justify-center gap-6 mt-1 text-[10px]">
            <span><strong>{doc.docNumber}:</strong> {data.documentNumber}</span>
            <span className="text-[#8B6914]">✦</span>
            <span><strong>{doc.date}:</strong> {data.date}</span>
          </div>
        </div>

        {/* ── SELLER / BUYER ── */}
        <SectionTitle>{isRTL ? `${s.seller} · ${s.buyer}` : `${s.seller} & ${s.buyer}`}</SectionTitle>

        {isSingleParty ? (
          /* Single seller + single buyer: side-by-side 2-column */
          <div className="grid grid-cols-2 gap-3 border border-[#C8972A]/40 rounded p-2 bg-amber-50/30">
            <div className={`space-y-1 ${isRTL ? 'border-l border-[#C8972A]/30 pl-2' : 'border-r border-[#C8972A]/30 pr-2'}`}>
              <p className="font-bold text-[11px] text-[#5A4200] mb-1 border-b border-[#C8972A]/30 pb-0.5">{s.seller}</p>
              <Row label={f.fullName} value={sellers[0].fullName} />
              <Row label={f.fatherName} value={sellers[0].fatherName} />
              <Row label={f.grandfatherName} value={sellers[0].grandfatherName} />
              <Row label={f.tazkiraNumber} value={sellers[0].tazkiraNumber} />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-[11px] text-[#5A4200] mb-1 border-b border-[#C8972A]/30 pb-0.5">{s.buyer}</p>
              <Row label={f.fullName} value={buyers[0].fullName} />
              <Row label={f.fatherName} value={buyers[0].fatherName} />
              <Row label={f.grandfatherName} value={buyers[0].grandfatherName} />
              <Row label={f.tazkiraNumber} value={buyers[0].tazkiraNumber} />
            </div>
          </div>
        ) : (
          /* Multiple sellers/buyers: list each compactly */
          <div className="border border-[#C8972A]/40 rounded p-2 bg-amber-50/30 space-y-1.5">
            {sellers.length > 0 && (
              <div>
                <p className="font-bold text-[11px] text-[#5A4200] mb-1 border-b border-[#C8972A]/30 pb-0.5">{s.seller}</p>
                {sellers.map((person, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-x-3 gap-y-0.5 mb-1">
                    <Row label={f.fullName} value={person.fullName} />
                    <Row label={f.fatherName} value={person.fatherName} />
                    <Row label={f.grandfatherName} value={person.grandfatherName} />
                    <Row label={f.tazkiraNumber} value={person.tazkiraNumber} />
                  </div>
                ))}
              </div>
            )}
            {buyers.length > 0 && (
              <div>
                <p className="font-bold text-[11px] text-[#5A4200] mb-1 border-b border-[#C8972A]/30 pb-0.5">{s.buyer}</p>
                {buyers.map((person, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-x-3 gap-y-0.5 mb-1">
                    <Row label={f.fullName} value={person.fullName} />
                    <Row label={f.fatherName} value={person.fatherName} />
                    <Row label={f.grandfatherName} value={person.grandfatherName} />
                    <Row label={f.tazkiraNumber} value={person.tazkiraNumber} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROPERTY ── */}
        <SectionTitle>{s.propertyDetails}</SectionTitle>

        {docType === 'vehicle' ? (
          <div className="grid grid-cols-3 gap-x-4 gap-y-1 border border-[#C8972A]/40 rounded p-2 bg-amber-50/30">
            <Row label={f.vehicleType} value={vp.vehicleType} />
            <Row label={f.make} value={vp.make} />
            <Row label={f.model} value={vp.model} />
            <Row label={f.year} value={vp.year} />
            <Row label={f.color} value={vp.color} />
            <Row label={f.plateNumber} value={vp.plateNumber} />
            <Row label={f.chassisNumber} value={vp.chassisNumber} />
            <Row label={f.engineNumber} value={vp.engineNumber} />
            <Row label={f.trafficRegNumber} value={vp.trafficRegNumber} />
          </div>
        ) : docType === 'shop' ? (
          <div className="space-y-1 border border-[#C8972A]/40 rounded p-2 bg-amber-50/30">
            <div className="grid grid-cols-3 gap-x-4 gap-y-1">
              <Row label={f.province} value={sp.province} />
              <Row label={f.district} value={sp.district} />
              <Row label={f.village} value={sp.village} />
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-1">
              <Row label={f.marketName} value={sp.marketName} className="col-span-2" />
              <Row label={f.shopNumber} value={sp.shopNumber} />
              <Row label={f.floor} value={sp.floor} />
              <Row label={f.area} value={`${sp.area} ${sp.areaUnit}`} />
            </div>
          </div>
        ) : (
          <div className="space-y-1 border border-[#C8972A]/40 rounded p-2 bg-amber-50/30">
            <div className="grid grid-cols-3 gap-x-4 gap-y-1">
              <Row label={f.province} value={lp.province} />
              <Row label={f.district} value={lp.district} />
              <Row label={f.village} value={lp.village} />
              {lp.blockNumber && <Row label={f.blockNumber} value={lp.blockNumber} />}
              {lp.lotNumber && <Row label={f.lotNumber} value={lp.lotNumber} />}
              <Row label={f.area} value={`${lp.area} ${lp.areaUnit}`} />
              <Row label={f.landType} value={lp.landType} />
              {lp.previousDeedNumber && <Row label={f.previousDeedNumber} value={lp.previousDeedNumber} />}
            </div>
            {docType === 'house' && (
              <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-1">
                <Row label={f.floors} value={hp.floors} />
                <Row label={f.rooms} value={hp.rooms} />
                <Row label={f.yearBuilt} value={hp.yearBuilt} />
              </div>
            )}
            {docType === 'garden' && (
              <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-1">
                <Row label={f.waterSource} value={gp.waterSource} />
                <Row label={f.waterShare} value={gp.waterShare} />
                <Row label={f.treeCount} value={gp.treeCount} />
              </div>
            )}
          </div>
        )}

        {/* ── BOUNDARIES ── */}
        {hasBoundaries && (
          <>
            <SectionTitle>{s.boundaries}</SectionTitle>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 border border-[#C8972A]/40 rounded p-2 bg-amber-50/30">
              {docType === 'shop' ? (
                <>
                  <Row label={f.boundaryNorth} value={sp.boundaryNorth} />
                  <Row label={f.boundarySouth} value={sp.boundarySouth} />
                  <Row label={f.boundaryEast} value={sp.boundaryEast} />
                  <Row label={f.boundaryWest} value={sp.boundaryWest} />
                </>
              ) : (
                <>
                  <Row label={f.boundaryNorth} value={lp.boundaryNorth} />
                  <Row label={f.boundarySouth} value={lp.boundarySouth} />
                  <Row label={f.boundaryEast} value={lp.boundaryEast} />
                  <Row label={f.boundaryWest} value={lp.boundaryWest} />
                </>
              )}
            </div>
          </>
        )}

        {/* ── NOTES ── */}
        {data.notes && (
          <>
            <SectionTitle>{tr.dir === 'rtl' ? 'ملاحظات' : 'Notes'}</SectionTitle>
            <div className="border border-[#C8972A]/40 rounded p-2 bg-amber-50/30">
              <p className="text-[10.5px]">{data.notes}</p>
            </div>
          </>
        )}

        {/* ── TRANSACTION ── */}
        <SectionTitle>{s.transaction}</SectionTitle>
        <div className="border border-[#C8972A]/40 rounded p-2 bg-amber-50/30 space-y-1">
          <Row label={doc.transactionLabel} value={`${data.amount} ${data.currency}`} />
          <Row label={doc.inWords} value={data.amountWords} />
        </div>

        {/* ── DECLARATION ── */}
        <p className="text-[9.5px] text-gray-700 leading-relaxed px-1 text-justify italic border-t border-[#C8972A]/20 pt-1">
          {data.declarationText || doc.sellerDeclaration}
        </p>

        {/* ── WITNESSES ── */}
        <SectionTitle>{doc.witnessLabel}</SectionTitle>
        <p className="text-[9.5px] text-gray-600 italic mb-1">{doc.witnessDeclaration}</p>
        <div className="grid grid-cols-2 gap-3 border border-[#C8972A]/40 rounded p-2 bg-amber-50/30">
          {witnesses.slice(0, 4).map((witness, idx) => (
            <div key={idx} className={`space-y-1 ${idx % 2 === 0 && idx + 1 < witnesses.slice(0, 4).length ? (isRTL ? 'border-l border-[#C8972A]/30 pl-2' : 'border-r border-[#C8972A]/30 pr-2') : ''}`}>
              <p className="font-bold text-[10px] text-[#5A4200] mb-1">{doc.witnessLabel} {idx + 1}</p>
              <Row label={f.fullName} value={witness.fullName} />
              <Row label={f.fatherName} value={witness.fatherName} />
            </div>
          ))}
        </div>

        {/* ── SIGNATURE BOXES ── */}
        <div className="mt-auto pt-2 border-t-2 border-[#8B6914]">
          <div className="flex justify-between items-end">
            <SigBox label={doc.sellerSig} />
            <div className="text-center">
              <div className="w-24 h-14 border border-[#8B6914] rounded bg-white/50 mx-auto" />
              <span className="text-[9px] text-gray-600">{doc.officialSeal}</span>
            </div>
            <SigBox label={doc.buyerSig} />
          </div>
          <div className="flex justify-around mt-2">
            {witnesses.slice(0, 4).map((_, idx) => (
              <SigBox key={idx} label={`${doc.witnessLabel} ${idx + 1} — ${doc.signature}`} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
