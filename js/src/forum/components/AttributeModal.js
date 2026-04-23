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
          
          // Eğer başlangıçta marka seçiliyse modelleri doldur
          if (this.brand()) {
              this.updateModels(this.brand());
          }
          m.redraw();
      });
  }

  updateModels(brandName) {
      this.availableModels = this.taxonomy.filter(item => item.brand === brandName);
  }

  className() {
    return 'AttributeModal Modal--large';
  }

  title() {
    return 'Araç Künye Bilgileri';
  }

  content() {
    const labelStyle = "display: flex; align-items: flex-end; min-height: 36px; margin-bottom: 6px; font-weight: bold; font-size: 13px; line-height: 1.3;";

    // Benzersiz markaları alalım
    const brands = [...new Set(this.taxonomy.map(item => item.brand))].sort();

    return (
      <div className="Modal-body">
        <div className="Form-group">
            <p className="helpText" style="margin-bottom: 25px; font-size: 14px; color: #666; text-align: center;">
                Fotoğraflar arka planda yükleniyor. Lütfen araç bilgilerini giriniz.<br/>
                <i style="font-size: 12px; color: #999;">(Boş bırakılan alanlar şablonda gösterilmez)</i>
            </p>

            {/* 1. Grup */}
            <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                <div style="flex: 1;">
                    <label style={labelStyle}>Firma İsmi (Örn: Kamil Koç)</label>
                    <input className="FormControl" bidi={this.company} />
                </div>
                <div style="flex: 1;">
                    <label style={labelStyle}>Plaka (Örn: 34 ABC 12)</label>
                    <input className="FormControl" bidi={this.plate} />
                </div>
            </div>

            {/* 2. Grup */}
            <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                <div style="flex: 1;">
                    <label style={labelStyle}>Marka Seçiniz</label>
                    <select className="FormControl" value={this.brand()} onchange={(e) => {
                        this.brand(e.target.value);
                        this.model(''); // Marka değişince modeli sıfırla
                        this.updateModels(e.target.value);
                    }}>
                        <option value="">-- Marka Seç --</option>
                        {brands.map(b => <option value={b}>{b}</option>)}
                        <option value="Diğer">Diğer</option>
                    </select>
                </div>
                <div style="flex: 1;">
                    <label style={labelStyle}>Model Seçiniz</label>
                    {this.brand() === 'Diğer' ? (
                        <input className="FormControl" bidi={this.model} placeholder="Modeli el ile yazın..." />
                    ) : (
                        <select className="FormControl" value={this.model()} onchange={e => this.model(e.target.value)} disabled={!this.brand()}>
                            <option value="">-- Model Seç --</option>
                            {this.availableModels.map(m => <option value={m.model}>{m.model}</option>)}
                        </select>
                    )}
                </div>
            </div>

            {/* 3. Grup */}
            <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                <div style="flex: 1;">
                    <label style={labelStyle}>Çekim Yeri (Örn: İstanbul)</label>
                    <input className="FormControl" bidi={this.location} />
                </div>
                <div style="flex: 1;">
                    <label style={labelStyle}>Yıl (Örn: 2025)</label>
                    <input className="FormControl" type="number" bidi={this.year} />
                </div>
            </div>
            
            <div className="Form-group" style="display: flex; justify-content: space-between; align-items: center;">
                 <Button className="Button Button--primary" style="background-color: #3498db; border-color: #3498db;" icon="fas fa-info-circle" onclick={this.goToInfo.bind(this)}>
                    Info Ekle
                 </Button>

                 <div style="display: flex; gap: 10px;">
                    <Button className="Button Button--text" onclick={this.skip.bind(this)}>
                        Künye Ekleme
                    </Button>
                    <Button className="Button Button--primary" onclick={this.submit.bind(this)}>
                        Bilgileri Onayla
                    </Button>
                 </div>
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