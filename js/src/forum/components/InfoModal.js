import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import app from 'flarum/forum/app';
import m from 'mithril';

export default class InfoModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
    this.infoText = Stream('');
    this.onsubmitCallback = this.attrs.onsubmit;
    this.onbackCallback = this.attrs.onback;
  }

  className() {
    return 'InfoModal Modal--large';
  }

  title() {
    return 'Meraklısına Info Ekle';
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Rich-Toolbar" style={{display: 'flex', gap: '5px', padding: '5px', border: '1px solid #ddd', borderBottom: 'none', background: '#f9f9f9', borderRadius: '4px 4px 0 0', flexWrap: 'wrap'}}>
            {this.renderButton('bold', 'fa fa-bold', 'Kalın')}
            {this.renderButton('italic', 'fa fa-italic', 'İtalik')}
            {this.renderButton('strikethrough', 'fa fa-strikethrough', 'Üstü Çizili')}
            <div style={{width: '1px', background: '#ccc', margin: '0 5px'}}></div>
            {this.renderButton('url', 'fa fa-link', 'Bağlantı')}
            {this.renderButton('quote', 'fa fa-quote-right', 'Alıntı')}
            {this.renderButton('code', 'fa fa-code', 'Kod')}
            <div style={{width: '1px', background: '#ccc', margin: '0 5px'}}></div>
            {this.renderButton('list', 'fa fa-list-ul', 'Madde İşareti')}
            {this.renderButton('numlist', 'fa fa-list-ol', 'Numaralı Liste')}
            <div style={{width: '1px', background: '#ccc', margin: '0 5px'}}></div>
            <div className="Toolbar-Item" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                <label htmlFor="txtColor" style={{margin:0, cursor:'pointer', padding: '5px'}} title="Metin Rengi">
                    <i className="fa fa-palette"></i>
                </label>
                <input type="color" id="txtColor" onchange={(e) => this.insertColor(e.target.value)} style={{width: '20px', height: '20px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer'}} />
            </div>
        </div>

        <div className="Form-group">
            <textarea 
                className="FormControl" 
                rows="10" 
                bidi={this.infoText}
                id="infoTextArea"
                placeholder="Detaylı bilgileri buraya girebilirsiniz..."
                style={{borderRadius: '0 0 4px 4px', fontFamily: 'monospace'}}
            />
        </div>

        <div className="Form-group" style="display: flex; justify-content: space-between; gap: 10px;">
             <Button className="Button Button--text" icon="fas fa-arrow-left" onclick={this.back.bind(this)}>
                Künye Ekranına Dön
             </Button>

             <Button className="Button Button--primary" onclick={this.submit.bind(this)}>
                Info'yu Tamamla ve Bitir
            </Button>
        </div>
      </div>
    );
  }

  renderButton(type, iconClass, title) {
      return (
          <button className="Button Button--icon Button--link" type="button" title={title} onclick={() => this.formatText(type)}>
              <i className={iconClass}></i>
          </button>
      );
  }

  formatText(type) {
      const textarea = document.getElementById('infoTextArea');
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = this.infoText();
      const selected = text.substring(start, end);
      
      let before = '';
      let after = '';

      switch(type) {
          case 'bold': before = '[b]'; after = '[/b]'; break;
          case 'italic': before = '[i]'; after = '[/i]'; break;
          case 'strikethrough': before = '[s]'; after = '[/s]'; break;
          case 'url': before = '[url]'; after = '[/url]'; break;
          case 'quote': before = '[quote]'; after = '[/quote]'; break;
          case 'code': before = '[code]'; after = '[/code]'; break;
          case 'list': before = '[list]\n[*]'; after = '\n[/list]'; break;
          case 'numlist': before = '[list=1]\n[*]'; after = '\n[/list]'; break;
      }

      const newText = text.substring(0, start) + before + selected + after + text.substring(end);
      this.infoText(newText);
      
      setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + before.length, end + before.length);
      }, 50);
  }

  insertColor(colorHex) {
      const textarea = document.getElementById('infoTextArea');
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = this.infoText();
      const selected = text.substring(start, end);
      const before = `[color=${colorHex}]`;
      const after = `[/color]`;
      const newText = text.substring(0, start) + before + selected + after + text.substring(end);
      this.infoText(newText);
  }

  submit(e) {
    e.preventDefault();
    if (this.onsubmitCallback) this.onsubmitCallback(this.infoText());
    app.modal.close();
  }

  back(e) {
      e.preventDefault();
      // DÜZELTME: Sinyal gönder, modal kapanmaz.
      if (this.onbackCallback) this.onbackCallback();
  }
}