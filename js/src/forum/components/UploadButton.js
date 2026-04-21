import Component from 'flarum/common/Component';
import icon from 'flarum/common/helpers/icon';
import app from 'flarum/forum/app';
import Tooltip from 'flarum/common/components/Tooltip';
import WatermarkModal from './WatermarkModal';
import AttributeModal from './AttributeModal';
import InfoModal from './InfoModal';

export default class UploadButton extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = false;
  }

  view() {
    const buttonClasses = ['Button', 'spotter-upload-button', 'hasIcon', this.loading ? '' : 'Button--link Button--icon'].join(' ');
    return (
      <Tooltip text={this.loading ? '' : 'Fotoğraf Yükle'}> 
        <button className={buttonClasses} type="button" onclick={() => !this.loading && this.element.querySelector('input').click()}>
            {this.loading ? icon('fas fa-spinner fa-spin') : icon('fas fa-camera')}
            <span className="Button-label">{this.loading ? ' Yükleniyor...' : 'Fotoğraf Yükle'}</span>
            <input type="file" multiple accept="image/*" style="display:none" onchange={this.process.bind(this)} />
        </button>
      </Tooltip>
    );
  }

  process(e) {
    const fileList = Array.from(e.target.files);
    if (fileList.length === 0) return;
    fileList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    
    app.modal.show(WatermarkModal, {
        files: fileList,
        onconfirm: (result) => this.startUpload(fileList, result)
    });
    e.target.value = '';
  }

  startUpload(fileList, result) {
    this.loading = true; 
    m.redraw();
    
    const uploadPromise = this.performBackgroundUpload(fileList, result);
    // Modalı açarken promise'i taşıyoruz
    this.openAttributeModal(uploadPromise, null);
  }

  // --- NAVİGASYON FONKSİYONLARI (Modallar arası geçiş) ---

  openAttributeModal(uploadPromise, initialData) {
      app.modal.show(AttributeModal, {
        initialValues: initialData,
        
        onsubmit: (attributeText) => {
            this.finishProcess(uploadPromise, attributeText, null);
        },
        onskip: () => {
            this.finishProcess(uploadPromise, null, null);
        },
        onInfo: (attributeText, rawData) => {
            // setTimeout YOK. Direkt geçiş yapıyoruz ki arka plan karartısı (backdrop) gitmesin.
            this.openInfoModal(uploadPromise, attributeText, rawData);
        }
    });
  }

  openInfoModal(uploadPromise, attributeText, rawData) {
      app.modal.show(InfoModal, {
          onsubmit: (infoText) => {
              this.finishProcess(uploadPromise, attributeText, infoText);
          },
          onback: () => {
              // Geri dönüldüğünde Attribute modalını eski verilerle aç
              this.openAttributeModal(uploadPromise, rawData);
          }
      });
  }

  // --- SONUÇLANDIRMA VE EDİTÖRE BASMA ---

  finishProcess(uploadPromise, attributeText, infoText) {
      uploadPromise.then(validCodes => {
          if (validCodes.length > 0) {
              let textToInsert = validCodes.join('\n');
              
              // 1. Künye Bilgisi Ekle
              if (attributeText) {
                  textToInsert += '\n' + attributeText;
              }

              // 2. Info Bilgisi Ekle (YENİ FORMAT)
              if (infoText && infoText.trim() !== '') {
                  // Önce Başlık: > **Meraklısına Info**
                  // Sonra bir boş satır (yine > ile başlayan)
                  textToInsert += '\n\n> **Meraklısına Info**\n>\n';

                  // İçeriği satırlara böl
                  const lines = infoText.split('\n');
                  
                  // Her satırın başına > işareti ve bir boşluk ekle
                  const quotedLines = lines.map(line => `> ${line}`);
                  
                  // Satırları birleştir ve ana metne ekle
                  textToInsert += quotedLines.join('\n') + '\n';
              } else {
                  // Info yoksa sadece alt satıra geç
                  textToInsert += '\n';
              }

              // Editöre yapıştır
              if (this.attrs.editor && typeof this.attrs.editor.insertAtCursor === 'function') {
                  this.attrs.editor.insertAtCursor(textToInsert);
              } else if (app.composer && app.composer.editor) {
                  app.composer.editor.insertAtCursor(textToInsert);
              }
          } else { 
              app.alerts.show({ type: 'error' }, 'Yükleme başarısız oldu.'); 
          }
      }).catch(err => { 
          console.error(err); 
          app.alerts.show({ type: 'error' }, 'Bir hata oluştu.'); 
      }).finally(() => { 
          this.loading = false; 
          m.redraw(); 
      });
  }

  // --- ARKA PLAN YÜKLEME İŞLEMLERİ ---

  performBackgroundUpload(fileList, result) {
    const selections = result.selections || [];
    const targetUsername = result.targetUsername || '';
    const targetWatermarkType = result.targetWatermarkType || '';
    const customFileNames = result.customFileNames || [];

    const uploads = fileList.map((file, index) => {
        let watermarkType = selections[index] || 'none';
        if (watermarkType === 'admin_override') watermarkType = 'none';
        const customName = customFileNames[index] || '';

        return this.uploadFile(file, watermarkType, targetUsername, targetWatermarkType, customName);
    });
    
    return Promise.all(uploads).then(results => results.filter(code => code !== null));
  }

  uploadFile(file, watermarkType, targetUsername, targetWatermarkType, customName) {
    const data = new FormData();
    data.append('spotter_image', file);
    data.append('watermark_type', watermarkType);
    
    if (customName) data.append('custom_filename', customName);
    if (targetUsername) {
        data.append('target_username', targetUsername);
        if (targetWatermarkType) data.append('target_watermark_type', targetWatermarkType);
    }

    let apiUrl = app.forum.attribute('apiUrl');
    if (window.location.protocol === 'https:' && apiUrl.startsWith('http:')) apiUrl = apiUrl.replace(/^http:/, 'https:');

    return fetch(apiUrl + '/spotter-upload', {
        method: 'POST', body: data, headers: { 'X-CSRF-Token': app.session.csrfToken }
    }).then(response => {
        if (!response.ok) return response.text().then(text => { throw new Error(response.status); });
        return response.json(); 
    }).then(data => data.bbcode).catch(error => { console.warn('Yükleme hatası:', file.name, error); return null; });
  }
}