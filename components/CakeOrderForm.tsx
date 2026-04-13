'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Plus, Minus, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { ADDON_PRICES, ICING_SURCHARGE } from '@/types';
import type { Product } from '@/types';

/* ─── helpers ───────────────────────────────────────────────────────────────── */
const OCCASIONS = ['Birthday','Wedding','Anniversary','Baby Shower','Graduation','Naming Ceremony','Corporate','Other'];
const GENDERS   = ['Female','Male','Unisex / Not Specified'];
const ONE_LAYER_FLAVOURS  = ['Vanilla','Chocolate','Red Velvet'];
const BIGGER_FLAVOURS_REG = ['Vanilla','Chocolate','Red Velvet'];
const BIGGER_FLAVOURS_DLX = ['Carrot','Coconut','Ginger Full Cream','Cookies & Cream'];
const BIGGER_INCHES   = ['6″','7″','8″','10″','12″'];
const BIGGER_LAYERS   = ['2 Layers','3 Layers','4 Layers','5 Layers','6 Layers'];
const BIGGER_DESIGNS  = ['Chocolate Drip','Wafer Paper Florals','Ombré','Leopard Print','Picture / Photo','Ladies Cake','Stencil','Square','Rectangular','Buttercream Swirls'];
const COLOURS = ['White','Blush Pink','Lilac / Purple','Gold & White','Chocolate Brown','Sky Blue','Black & Gold','Ivory','Sage Green'];
const TOPPERS = ['Number','Name','Bride & Groom','Baby','Floral Picks','Stars & Moon','None'];

function fmt(n: number) { return `₦${n.toLocaleString()}`; }

