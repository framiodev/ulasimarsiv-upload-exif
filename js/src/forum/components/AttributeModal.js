import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import app from 'flarum/forum/app';

export default class AttributeModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    const initial = this.attrs.initialValues || {};

    this.company = Stream(initial.company || '');
    this.plate = Stream(initial.plate || '');
    this.brand = Stream(initial.brand || '');
    this.model = Stream(initial.model || '');
    this.location = Stream(initial.location || '');
    this.year = Stream(initial.year || '');

    this.taxonomy = [];
    this.availableModels = [];
    this.loadTaxonomy();

    this.onsubmitCallback = this.attrs.onsubmit;
    this.onskipCallback = this.attrs.onskip;
    this.onInfoCallback = this.attrs.onInfo;
  }

  loadTaxonomy() {
      app.request({ method: 'GET', url: app.forum.attribute('apiUrl') + '/ulasimarsiv-taxonomy' }).then(result => {
          this.taxonomy = result.data || [];
          console.log('[AttributeModal] Taxonomy loaded:', this.taxonomy.length, 'items');
          if (this.brand()) this.updateModels(this.brand());
          m.redraw();
      }).catch(err => {
          console.error('[AttributeModal] Error loading taxonomy:', err);
      });
  }

  updateModels(brandName) {
      if (!brandName) {
          this.availableModels = [];
          return;
      }
      const targetBrand = String(brandName).trim();
      this.availableModels = this.taxonomy.filter(item => String(item.brand).trim() === targetBrand);
      console.log(`[AttributeModal] Filtered models for "${targetBrand}":`, this.availableModels);
      m.redraw();
  }


  className() { return 'AttributeModal Modal--large'; }
  title() { return 'Araç Künye Bilgileri'; }

  content() {
    const brands = [...new Set(this.taxonomy.map(item => String(item.brand).trim()))].sort();

    return (
      <div className="Modal-body">
        <p className="helpText" style={{ textAlign: 'center', marginBottom: '20px' }}>
          Fotoğraflar arka planda yükleniyor. Lütfen araç bilgilerini giriniz.<br/>
          <i>(Boş bırakılan alanlar şablonda gösterilmez)</i>
        </p>

        {/* SATIR 1: Firma ve Plaka */}
        <div className="Form-group" style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
                <label>Firma İsmi</label>
                <input className="FormControl" value={this.company()} oninput={e => this.company(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
                <label>Plaka</label>
                <input className="FormControl" value={this.plate()} oninput={e => this.plate(e.target.value)} />
            </div>
        </div>

        {/* SATIR 2: Marka ve Model */}
        <div className="Form-group" style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
                <label>Marka Seçiniz</label>
                <select className="FormControl" value={this.brand()} onchange={(e) => {
                    this.brand(e.target.value);
                    this.model(''); 
                    this.updateModels(e.target.value);
                }}>
                    <option value="">-- Marka Seç --</option>
                    {brands.map(b => <option value={b}>{b}</option>)}
                    <option value="Diğer">Diğer</option>
                </select>
            </div>
            <div style={{ flex: 1 }}>
                <label>Model Seçiniz</label>
                {this.brand() === 'Diğer' ? (
                    <input className="FormControl" value={this.model()} oninput={e => this.model(e.target.value)} placeholder="Modeli el ile yazın..." />
                ) : (
                    <select className="FormControl" value={this.model()} onchange={e => this.model(e.target.value)} disabled={!this.brand()}>
                        <option value="">-- Model Seç --</option>
                        {this.availableModels.map(m => <option value={m.model}>{m.model}</option>)}
                    </select>
                )}
            </div>
        </div>

        {/* SATIR 3: Çekim Yeri ve Yıl */}
        <div className="Form-group" style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <div style={{ flex: 1 }}>
                <label>Çekim Yeri</label>
                <input className="FormControl" value={this.location()} oninput={e => this.location(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
                <label>Yıl</label>
                <input className="FormControl" type="number" value={this.year()} oninput={e => this.year(e.target.value)} />
            </div>
        </div>
        
        {/* BUTONLAR */}
        <div className="Form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <Button className="Button Button--primary" style={{ backgroundColor: '#3498db', borderColor: '#3498db' }} icon="fas fa-info-circle" onclick={this.goToInfo.bind(this)}>
                Info Ekle
             </Button>

             <div style={{ display: 'flex', gap: '10px' }}>
                <Button className="Button Button--text" onclick={this.skip.bind(this)}>
                    Künye Ekleme
                </Button>
                <Button className="Button Button--primary" onclick={this.submit.bind(this)}>
                    Bilgileri Onayla
                </Button>
             </div>
        </div>
      </div>
    );
  }

  getRawData() {
      return {
          company: this.company(),
          plate: this.plate(),
          brand: this.brand(),
          model: this.model(),
          location: this.location(),
          year: this.year()
      };
  }

  prepareData() {
    const lines = [];
    const firmVal = this.company();
    const plateVal = this.plate();
    let line1 = '';
    if (firmVal && plateVal) line1 = `${firmVal} | ${plateVal}`;
    else if (firmVal) line1 = firmVal;
    else if (plateVal) line1 = plateVal;
    if (line1) lines.push(`- **${line1}**`);

    const brandVal = this.brand();
    const modelVal = this.model();
    let line2 = '';
    if (brandVal && modelVal) line2 = `${brandVal} ${modelVal}`;
    else if (brandVal) line2 = brandVal;
    else if (modelVal) line2 = modelVal;
    if (line2) lines.push(`- **${line2}**`);

    const locVal = this.location();
    let yearVal = this.year();
    if (yearVal) yearVal = "'" + yearVal.toString().slice(-2);

    let line3 = '';
    if (locVal && yearVal) line3 = `${locVal} / ${yearVal}`;
    else if (locVal) line3 = locVal;
    else if (yearVal) line3 = yearVal;
    if (line3) lines.push(`- **${line3}**`);

    return lines.length > 0 ? lines.join('\n') : null;
  }

  submit(e) {
    e.preventDefault();
    const resultText = this.prepareData();
    if (this.onsubmitCallback) this.onsubmitCallback(resultText);
    app.modal.close();
  }

  goToInfo(e) {
      e.preventDefault();
      const resultText = this.prepareData();
      const rawData = this.getRawData();
      
      // DÜZELTME: Modalı kapatmıyoruz, sadece sinyal gönderiyoruz.
      if (this.onInfoCallback) this.onInfoCallback(resultText, rawData);
  }

  skip() {
      if (this.onskipCallback) this.onskipCallback();
      app.modal.close();
  }
}