'use client';
import { useState } from 'react';
import { ShoppingBag, Plus, Minus, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { ADDON_PRICES, ICING_SURCHARGE } from '@/types';
import type { Product, OneLayerCustomField, BiggerCakeCustomField } from '@/types';

/* ─── Static options ────────────────────────────────────────────── */
const OCCASIONS         = ['Birthday','Wedding','Anniversary','Baby Shower','Graduation','Naming Ceremony','Corporate','Other'];
const GENDERS           = ['Female','Male','Unisex / Not Specified'];
const ONE_LAYER_FLAVOURS= ['Vanilla','Chocolate','Red Velvet'];
const BIGGER_FLAV_REG   = ['Vanilla','Chocolate','Red Velvet'];
const BIGGER_FLAV_DLX   = ['Carrot','Coconut','Ginger Full Cream','Cookies & Cream'];
const BIGGER_LAYERS     = ['2 Layers','3 Layers','4 Layers','5 Layers','6 Layers'];
const TOPPERS           = ['Number','Name','Bride & Groom','Baby','Floral Picks','Stars & Moon','None'];
// Fallback colours if none defined by admin
const FALLBACK_COLORS   = ['White','Blush Pink','Lilac / Purple','Gold & White','Chocolate Brown','Sky Blue','Black & Gold','Ivory','Sage Green'];

const fmt = (n: number) => `₦${n.toLocaleString()}`;

/* ─── Sub-components ────────────────────────────────────────────── */
function Label({ text }: { text: string }) {
  return <p className="text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-[#A58CF4] mb-2">{text}</p>;
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-[0.78rem] border transition-all duration-200 active:scale-[0.97]
        ${on ? 'bg-[#433075] text-white border-[#433075]'
             : 'bg-white text-[#6E6A8C] border-[rgba(165,140,244,0.3)] hover:border-[#A58CF4] hover:text-[#A58CF4]'}`}>
      {label}
    </button>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <Label text={label}/>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-[rgba(165,140,244,0.25)]
            text-[0.88rem] text-[#433075] bg-white focus:border-[#A58CF4] focus:outline-none">
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A8C] pointer-events-none"/>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type='text' }: { label: string; value: string; onChange: (v:string)=>void; placeholder?: string; type?: string }) {
  return (
    <div>
      <Label text={label}/>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[rgba(165,140,244,0.25)]
          text-[0.88rem] text-[#433075] bg-white focus:border-[#A58CF4] focus:outline-none
          placeholder:text-[#6E6A8C]/40"/>
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v:string)=>void; placeholder?: string }) {
  return (
    <div>
      <Label text={label}/>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[rgba(165,140,244,0.25)]
          text-[0.88rem] text-[#433075] bg-white focus:border-[#A58CF4] focus:outline-none
          placeholder:text-[#6E6A8C]/40 resize-none"/>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[rgba(165,140,244,0.15)] rounded-2xl p-5 space-y-4 bg-white">
      <p className="font-cormorant text-[1.1rem] font-semibold text-[#433075] border-b border-[rgba(165,140,244,0.1)] pb-2">{title}</p>
      {children}
    </div>
  );
}

function ReferencePhotoTip() {
  return (
    <div className="flex items-start gap-3 bg-[rgba(37,211,102,0.08)] border border-[rgba(37,211,102,0.25)] rounded-xl px-4 py-3">
      <span className="text-base shrink-0">📎</span>
      <p className="text-[0.74rem] text-[#1f7a44] leading-relaxed">
        Got a reference photo or inspiration picture? No need to upload it here — just attach it directly in the chat after you tap <strong>Order via WhatsApp</strong> below.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONE-LAYER CAKE FORM
═══════════════════════════════════════════════════════════════ */
function OneLayerForm({ product, onClose }: { product: Product; onClose?: () => void }) {
  const { add } = useCart();

  const opts = product.customizationOptions as OneLayerCustomField[] | undefined;
  const has = (f: OneLayerCustomField) => !opts || opts.includes(f);

  // Use admin-defined colours, fall back to defaults
  const colors = product.cakeColors?.length ? product.cakeColors : FALLBACK_COLORS;

  // Sizes: if admin defined sizes, first size is the default
  const sizes = product.cakeSizes ?? [];
  const hasSizes = sizes.length > 0;

  const [selectedSize, setSelectedSize] = useState(hasSizes ? sizes[0].label : '');
  const [flavour,      setFlavour]      = useState('Vanilla');
  const [icing,        setIcing]        = useState<'buttercream'|'whipped-cream'>('buttercream');
  const [colour,       setColour]       = useState(colors[0] ?? 'White');
  const [customColour, setCustomColour] = useState('');
  const [message,      setMessage]      = useState('');
  const [occasion,     setOccasion]     = useState('Birthday');
  const [gender,       setGender]       = useState('Female');
  const [delivDate,    setDelivDate]    = useState('');
  const [delivAddr,    setDelivAddr]    = useState('');
  const [notes,        setNotes]        = useState('');
  const [card,         setCard]         = useState(false);
  const [cardMsg,      setCardMsg]      = useState('');
  const [chamdor,      setChamdor]      = useState(false);
  const [candles,      setCandles]      = useState(0);

  // Price: if size selected, use that size's price; else use product.basePrice
  const sizeObj = sizes.find(s => s.label === selectedSize);
  const base     = sizeObj?.price ?? product.basePrice ?? 8500;
  const icingSurcharge = has('icing') && icing === 'whipped-cream' ? ICING_SURCHARGE['whipped-cream'] : 0;
  const addonTotal =
    (has('addon_card')    && card    ? ADDON_PRICES.card    : 0) +
    (has('addon_chamdor') && chamdor ? ADDON_PRICES.chamdor : 0) +
    (has('addon_candles') ? candles * ADDON_PRICES.candlePerUnit : 0);
  const total = base + icingSurcharge + addonTotal;

  function buildWA() {
    const addOns = [
      has('addon_card')    && card    ? `Card (+₦3,000)${cardMsg?` — "${cardMsg}"`:''}`          : '',
      has('addon_chamdor') && chamdor ? 'Chamdor Wine (+₦6,000)'                                  : '',
      has('addon_candles') && candles > 0 ? `${candles} Candle${candles>1?'s':''} (+₦${candles*500})` : '',
    ].filter(Boolean).join(', ') || 'None';

    const msg =
      `🌸 *Bloomies Order — ${product.name}*\n\n` +
      (hasSizes             ? `📏 Size: ${selectedSize}\n`                                     : '') +
      (has('flavour')       ? `🍰 Flavour: ${flavour}\n`                                       : '') +
      (has('icing')         ? `🍦 Icing: ${icing==='whipped-cream'?'Whipped Cream (+₦2,000)':'Buttercream'}\n` : '') +
      (has('colour')        ? `🎨 Colour: ${colour}${customColour?` (${customColour})`:''}\n`  : '') +
      (has('message')       ? `✍️ Message: ${message||'None'}\n`                               : '') +
      (has('occasion')      ? `🎉 Occasion: ${occasion}\n`                                     : '') +
      (has('gender')        ? `👤 Receiver: ${gender}\n`                                       : '') +
      (has('delivery')      ? `📅 Delivery date: ${delivDate||'TBD'}\n📍 Address: ${delivAddr||'TBD'}\n` : '') +
      `✨ Add-ons: ${addOns}\n` +
      (has('notes') && notes? `💬 Notes: ${notes}\n`                                           : '') +
      `📎 Reference photo (if any): attaching it in this chat\n` +
      `\n💰 *Estimated Total: ${fmt(total)}*\n\nPlease confirm availability and final price. Thank you!`;

    window.open(`https://wa.me/2348181154270?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function addToCart() {
    const summary = [
      hasSizes && selectedSize ? selectedSize : '',
      has('flavour') ? flavour : '',
      has('colour')  ? colour  : '',
      addonTotal > 0 ? '+ add-ons' : '',
    ].filter(Boolean).join(' · ');
    add({ id:`${product.id}-${Date.now()}`, name:product.name, price:fmt(total), image:product.image, customisation:summary });
    onClose?.();
  }

  let s = 1;

  return (
    <div className="space-y-4">

      {/* Size selector — if admin defined sizes */}
      {hasSizes && (
        <Section title={`${s++}. Choose Your Size`}>
          <p className="text-[0.75rem] text-[#6E6A8C] -mt-1 mb-2">Price updates automatically based on the size you select.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {sizes.map(sz => (
              <button key={sz.label} type="button"
                onClick={() => setSelectedSize(sz.label)}
                className={`flex flex-col items-center p-3.5 rounded-xl border-2 transition-all duration-200 active:scale-[0.97]
                  ${selectedSize === sz.label
                    ? 'border-[#433075] bg-[#F3F0FA]'
                    : 'border-[rgba(165,140,244,0.2)] bg-white hover:border-[#A58CF4]/50'}`}>
                <span className={`text-[0.88rem] font-semibold ${selectedSize===sz.label?'text-[#433075]':'text-[#6E6A8C]'}`}>
                  {sz.label}
                </span>
                <span className={`text-[0.75rem] mt-0.5 font-medium ${selectedSize===sz.label?'text-[#A58CF4]':'text-[#6E6A8C]/60'}`}>
                  {fmt(sz.price)}
                </span>
              </button>
            ))}
          </div>
        </Section>
      )}

      {has('flavour') && (
        <Section title={`${s++}. Choose Your Flavour`}>
          <div className="flex flex-wrap gap-2">
            {ONE_LAYER_FLAVOURS.map(f => <Chip key={f} label={f} on={flavour===f} onClick={()=>setFlavour(f)}/>)}
          </div>
        </Section>
      )}

      {has('icing') && (
        <Section title={`${s++}. Type of Icing`}>
          <div className="grid grid-cols-2 gap-3">
            {(['buttercream','whipped-cream'] as const).map(t => (
              <button key={t} type="button" onClick={() => setIcing(t)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${icing===t ? 'border-[#A58CF4] bg-[#F3F0FA]' : 'border-[rgba(165,140,244,0.2)] bg-white hover:border-[#A58CF4]/50'}`}>
                <p className="text-[0.88rem] font-semibold text-[#433075]">{t==='buttercream'?'Buttercream':'Whipped Cream'}</p>
                <p className="text-[0.72rem] text-[#6E6A8C] mt-0.5">{t==='whipped-cream'?'+₦2,000':'Standard'}</p>
              </button>
            ))}
          </div>
        </Section>
      )}

      {has('colour') && (
        <Section title={`${s++}. Cake Colour & Theme`}>
          <div className="flex flex-wrap gap-2 mb-3">
            {colors.map(c => <Chip key={c} label={c} on={colour===c} onClick={()=>setColour(c)}/>)}
          </div>
          <Input label="Custom colour / theme (optional)" value={customColour} onChange={setCustomColour}
            placeholder="Describe your specific colour or theme…"/>
        </Section>
      )}

      {has('message') && (
        <Section title={`${s++}. Cake Message`}>
          <Input label="What should we write on your cake?" value={message} onChange={setMessage}
            placeholder="e.g. Happy Birthday Amara! 🎂"/>
        </Section>
      )}

      {(has('occasion')||has('gender')) && (
        <Section title={`${s++}. Occasion & Recipient`}>
          <div className="grid grid-cols-2 gap-4">
            {has('occasion') && <SelectField label="Occasion" value={occasion} onChange={setOccasion} options={OCCASIONS}/>}
            {has('gender')   && <SelectField label="Gender of receiver" value={gender} onChange={setGender} options={GENDERS}/>}
          </div>
        </Section>
      )}

      {has('delivery') && (
        <Section title={`${s++}. Delivery Details`}>
          <Input label="Preferred delivery date" value={delivDate} onChange={setDelivDate} type="date"/>
          <Textarea label="Delivery address" value={delivAddr} onChange={setDelivAddr}
            placeholder="Full delivery address including area / landmark…"/>
        </Section>
      )}

      {(has('addon_card')||has('addon_chamdor')||has('addon_candles')) && (
        <Section title={`${s++}. ✨ Add-Ons`}>
          <div className="space-y-3">
            {has('addon_card') && (<>
              <label className="flex items-center justify-between cursor-pointer bg-[#F3F0FA] rounded-xl px-4 py-3 hover:bg-[#EDE8F8] transition-colors">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={card} onChange={e=>setCard(e.target.checked)} className="w-4 h-4 accent-[#A58CF4]"/>
                  <div>
                    <p className="text-[0.88rem] font-medium text-[#433075]">Greeting Card</p>
                    <p className="text-[0.72rem] text-[#6E6A8C]">A personalised card for your recipient</p>
                  </div>
                </div>
                <span className="text-[0.82rem] font-semibold text-[#A58CF4]">+₦3,000</span>
              </label>
              {card && <Textarea label="Card message" value={cardMsg} onChange={setCardMsg} placeholder="Write the message you'd like on the card…"/>}
            </>)}

            {has('addon_chamdor') && (
              <label className="flex items-center justify-between cursor-pointer bg-[#F3F0FA] rounded-xl px-4 py-3 hover:bg-[#EDE8F8] transition-colors">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={chamdor} onChange={e=>setChamdor(e.target.checked)} className="w-4 h-4 accent-[#A58CF4]"/>
                  <div>
                    <p className="text-[0.88rem] font-medium text-[#433075]">Chamdor Wine 🍾</p>
                    <p className="text-[0.72rem] text-[#6E6A8C]">Celebrate in style</p>
                  </div>
                </div>
                <span className="text-[0.82rem] font-semibold text-[#A58CF4]">+₦6,000</span>
              </label>
            )}

            {has('addon_candles') && (
              <div className="bg-[#F3F0FA] rounded-xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.88rem] font-medium text-[#433075]">Candles 🕯️</p>
                    <p className="text-[0.72rem] text-[#6E6A8C]">₦500 per candle</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={()=>setCandles(Math.max(0,candles-1))}
                      className="w-8 h-8 rounded-full bg-white border border-[rgba(165,140,244,0.3)] flex items-center justify-center hover:bg-[#E1D7F0] transition-colors">
                      <Minus size={13}/>
                    </button>
                    <span className="text-[0.9rem] font-semibold text-[#433075] w-5 text-center">{candles}</span>
                    <button type="button" onClick={()=>setCandles(candles+1)}
                      className="w-8 h-8 rounded-full bg-white border border-[rgba(165,140,244,0.3)] flex items-center justify-center hover:bg-[#E1D7F0] transition-colors">
                      <Plus size={13}/>
                    </button>
                    {candles>0 && <span className="text-[0.82rem] font-semibold text-[#A58CF4]">+{fmt(candles*500)}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {has('notes') && (
        <Section title={`${s++}. 💬 Additional Notes`}>
          <Textarea label="Any other requests?" value={notes} onChange={setNotes}
            placeholder="Allergies, special instructions…"/>
        </Section>
      )}

      {/* Price summary */}
      <PriceSummary
        product={product}
        selectedSize={hasSizes ? selectedSize : undefined}
        base={base}
        icingSurcharge={icingSurcharge}
        card={has('addon_card') && card}
        chamdor={has('addon_chamdor') && chamdor}
        candles={has('addon_candles') ? candles : 0}
        total={total}
      />

      <ReferencePhotoTip/>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button onClick={addToCart}
          className="flex items-center justify-center gap-2 bg-white border-2 border-[#433075]
            text-[#433075] py-3.5 rounded-full font-semibold text-[0.85rem]
            hover:bg-[#433075] hover:text-white transition-all duration-250 active:scale-[0.97]">
          <ShoppingBag size={16}/> Add to Cart
        </button>
        <button onClick={buildWA}
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white
            py-3.5 rounded-full font-semibold text-[0.85rem]
            hover:bg-[#1BBE5C] transition-all duration-250 active:scale-[0.97]">
          <WAIcon/> Order via WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BIGGER CAKE FORM
═══════════════════════════════════════════════════════════════ */
function BiggerCakeForm({ product, onClose }: { product: Product; onClose?: () => void }) {
  const { add } = useCart();

  const opts = product.customizationOptions as BiggerCakeCustomField[] | undefined;
  const has = (f: BiggerCakeCustomField) => !opts || opts.includes(f);

  const colors  = product.cakeColors?.length ? product.cakeColors : FALLBACK_COLORS;
  const sizes   = product.cakeSizes ?? [];
  const hasSizes= sizes.length > 0;

  const [selectedSize, setSelectedSize]   = useState(hasSizes ? sizes[0].label : '');
  const [layers,       setLayers]         = useState('2 Layers');
  const [flavours,     setFlavours]       = useState<string[]>([]);
  const [colour,       setColour]         = useState(colors[0] ?? 'White');
  const [customColour, setCustomColour]   = useState('');
  const [topper,       setTopper]         = useState('None');
  const [gender,       setGender]         = useState('Female');
  const [occasion,     setOccasion]       = useState('Birthday');
  const [delivDate,    setDelivDate]      = useState('');
  const [delivAddr,    setDelivAddr]      = useState('');
  const [notes,        setNotes]          = useState('');
  const [card,         setCard]           = useState(false);
  const [cardMsg,      setCardMsg]        = useState('');
  const [chamdor,      setChamdor]        = useState(false);
  const [candles,      setCandles]        = useState(0);

  function toggleFlavour(f: string) {
    setFlavours(prev => prev.includes(f) ? prev.filter(x=>x!==f) : [...prev, f]);
  }

  const sizeObj = sizes.find(s => s.label === selectedSize);
  const base     = sizeObj?.price ?? product.basePrice ?? 22000;
  const addonTotal =
    (has('addon_card')    && card    ? ADDON_PRICES.card    : 0) +
    (has('addon_chamdor') && chamdor ? ADDON_PRICES.chamdor : 0) +
    (has('addon_candles') ? candles * ADDON_PRICES.candlePerUnit : 0);
  const total = base + addonTotal;

  function buildWA() {
    const addOns = [
      has('addon_card')    && card    ? `Card (+₦3,000)${cardMsg?` — "${cardMsg}"`:''}`               : '',
      has('addon_chamdor') && chamdor ? 'Chamdor Wine (+₦6,000)'                                      : '',
      has('addon_candles') && candles>0 ? `${candles} Candle${candles>1?'s':''} (+₦${candles*500})`  : '',
    ].filter(Boolean).join(', ') || 'None';

    const msg =
      `🌸 *Bloomies Order — ${product.name}*\n\n` +
      (product.designStyle ? `🎨 Design: ${product.designStyle}\n` : '') +
      (hasSizes             ? `📏 Size: ${selectedSize}\n`         : '') +
      (has('size_layers')   ? `🔢 Layers: ${layers}\n`            : '') +
      ((has('flavour_regular')||has('flavour_deluxe')) ? `🍰 Flavours: ${flavours.join(', ')||'Not specified'}\n` : '') +
      (has('colour')        ? `🎨 Colour: ${colour}${customColour?` (${customColour})`:''}\n` : '') +
      (has('topper')        ? `🎀 Topper: ${topper}\n`            : '') +
      (has('occasion')      ? `🎉 Occasion: ${occasion}\n`        : '') +
      (has('gender')        ? `👤 Receiver: ${gender}\n`          : '') +
      (has('delivery')      ? `📅 Delivery date: ${delivDate||'TBD'}\n📍 Address: ${delivAddr||'TBD'}\n` : '') +
      `✨ Add-ons: ${addOns}\n` +
      (has('notes') && notes? `💬 Notes: ${notes}\n`              : '') +
      `📎 Reference photo (if any): attaching it in this chat\n` +
      `\n💰 *Estimated Total: ${fmt(total)}*\n\nPlease confirm availability and final price. Thank you!`;

    window.open(`https://wa.me/2348181154270?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function addToCart() {
    const summary = [
      hasSizes && selectedSize ? selectedSize : '',
      has('size_layers') ? layers : '',
      (has('flavour_regular')||has('flavour_deluxe')) && flavours.length ? flavours.join(', ') : '',
      product.designStyle ? product.designStyle : '',
    ].filter(Boolean).join(' · ');
    add({ id:`${product.id}-${Date.now()}`, name:product.name, price:fmt(total), image:product.image, customisation:summary });
    onClose?.();
  }

  let s = 1;

  return (
    <div className="space-y-4">
      {/* Design style info */}
      {product.designStyle && (
        <div className="bg-[#F3F0FA] border border-[rgba(165,140,244,0.25)] rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-xl">🎨</span>
          <div>
            <p className="text-[0.78rem] font-semibold text-[#433075]">Design Style: {product.designStyle}</p>
            <p className="text-[0.7rem] text-[#6E6A8C]">You can add your colour preference below.</p>
          </div>
        </div>
      )}

      {/* Size selector */}
      {hasSizes && (
        <Section title={`${s++}. Choose Your Size`}>
          <p className="text-[0.75rem] text-[#6E6A8C] -mt-1 mb-2">Price updates automatically based on the size you select.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {sizes.map(sz => (
              <button key={sz.label} type="button"
                onClick={() => setSelectedSize(sz.label)}
                className={`flex flex-col items-center p-3.5 rounded-xl border-2 transition-all duration-200 active:scale-[0.97]
                  ${selectedSize===sz.label
                    ? 'border-[#433075] bg-[#F3F0FA]'
                    : 'border-[rgba(165,140,244,0.2)] bg-white hover:border-[#A58CF4]/50'}`}>
                <span className={`text-[0.88rem] font-semibold ${selectedSize===sz.label?'text-[#433075]':'text-[#6E6A8C]'}`}>
                  {sz.label}
                </span>
                <span className={`text-[0.75rem] mt-0.5 font-medium ${selectedSize===sz.label?'text-[#A58CF4]':'text-[#6E6A8C]/60'}`}>
                  {fmt(sz.price)}
                </span>
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* Layers (if no sizes defined, show the old inches+layers approach) */}
      {has('size_layers') && !hasSizes && (
        <Section title={`${s++}. Size & Layers`}>
          <SelectField label="Number of Layers" value={layers} onChange={setLayers} options={BIGGER_LAYERS}/>
        </Section>
      )}
      {has('size_layers') && hasSizes && (
        <Section title={`${s++}. Number of Layers`}>
          <div className="flex flex-wrap gap-2">
            {BIGGER_LAYERS.map(l => <Chip key={l} label={l} on={layers===l} onClick={()=>setLayers(l)}/>)}
          </div>
        </Section>
      )}

      {(has('flavour_regular')||has('flavour_deluxe')) && (
        <Section title={`${s++}. Choose Flavours`}>
          {has('flavour_regular') && (<>
            <Label text="Regular Flavours"/>
            <div className="flex flex-wrap gap-2 mb-3">
              {BIGGER_FLAV_REG.map(f => <Chip key={f} label={f} on={flavours.includes(f)} onClick={()=>toggleFlavour(f)}/>)}
            </div>
          </>)}
          {has('flavour_deluxe') && (<>
            <Label text="Deluxe Flavours ✨"/>
            <div className="flex flex-wrap gap-2">
              {BIGGER_FLAV_DLX.map(f => <Chip key={f} label={f} on={flavours.includes(f)} onClick={()=>toggleFlavour(f)}/>)}
            </div>
            <p className="text-[0.7rem] text-[#6E6A8C]/70 italic">✨ Deluxe flavours may attract additional charges</p>
          </>)}
        </Section>
      )}

      {has('colour') && (
        <Section title={`${s++}. Cake Colour`}>
          <div className="flex flex-wrap gap-2 mb-3">
            {colors.map(c => <Chip key={c} label={c} on={colour===c} onClick={()=>setColour(c)}/>)}
          </div>
          <Input label="Custom colour / theme (optional)" value={customColour} onChange={setCustomColour}
            placeholder="Specific shade or theme…"/>
        </Section>
      )}

      {has('topper') && (
        <Section title={`${s++}. Cake Topper`}>
          <div className="flex flex-wrap gap-2">
            {TOPPERS.map(t => <Chip key={t} label={t} on={topper===t} onClick={()=>setTopper(t)}/>)}
          </div>
        </Section>
      )}

      {(has('occasion')||has('gender')) && (
        <Section title={`${s++}. Occasion & Recipient`}>
          <div className="grid grid-cols-2 gap-4">
            {has('occasion') && <SelectField label="Occasion"           value={occasion} onChange={setOccasion} options={OCCASIONS}/>}
            {has('gender')   && <SelectField label="Gender of receiver" value={gender}   onChange={setGender}   options={GENDERS}/>}
          </div>
        </Section>
      )}

      {has('delivery') && (
        <Section title={`${s++}. Delivery Details`}>
          <Input label="Preferred delivery date" value={delivDate} onChange={setDelivDate} type="date"/>
          <Textarea label="Delivery address" value={delivAddr} onChange={setDelivAddr}
            placeholder="Full delivery address including area / landmark…"/>
        </Section>
      )}

      {(has('addon_card')||has('addon_chamdor')||has('addon_candles')) && (
        <Section title={`${s++}. ✨ Add-Ons`}>
          <div className="space-y-3">
            {has('addon_card') && (<>
              <label className="flex items-center justify-between cursor-pointer bg-[#F3F0FA] rounded-xl px-4 py-3 hover:bg-[#EDE8F8] transition-colors">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={card} onChange={e=>setCard(e.target.checked)} className="w-4 h-4 accent-[#A58CF4]"/>
                  <div>
                    <p className="text-[0.88rem] font-medium text-[#433075]">Greeting Card</p>
                    <p className="text-[0.72rem] text-[#6E6A8C]">A personalised card for your recipient</p>
                  </div>
                </div>
                <span className="text-[0.82rem] font-semibold text-[#A58CF4]">+₦3,000</span>
              </label>
              {card && <Textarea label="Card message" value={cardMsg} onChange={setCardMsg} placeholder="Write the message for the card…"/>}
            </>)}
            {has('addon_chamdor') && (
              <label className="flex items-center justify-between cursor-pointer bg-[#F3F0FA] rounded-xl px-4 py-3 hover:bg-[#EDE8F8] transition-colors">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={chamdor} onChange={e=>setChamdor(e.target.checked)} className="w-4 h-4 accent-[#A58CF4]"/>
                  <div>
                    <p className="text-[0.88rem] font-medium text-[#433075]">Chamdor Wine 🍾</p>
                    <p className="text-[0.72rem] text-[#6E6A8C]">Celebrate in style</p>
                  </div>
                </div>
                <span className="text-[0.82rem] font-semibold text-[#A58CF4]">+₦6,000</span>
              </label>
            )}
            {has('addon_candles') && (
              <div className="bg-[#F3F0FA] rounded-xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.88rem] font-medium text-[#433075]">Candles 🕯️</p>
                    <p className="text-[0.72rem] text-[#6E6A8C]">₦500 per candle</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={()=>setCandles(Math.max(0,candles-1))}
                      className="w-8 h-8 rounded-full bg-white border border-[rgba(165,140,244,0.3)] flex items-center justify-center hover:bg-[#E1D7F0] transition-colors">
                      <Minus size={13}/>
                    </button>
                    <span className="text-[0.9rem] font-semibold text-[#433075] w-5 text-center">{candles}</span>
                    <button type="button" onClick={()=>setCandles(candles+1)}
                      className="w-8 h-8 rounded-full bg-white border border-[rgba(165,140,244,0.3)] flex items-center justify-center hover:bg-[#E1D7F0] transition-colors">
                      <Plus size={13}/>
                    </button>
                    {candles>0 && <span className="text-[0.82rem] font-semibold text-[#A58CF4]">+{fmt(candles*500)}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {has('notes') && (
        <Section title={`${s++}. 💬 Additional Notes`}>
          <Textarea label="Any other requests?" value={notes} onChange={setNotes}
            placeholder="Allergies, special instructions…"/>
        </Section>
      )}

      <PriceSummary
        product={product}
        selectedSize={hasSizes ? selectedSize : undefined}
        base={base}
        icingSurcharge={0}
        card={has('addon_card') && card}
        chamdor={has('addon_chamdor') && chamdor}
        candles={has('addon_candles') ? candles : 0}
        total={total}
      />

      <ReferencePhotoTip/>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button onClick={addToCart}
          className="flex items-center justify-center gap-2 bg-white border-2 border-[#433075]
            text-[#433075] py-3.5 rounded-full font-semibold text-[0.85rem]
            hover:bg-[#433075] hover:text-white transition-all duration-250 active:scale-[0.97]">
          <ShoppingBag size={16}/> Add to Cart
        </button>
        <button onClick={buildWA}
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white
            py-3.5 rounded-full font-semibold text-[0.85rem]
            hover:bg-[#1BBE5C] transition-all duration-250 active:scale-[0.97]">
          <WAIcon/> Order via WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ─── Price Summary ─────────────────────────────────────────────── */
function PriceSummary({ product, selectedSize, base, icingSurcharge, card, chamdor, candles, total }: {
  product: Product; selectedSize?: string; base: number; icingSurcharge: number;
  card: boolean; chamdor: boolean; candles: number; total: number;
}) {
  return (
    <div className="bg-[#433075] rounded-2xl p-5 space-y-2">
      <p className="text-[0.72rem] tracking-[0.1em] uppercase text-white/50 mb-3">Order Summary</p>
      <div className="flex justify-between text-[0.85rem] text-white/70">
        <span>{product.name}{selectedSize ? ` — ${selectedSize}` : ''}</span>
        <span>{`₦${base.toLocaleString()}`}</span>
      </div>
      {icingSurcharge > 0 && (
        <div className="flex justify-between text-[0.85rem] text-white/70">
          <span>Whipped cream</span><span>+₦{icingSurcharge.toLocaleString()}</span>
        </div>
      )}
      {card    && <div className="flex justify-between text-[0.85rem] text-white/70"><span>Greeting card</span><span>+₦3,000</span></div>}
      {chamdor && <div className="flex justify-between text-[0.85rem] text-white/70"><span>Chamdor wine</span><span>+₦6,000</span></div>}
      {candles>0 && <div className="flex justify-between text-[0.85rem] text-white/70"><span>Candles ×{candles}</span><span>+₦{(candles*500).toLocaleString()}</span></div>}
      <div className="border-t border-white/15 pt-3 flex justify-between">
        <span className="text-white font-semibold">Estimated Total</span>
        <span className="font-cormorant text-[1.3rem] font-semibold text-[#E1D7F0]">{`₦${total.toLocaleString()}`}</span>
      </div>
      <p className="text-[0.68rem] text-white/35 text-center pt-1">Final price confirmed on WhatsApp</p>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */
export default function CakeOrderForm({ product, onClose }: { product: Product; onClose?: () => void }) {
  return product.category === 'one-layer'
    ? <OneLayerForm product={product} onClose={onClose}/>
    : <BiggerCakeForm product={product} onClose={onClose}/>;
}

function WAIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}