/* ─── Shared sub-components ────────────────────────────────────────────────── */
function Label({ text }: { text: string }) {
  return <p className="text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-[#9B7EC8] mb-2">{text}</p>;
}
function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-4 py-2 rounded-full text-[0.8rem] border transition-all duration-200 active:scale-[0.97]
        ${on ? 'bg-[#5B2D8E] text-white border-[#5B2D8E]'
             : 'bg-white text-[#7B5EA7] border-[rgba(232,96,154,0.3)] hover:border-[#E8609A] hover:text-[#E8609A]'}`}>
      {label}
    </button>
  );
}
function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <Label text={label} />
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-[rgba(232,96,154,0.25)]
            text-[0.88rem] text-[#5B2D8E] bg-white focus:border-[#E8609A] focus:outline-none">
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B5EA7] pointer-events-none" />
      </div>
    </div>
  );
}
function Input({ label, value, onChange, placeholder, type='text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <Label text={label} />
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[rgba(232,96,154,0.25)]
          text-[0.88rem] text-[#5B2D8E] bg-white focus:border-[#E8609A] focus:outline-none
          placeholder:text-[#7B5EA7]/40" />
    </div>
  );
}
function Textarea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <Label text={label} />
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[rgba(232,96,154,0.25)]
          text-[0.88rem] text-[#5B2D8E] bg-white focus:border-[#E8609A] focus:outline-none
          placeholder:text-[#7B5EA7]/40 resize-none" />
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[rgba(232,96,154,0.15)] rounded-2xl p-5 space-y-4 bg-white">
      <p className="font-cormorant text-[1.1rem] font-semibold text-[#5B2D8E] border-b border-[rgba(232,96,154,0.12)] pb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

/* ─── Add-ons block (shared) ────────────────────────────────────────────────── */
function AddOns({ card, setCard, cardMsg, setCardMsg, chamdor, setChamdor, candles, setCandles }:{
  card: boolean; setCard: (v: boolean) => void;
  cardMsg: string; setCardMsg: (v: string) => void;
  chamdor: boolean; setChamdor: (v: boolean) => void;
  candles: number; setCandles: (v: number) => void;
}) {
  return (
    <Section title="✨ Add-Ons">
      <div className="space-y-3">
        {/* Card */}
        <label className="flex items-center justify-between cursor-pointer bg-[#F0EBFF] rounded-xl px-4 py-3 hover:bg-[#F5E8EC] transition-colors">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={card} onChange={e => setCard(e.target.checked)}
              className="w-4 h-4 accent-[#E8609A]" />
            <div>
              <p className="text-[0.88rem] font-medium text-[#5B2D8E]">Greeting Card</p>
              <p className="text-[0.72rem] text-[#7B5EA7]">A personalised card for your recipient</p>
            </div>
          </div>
          <span className="text-[0.82rem] font-semibold text-[#E8609A]">+₦3,000</span>
        </label>
        {card && (
          <Textarea label="Card message" value={cardMsg} onChange={setCardMsg}
            placeholder="Write the message you'd like on the card…" />
        )}

        {/* Chamdor */}
        <label className="flex items-center justify-between cursor-pointer bg-[#F0EBFF] rounded-xl px-4 py-3 hover:bg-[#F5E8EC] transition-colors">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={chamdor} onChange={e => setChamdor(e.target.checked)}
              className="w-4 h-4 accent-[#E8609A]" />
            <div>
              <p className="text-[0.88rem] font-medium text-[#5B2D8E]">Chamdor Wine 🍾</p>
              <p className="text-[0.72rem] text-[#7B5EA7]">Celebrate in style</p>
            </div>
          </div>
          <span className="text-[0.82rem] font-semibold text-[#E8609A]">+₦6,000</span>
        </label>

        {/* Candles */}
        <div className="bg-[#F0EBFF] rounded-xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.88rem] font-medium text-[#5B2D8E]">Candles 🕯️</p>
              <p className="text-[0.72rem] text-[#7B5EA7]">₦500 per candle</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setCandles(Math.max(0, candles - 1))}
                className="w-8 h-8 rounded-full bg-white border border-[rgba(232,96,154,0.3)]
                  flex items-center justify-center hover:bg-[#E8DAFF] transition-colors">
                <Minus size={13} />
              </button>
              <span className="text-[0.9rem] font-semibold text-[#5B2D8E] w-5 text-center">{candles}</span>
              <button type="button" onClick={() => setCandles(candles + 1)}
                className="w-8 h-8 rounded-full bg-white border border-[rgba(232,96,154,0.3)]
                  flex items-center justify-center hover:bg-[#E8DAFF] transition-colors">
                <Plus size={13} />
              </button>
              {candles > 0 && (
                <span className="text-[0.82rem] font-semibold text-[#E8609A]">+{fmt(candles * 500)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ONE-LAYER CAKE FORM
═══════════════════════════════════════════════════════════════════════════════ */
function OneLaterForm({ product, onClose }: { product: Product; onClose?: () => void }) {
  const { add } = useCart();
  const [flavour,    setFlavour]    = useState('Vanilla');
  const [icing,      setIcing]      = useState<'buttercream'|'whipped-cream'>('buttercream');
  const [colour,     setColour]     = useState('White');
  const [customColour, setCustomColour] = useState('');
  const [message,    setMessage]    = useState('');
  const [occasion,   setOccasion]   = useState('Birthday');
  const [gender,     setGender]     = useState('Female');
  const [delivDate,  setDelivDate]  = useState('');
  const [delivAddr,  setDelivAddr]  = useState('');
  const [notes,      setNotes]      = useState('');
  // add-ons
  const [card,       setCard]       = useState(false);
  const [cardMsg,    setCardMsg]    = useState('');
  const [chamdor,    setChamdor]    = useState(false);
  const [candles,    setCandles]    = useState(0);

  const base = product.basePrice || 8500;
  const icingSurcharge = icing === 'whipped-cream' ? ICING_SURCHARGE['whipped-cream'] : 0;
  const addOnTotal = (card ? ADDON_PRICES.card : 0) + (chamdor ? ADDON_PRICES.chamdor : 0) + (candles * ADDON_PRICES.candlePerUnit);
  const total = base + icingSurcharge + addOnTotal;

  function buildWhatsApp() {
    const addOnList = [
      card ? `Card (+₦3,000)${cardMsg ? ` — "${cardMsg}"` : ''}` : '',
      chamdor ? 'Chamdor Wine (+₦6,000)' : '',
      candles > 0 ? `${candles} Candle${candles > 1 ? 's' : ''} (+₦${candles * 500})` : '',
    ].filter(Boolean).join(', ') || 'None';

    const msg = `🌸 *Bloomies Order — One-Layer Cake*\n\n` +
      `🎂 Cake: ${product.name}\n` +
      `🍰 Flavour: ${flavour}\n` +
      `🍦 Icing: ${icing === 'whipped-cream' ? 'Whipped Cream (+₦2,000)' : 'Buttercream'}\n` +
      `🎨 Colour: ${colour}${customColour ? ` (${customColour})` : ''}\n` +
      `✍️ Message on cake: ${message || 'None'}\n` +
      `🎉 Occasion: ${occasion}\n` +
      `👤 Receiver: ${gender}\n` +
      `📅 Delivery date: ${delivDate || 'TBD'}\n` +
      `📍 Delivery address: ${delivAddr || 'TBD'}\n` +
      `✨ Add-ons: ${addOnList}\n` +
      `💬 Notes: ${notes || 'None'}\n\n` +
      `💰 *Estimated Total: ${fmt(total)}*\n\n` +
      `Please confirm availability and final price. Thank you!`;
    window.open(`https://wa.me/2348181154270?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function addToCart() {
    const summary = `${flavour} | ${icing === 'whipped-cream' ? 'Whipped Cream' : 'Buttercream'} | ${colour}${addOnTotal > 0 ? ' + add-ons' : ''}`;
    add({ id: `${product.id}-${Date.now()}`, name: product.name, price: fmt(total), image: product.image, customisation: summary });
    onClose?.();
  }

  return (
    <div className="space-y-4">
      {/* Flavour */}
      <Section title="1. Choose Your Flavour">
        <div className="flex flex-wrap gap-2">
          {ONE_LAYER_FLAVOURS.map(f => (
            <Chip key={f} label={f} on={flavour === f} onClick={() => setFlavour(f)} />
          ))}
        </div>
      </Section>

      {/* Icing */}
      <Section title="2. Type of Icing">
        <div className="grid grid-cols-2 gap-3">
          {(['buttercream','whipped-cream'] as const).map(t => (
            <button key={t} type="button" onClick={() => setIcing(t)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200
                ${icing === t ? 'border-[#E8609A] bg-[#F0EBFF]' : 'border-[rgba(232,96,154,0.2)] bg-white hover:border-[#E8609A]/50'}`}>
              <p className="text-[0.88rem] font-semibold text-[#5B2D8E] capitalize">{t === 'buttercream' ? 'Buttercream' : 'Whipped Cream'}</p>
              <p className="text-[0.72rem] text-[#7B5EA7] mt-0.5">{t === 'whipped-cream' ? '+₦2,000' : 'Standard'}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* Colour */}
      <Section title="3. Cake Colour & Theme">
        <div className="flex flex-wrap gap-2 mb-3">
          {COLOURS.map(c => <Chip key={c} label={c} on={colour === c} onClick={() => setColour(c)} />)}
        </div>
        <Input label="Custom colour / theme (optional)" value={customColour} onChange={setCustomColour}
          placeholder="Describe your specific colour or theme…" />
      </Section>

      {/* Message */}
      <Section title="4. Cake Message">
        <Input label="What should we write on your cake?" value={message} onChange={setMessage}
          placeholder="e.g. Happy Birthday Amara! 🎂" />
      </Section>

      {/* Occasion & Gender */}
      <Section title="5. Occasion & Recipient">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Occasion" value={occasion} onChange={setOccasion} options={OCCASIONS} />
          <Select label="Gender of receiver" value={gender} onChange={setGender} options={GENDERS} />
        </div>
      </Section>

      {/* Delivery */}
      <Section title="6. Delivery Details">
        <Input label="Preferred delivery date" value={delivDate} onChange={setDelivDate} type="date" placeholder="" />
        <Textarea label="Delivery address" value={delivAddr} onChange={setDelivAddr}
          placeholder="Full delivery address including area / landmark…" />
      </Section>

      {/* Add-ons */}
      <AddOns card={card} setCard={setCard} cardMsg={cardMsg} setCardMsg={setCardMsg}
        chamdor={chamdor} setChamdor={setChamdor} candles={candles} setCandles={setCandles} />

      {/* Notes */}
      <Section title="💬 Additional Notes">
        <Textarea label="Any other requests?" value={notes} onChange={setNotes}
          placeholder="Reference photos, allergies, special instructions…" />
      </Section>

      {/* Price Summary */}
      <div className="bg-[#5B2D8E] rounded-2xl p-5 space-y-2">
        <p className="text-[0.72rem] tracking-[0.1em] uppercase text-white/50 mb-3">Order Summary</p>
        <div className="flex justify-between text-[0.85rem] text-white/70">
          <span>Base price ({product.name})</span><span>{fmt(base)}</span>
        </div>
        {icingSurcharge > 0 && (
          <div className="flex justify-between text-[0.85rem] text-white/70">
            <span>Whipped cream surcharge</span><span>+{fmt(icingSurcharge)}</span>
          </div>
        )}
        {card && <div className="flex justify-between text-[0.85rem] text-white/70"><span>Greeting card</span><span>+{fmt(3000)}</span></div>}
        {chamdor && <div className="flex justify-between text-[0.85rem] text-white/70"><span>Chamdor wine</span><span>+{fmt(6000)}</span></div>}
        {candles > 0 && <div className="flex justify-between text-[0.85sm] text-white/70"><span>Candles ×{candles}</span><span>+{fmt(candles * 500)}</span></div>}
        <div className="border-t border-white/15 pt-3 flex justify-between">
          <span className="text-white font-semibold">Estimated Total</span>
          <span className="font-cormorant text-[1.3rem] font-semibold text-[#E8DAFF]">{fmt(total)}</span>
        </div>
        <p className="text-[0.68rem] text-white/35 text-center pt-1">Final price confirmed on WhatsApp</p>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button onClick={addToCart}
          className="flex items-center justify-center gap-2 bg-white border-2 border-[#5B2D8E]
            text-[#5B2D8E] py-3.5 rounded-full font-semibold text-[0.85rem]
            hover:bg-[#5B2D8E] hover:text-white transition-all duration-250 active:scale-[0.97]">
          <ShoppingBag size={16} /> Add to Cart
        </button>
        <button onClick={buildWhatsApp}
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white
            py-3.5 rounded-full font-semibold text-[0.85rem]
            hover:bg-[#1BBE5C] transition-all duration-250 active:scale-[0.97]">
          <WAIcon /> Order via WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   BIGGER CAKE FORM
═══════════════════════════════════════════════════════════════════════════════ */
function BiggerCakeForm({ product, onClose }: { product: Product; onClose?: () => void }) {
  const { add } = useCart();
  const [inches,      setInches]     = useState('6″');
  const [layers,      setLayers]     = useState('2 Layers');
  const [flavours,    setFlavours]   = useState<string[]>([]);
  const [colour,      setColour]     = useState('White');
  const [customColour,setCustomColour]=useState('');
  const [design,      setDesign]     = useState('Chocolate Drip');
  const [customDesign,setCustomDesign]=useState('');
  const [topper,      setTopper]     = useState('None');
  const [gender,      setGender]     = useState('Female');
  const [occasion,    setOccasion]   = useState('Birthday');
  const [delivDate,   setDelivDate]  = useState('');
  const [delivAddr,   setDelivAddr]  = useState('');
  const [notes,       setNotes]      = useState('');
  // add-ons
  const [card,        setCard]       = useState(false);
  const [cardMsg,     setCardMsg]    = useState('');
  const [chamdor,     setChamdor]    = useState(false);
  const [candles,     setCandles]    = useState(0);

  function toggleFlavour(f: string) {
    setFlavours(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }

  const base = product.basePrice || 22000;
  const addOnTotal = (card ? 3000 : 0) + (chamdor ? 6000 : 0) + (candles * 500);
  const total = base + addOnTotal;

  function buildWhatsApp() {
    const addOnList = [
      card ? `Card (+₦3,000)${cardMsg ? ` — "${cardMsg}"` : ''}` : '',
      chamdor ? 'Chamdor Wine (+₦6,000)' : '',
      candles > 0 ? `${candles} Candle${candles > 1 ? 's' : ''} (+₦${candles * 500})` : '',
    ].filter(Boolean).join(', ') || 'None';

    const msg = `🌸 *Bloomies Order — Custom Cake*\n\n` +
      `🎂 Cake: ${product.name}\n` +
      `📏 Size: ${inches}\n` +
      `🎂 Layers: ${layers}\n` +
      `🍰 Flavours: ${flavours.join(', ') || 'Not specified'}\n` +
      `🎨 Colour: ${colour}${customColour ? ` (${customColour})` : ''}\n` +
      `✨ Design: ${design}${customDesign ? ` — ${customDesign}` : ''}\n` +
      `🎀 Topper: ${topper}\n` +
      `🎉 Occasion: ${occasion}\n` +
      `👤 Receiver: ${gender}\n` +
      `📅 Delivery date: ${delivDate || 'TBD'}\n` +
      `📍 Delivery address: ${delivAddr || 'TBD'}\n` +
      `✨ Add-ons: ${addOnList}\n` +
      `💬 Notes: ${notes || 'None'}\n\n` +
      `💰 *Estimated Total: ${fmt(total)}*\n\n` +
      `Please confirm availability and final price. Thank you!`;
    window.open(`https://wa.me/2348181154270?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function addToCart() {
    const summary = `${inches} | ${layers} | ${flavours.join(', ') || 'TBD'} | ${design}`;
    add({ id: `${product.id}-${Date.now()}`, name: product.name, price: fmt(total), image: product.image, customisation: summary });
    onClose?.();
  }

  return (
    <div className="space-y-4">
      {/* Size & Layers */}
      <Section title="1. Size & Layers">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Cake Size (inches)" value={inches} onChange={setInches} options={BIGGER_INCHES} />
          <Select label="Number of Layers" value={layers} onChange={setLayers} options={BIGGER_LAYERS} />
        </div>
      </Section>

      {/* Flavours */}
      <Section title="2. Choose Flavours">
        <div>
          <Label text="Regular Flavours" />
          <div className="flex flex-wrap gap-2 mb-3">
            {BIGGER_FLAVOURS_REG.map(f => (
              <Chip key={f} label={f} on={flavours.includes(f)} onClick={() => toggleFlavour(f)} />
            ))}
          </div>
          <Label text="Deluxe Flavours ✨" />
          <div className="flex flex-wrap gap-2">
            {BIGGER_FLAVOURS_DLX.map(f => (
              <Chip key={f} label={f} on={flavours.includes(f)} onClick={() => toggleFlavour(f)} />
            ))}
          </div>
          <p className="text-[0.7rem] text-[#7B5EA7]/70 mt-2 italic">✨ Deluxe flavours may attract additional charges</p>
        </div>
      </Section>

      {/* Design */}
      <Section title="3. Design Style">
        <div className="flex flex-wrap gap-2 mb-3">
          {BIGGER_DESIGNS.map(d => (
            <Chip key={d} label={d} on={design === d} onClick={() => setDesign(d)} />
          ))}
        </div>
        <Input label="Describe your design (optional)" value={customDesign} onChange={setCustomDesign}
          placeholder="Any specific details, reference images, style notes…" />
      </Section>

      {/* Colour */}
      <Section title="4. Cake Colour">
        <div className="flex flex-wrap gap-2 mb-3">
          {COLOURS.map(c => <Chip key={c} label={c} on={colour === c} onClick={() => setColour(c)} />)}
        </div>
        <Input label="Custom colour / theme (optional)" value={customColour} onChange={setCustomColour}
          placeholder="Specific shade or theme…" />
      </Section>

      {/* Topper */}
      <Section title="5. Cake Topper">
        <div className="flex flex-wrap gap-2">
          {TOPPERS.map(t => <Chip key={t} label={t} on={topper === t} onClick={() => setTopper(t)} />)}
        </div>
      </Section>

      {/* Occasion & Gender */}
      <Section title="6. Occasion & Recipient">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Occasion" value={occasion} onChange={setOccasion} options={OCCASIONS} />
          <Select label="Gender of receiver" value={gender} onChange={setGender} options={GENDERS} />
        </div>
      </Section>

      {/* Delivery */}
      <Section title="7. Delivery Details">
        <Input label="Preferred delivery date" value={delivDate} onChange={setDelivDate} type="date" placeholder="" />
        <Textarea label="Delivery address" value={delivAddr} onChange={setDelivAddr}
          placeholder="Full delivery address including area / landmark…" />
      </Section>

      {/* Add-ons */}
      <AddOns card={card} setCard={setCard} cardMsg={cardMsg} setCardMsg={setCardMsg}
        chamdor={chamdor} setChamdor={setChamdor} candles={candles} setCandles={setCandles} />

      {/* Notes */}
      <Section title="💬 Additional Notes">
        <Textarea label="Any other requests?" value={notes} onChange={setNotes}
          placeholder="Reference photos, allergies, special instructions…" />
      </Section>

      {/* Price Summary */}
      <div className="bg-[#5B2D8E] rounded-2xl p-5 space-y-2">
        <p className="text-[0.72rem] tracking-[0.1em] uppercase text-white/50 mb-3">Order Summary</p>
        <div className="flex justify-between text-[0.85rem] text-white/70">
          <span>Base price ({product.name})</span><span>{fmt(base)}</span>
        </div>
        {card && <div className="flex justify-between text-[0.85rem] text-white/70"><span>Greeting card</span><span>+{fmt(3000)}</span></div>}
        {chamdor && <div className="flex justify-between text-[0.85rem] text-white/70"><span>Chamdor wine</span><span>+{fmt(6000)}</span></div>}
        {candles > 0 && <div className="flex justify-between text-[0.85rem] text-white/70"><span>Candles ×{candles}</span><span>+{fmt(candles * 500)}</span></div>}
        <div className="border-t border-white/15 pt-3 flex justify-between">
          <span className="text-white font-semibold">Estimated Total</span>
          <span className="font-cormorant text-[1.3rem] font-semibold text-[#E8DAFF]">{fmt(total)}</span>
        </div>
        <p className="text-[0.68rem] text-white/35 text-center pt-1">Final price confirmed on WhatsApp</p>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button onClick={addToCart}
          className="flex items-center justify-center gap-2 bg-white border-2 border-[#5B2D8E]
            text-[#5B2D8E] py-3.5 rounded-full font-semibold text-[0.85rem]
            hover:bg-[#5B2D8E] hover:text-white transition-all duration-250 active:scale-[0.97]">
          <ShoppingBag size={16} /> Add to Cart
        </button>
        <button onClick={buildWhatsApp}
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white
            py-3.5 rounded-full font-semibold text-[0.85rem]
            hover:bg-[#1BBE5C] transition-all duration-250 active:scale-[0.97]">
          <WAIcon /> Order via WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN EXPORT — wraps both forms, chosen by product category
═══════════════════════════════════════════════════════════════════════════════ */
export default function CakeOrderForm({ product, onClose }: {
  product: Product;
  onClose?: () => void;
}) {
  const isOneLayer = product.category === 'one-layer';
  return isOneLayer
    ? <OneLaterForm product={product} onClose={onClose} />
    : <BiggerCakeForm product={product} onClose={onClose} />;
}

function WAIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}
