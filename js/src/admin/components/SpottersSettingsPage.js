import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import app from 'flarum/admin/app';
import saveSettings from 'flarum/admin/utils/saveSettings';

export default class SpottersSettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);

    this.searchQuery = '';
    this.images = [];
    this.originals = []; // Sadece orijinaller için liste
    this.isLoading = false;
    this.isLoadingOriginals = false;
    
    // SAYFALAMA AYARLARI
    this.offset = 0;
    this.limit = 14; // Sayfa başına 14 fotoğraf (7x2)
    
    this.offsetOrig = 0; // Orijinaller için ayrı sayfalama

    // ADMIN WATERMARK
    this.adminWatermarks = [];
    this.newWmUsername = '';
    this.newWmType = 'yatay';
    this.newWmFile = null;
    this.isUploadingWm = false;

    this.loadImages();
    this.loadOriginals(); // Orijinalleri de yükle
    this.loadAdminWatermarks();
  }

  content() {
    return [
      <div className="SpottersSettingsPage">
        <div className="container">
          
          {/* --- GENEL AYARLAR --- */}
          <div className="Form-group">
            <h3 className="Settings-title">Genel Yapılandırma</h3>
            {this.buildSettingComponent({
                type: 'number',
                setting: 'ulasimarsiv-upload-exif.resize_width',
                label: 'Maksimum Fotoğraf Genişliği (px)',
                placeholder: '3840'
            })}
            {this.buildSettingComponent({
                type: 'number',
                setting: 'ulasimarsiv-upload-exif.compression_quality',
                label: 'Sıkıştırma Kalitesi (0-100)',
                placeholder: '90'
            })}
             {this.buildSettingComponent({
                type: 'number',
                setting: 'ulasimarsiv-upload-exif.thumb_width',
                label: 'Thumbnail Genişliği',
                placeholder: '1024'
            })}
             {this.buildSettingComponent({
                type: 'number',
                setting: 'ulasimarsiv-upload-exif.mini_width',
                label: 'Mini Galeri Genişliği',
                placeholder: '250'
            })}

            {/* --- YENİ EKLENEN BÖLÜM 1: ORİJİNAL (WATERMARKSIZ) FOTOĞRAF AYARLARI --- */}
            <div className="Form-group" style={{marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px', border: '1px solid #e8e8e8'}}>
                <h3 className="Settings-title" style={{color: '#e67e22', marginTop: 0}}>Orijinal (İmzasız) Fotoğraf Ayarları</h3>
                <p className="helpText">Sadece yöneticilerin görebileceği, imzasız yedeklenen fotoğraflar için geçerlidir. Boş bırakırsanız cihazdaki orijinal haliyle yüklenir.</p>
                
                {this.buildSettingComponent({
                    type: 'number',
                    setting: 'ulasimarsiv-upload-exif.original_resize_width',
                    label: 'Orijinal Maksimum Genişlik (Opsiyonel)',
                    placeholder: 'Sınırsız (Boş Bırakın)'
                })}
                {this.buildSettingComponent({
                    type: 'number',
                    setting: 'ulasimarsiv-upload-exif.original_compression_quality',
                    label: 'Orijinal Sıkıştırma Kalitesi (0-100)',
                    placeholder: '100 (Kayıpsız)'
                })}
            </div>

            {/* --- YENİ EKLENEN BÖLÜM 2: GÖRÜNÜRLÜK AYARLARI --- */}
            <div className="Form-group" style={{marginTop: '20px'}}>
                <h3 className="Settings-title">Görünürlük</h3>
                {this.buildSettingComponent({
                    type: 'boolean', 
                    setting: 'ulasimarsiv-upload-exif.show_exif_publicly', 
                    label: 'EXIF Bilgilerini Herkese Göster',
                    help: 'Aktif edilirse ziyaretçiler ve üyeler kamera bilgilerini görebilir. Pasifse sadece admin görür.'
                })}
            </div>
            {/* ------------------------------------------------------------- */}

            <div className="Form-group" style={{marginTop: '30px'}}>
                <Button className="Button Button--primary" onclick={this.save.bind(this)}>
                    Ayarları Kaydet
                </Button>
            </div>
          </div>

          <hr style={{margin: '40px 0'}} />

          {/* --- ADMIN WATERMARK YÖNETİMİ (YENİ) --- */}
          <div className="WatermarkManager-section">
            <h3 className="Settings-title" style={{color: '#27ae60'}}>
                <i className="fas fa-stamp" style={{marginRight:'10px'}}></i>
                Filigran (Watermark) Yönetimi
            </h3>
            <p className="helpText">Kullanıcılara özel yatay veya dikey imzaları buradan yükleyebilirsiniz. Sistem otomatik olarak klasör açıp doğru isimlendirmeyi (örn: <code>alikaankaya_yatay_wm.png</code>) yapacaktır. Sadece <strong>.png</strong> formatı desteklenir.</p>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: '#f9f9f9', padding: '15px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input 
                    className="FormControl" 
                    type="text" 
                    placeholder="Kullanıcı Adı (Örn: alikaankaya)" 
                    value={this.newWmUsername}
                    oninput={e => this.newWmUsername = e.target.value}
                    style={{width: '200px'}}
                />
                <select className="FormControl" value={this.newWmType} onchange={e => this.newWmType = e.target.value} style={{width: '120px'}}>
                    <option value="yatay">Yatay</option>
                    <option value="dikey">Dikey</option>
                </select>
                <input 
                    type="file" 
                    accept="image/png"
                    onchange={e => this.newWmFile = e.target.files[0]}
                />
                <Button 
                    className="Button Button--primary" 
                    icon="fas fa-upload" 
                    loading={this.isUploadingWm}
                    onclick={() => this.uploadAdminWatermark()}
                    disabled={!this.newWmUsername || !this.newWmFile}
                >
                    Yükle
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {this.adminWatermarks.map(folder => (
                    <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ background: '#f5f6fa', padding: '10px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                            <i className="fas fa-folder-open" style={{color: '#f39c12', marginRight: '8px'}}></i>
                            {folder.username}
                        </div>
                        <div style={{ padding: '10px' }}>
                            {folder.watermarks.length === 0 ? <span style={{color:'#999', fontSize:'12px'}}>İmza Yok</span> : null}
                            {folder.watermarks.map(wm => (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '12px' }}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden'}}>
                                        <div style={{width:'30px', height:'20px', background:'#eee', borderRadius:'3px', overflow:'hidden', flexShrink:0}}>
                                            <img src={app.forum.attribute('baseUrl') + wm.url} style={{width:'100%', height:'100%', objectFit:'contain'}} />
                                        </div>
                                        <span title={wm.filename} style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                            {wm.type === 'yatay' ? <strong style={{color:'#3498db'}}>[Yatay]</strong> : (wm.type === 'dikey' ? <strong style={{color:'#e74c3c'}}>[Dikey]</strong> : '')}
                                        </span>
                                    </div>
                                    <Button className="Button Button--danger Button--icon" icon="fas fa-times" onclick={() => this.deleteAdminWatermark(folder.username, wm.filename)} style={{minWidth:'24px', height:'24px', padding:0}}></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {this.adminWatermarks.length === 0 && <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>Henüz özel imza klasörü bulunmuyor.</div>}
          </div>

          <hr style={{margin: '40px 0'}} />

          {/* --- BÖLÜM 3: TÜM MEDYA YÖNETİMİ (MEVCUT) --- */}
          <div className="MediaManager-section" style={{marginTop: '30px'}}>
            
            <div className="MediaManager-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 className="Settings-title" style={{margin: 0}}>Tüm Medya Yönetimi</h3>
                
                <div className="MediaManager-search" style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <input 
                        className="FormControl" 
                        type="text" 
                        placeholder="Dosya adı veya kullanıcı adı ile ara..." 
                        value={this.searchQuery}
                        oninput={e => this.searchQuery = e.target.value}
                        onkeydown={e => { if (e.key === 'Enter') this.performSearch(); }}
                        style={{width: '300px'}} 
                    />
                    <Button className="Button Button--primary" onclick={this.performSearch.bind(this)}>
                        <i className="fas fa-search"></i>
                    </Button>
                </div>
            </div>

            {/* MEVCUT GRID RENDER (Ortak Fonksiyon Kullanıyoruz) */}
            {this.renderGrid(this.images, this.isLoading, false)}
            {this.renderPagination(this.images.length, false)}

          </div>

          <hr style={{margin: '40px 0'}} />

          {/* --- BÖLÜM 4: ORİJİNAL (YEDEKLENMİŞ) MEDYA YÖNETİMİ (YENİ) --- */}
          <div className="MediaManager-section">
            <h3 className="Settings-title" style={{color: '#e67e22'}}>
                <i className="fas fa-archive" style={{marginRight:'10px'}}></i>
                Orijinal (İmzasız) Medya Deposu
            </h3>
            <p className="helpText">Burada sadece "Orijinal" yedeği bulunan fotoğraflar listelenir. "Yedeği Sil" derseniz, forumdaki fotoğraf (imzalı) kalır, sadece yedek silinerek yer açılır.</p>
            
            {this.renderGrid(this.originals, this.isLoadingOriginals, true)}
            {this.renderPagination(this.originals.length, true)}
          </div>

        </div>
      </div>
    ];
  }

  // --- ORTAK RENDER FONKSİYONLARI ---

  renderGrid(list, loading, isOriginals) {
      if (loading) return <div style={{textAlign: 'center', padding: '20px'}}><LoadingIndicator /></div>;
      if (list.length === 0) return <div style={{textAlign: 'center', color: '#999', padding: '20px'}}>Kayıt bulunamadı.</div>;

      return (
        <div className="MediaManager-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {list.map(image => {
                // Eğer Orijinal bölümündeysek ve orijinal link varsa onu göster, yoksa thumb
                const thumbUrl = isOriginals && image.attributes.original_path 
                    ? image.attributes.original_path 
                    : (image.attributes.thumb_path || image.attributes.url);
                
                return (
                    <div className="MediaManager-card" style={{ background: '#fff', border: isOriginals ? '1px solid #e67e22' : '1px solid #ddd', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '110px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid #eee' }}>
                            <a href={image.attributes.url} target="_blank" style={{width: '100%', height: '100%'}}>
                                <img src={thumbUrl} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            </a>
                        </div>
                        <div style={{padding: '8px', fontSize: '11px', flexGrow: 1}}>
                            <div title={image.attributes.filename} style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '3px' }}>{image.attributes.filename}</div>
                            <div style={{color: '#666'}}>{image.attributes.username}</div>
                        </div>
                        <div style={{padding: '5px', background: '#fafafa', borderTop: '1px solid #eee'}}>
                            {isOriginals ? (
                                <Button className="Button Button--block Button--small" 
                                        style={{backgroundColor: '#e67e22', color: 'white'}}
                                        onclick={() => this.deleteOriginalOnly(image)}>
                                    Yedeği Sil
                                </Button>
                            ) : (
                                <Button className="Button Button--danger Button--block Button--small" icon="fas fa-trash-alt" onclick={() => this.deleteImage(image)}>
                                    Tamamen Sil
                                </Button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      );
  }

  renderPagination(count, isOriginals) {
      const offset = isOriginals ? this.offsetOrig : this.offset;
      const label = count > 0 ? `${offset + 1} - ${offset + count}` : '0';
      
      return (
        <div className="MediaManager-footer" style={{ display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center', paddingBottom: '30px' }}>
            <Button className="Button" icon="fas fa-chevron-left" disabled={offset === 0} onclick={() => this.changePage(-1, isOriginals)}>Önceki</Button>
            <span style={{fontWeight: 'bold', color: '#666'}}>{label}</span>
            <Button className="Button" icon="fas fa-chevron-right" disabled={count < this.limit} onclick={() => this.changePage(1, isOriginals)}>Sonraki</Button>
        </div>
      );
  }

  // --- FONKSİYONLAR ---

  save() {
    saveSettings(this.settings)
      .then(() => app.alerts.show({ type: 'success' }, 'Ayarlar kaydedildi.'));
  }

  performSearch() {
    this.offset = 0;
    this.loadImages();
  }

  changePage(direction, isOriginals) {
    if (isOriginals) {
        this.offsetOrig += direction * this.limit;
        if (this.offsetOrig < 0) this.offsetOrig = 0;
        this.loadOriginals();
    } else {
        this.offset += direction * this.limit;
        if (this.offset < 0) this.offset = 0;
        this.loadImages();
    }
  }

  // TÜM MEDYALAR (MEVCUT)
  loadImages() {
    this.isLoading = true; m.redraw();
    const params = { page: { offset: this.offset, limit: this.limit } };
    if (this.searchQuery) params.filter = { q: this.searchQuery };
    app.request({ method: 'GET', url: app.forum.attribute('apiUrl') + '/ulasimarsiv-images/all', params: params }).then(result => {
        this.processResults(result, false);
    });
  }

  // --- ADMIN WATERMARK METOTLARI ---
  loadAdminWatermarks() {
      app.request({ method: 'GET', url: app.forum.attribute('apiUrl') + '/ulasimarsiv-admin-watermarks' }).then(result => {
          this.adminWatermarks = result.data || [];
          m.redraw();
      });
  }

  uploadAdminWatermark() {
      if (!this.newWmUsername || !this.newWmFile) return;
      
      this.isUploadingWm = true;
      m.redraw();

      const data = new FormData();
      data.append('username', this.newWmUsername);
      data.append('type', this.newWmType);
      data.append('watermark', this.newWmFile);

      app.request({
          method: 'POST',
          url: app.forum.attribute('apiUrl') + '/ulasimarsiv-admin-watermarks',
          serialize: raw => raw,
          body: data
      }).then(res => {
          app.alerts.show({ type: 'success' }, res.message);
          this.newWmFile = null;
          // Input alanını sıfırla (hacky but works for files)
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = '';
          
          this.isUploadingWm = false;
          this.loadAdminWatermarks();
      }).catch(err => {
          this.isUploadingWm = false;
          m.redraw();
      });
  }

  deleteAdminWatermark(username, filename) {
      if (!confirm(`${username} kullanıcısının ${filename} imzasını silmek istediğinize emin misiniz?`)) return;

      app.request({
          method: 'POST',
          url: app.forum.attribute('apiUrl') + '/ulasimarsiv-admin-watermarks-delete',
          body: { username, filename }
      }).then(res => {
          app.alerts.show({ type: 'success' }, 'İmza silindi.');
          this.loadAdminWatermarks();
      });
  }

  // SADECE ORİJİNALLER (YENİ)
  loadOriginals() {
    this.isLoadingOriginals = true; m.redraw();
    const params = { 
        page: { offset: this.offsetOrig, limit: this.limit },
        filter: { has_original: 1 } // Backend'deki filtreyi tetikler
    };
    app.request({ method: 'GET', url: app.forum.attribute('apiUrl') + '/ulasimarsiv-images/all', params: params }).then(result => {
        this.processResults(result, true);
    });
  }

  processResults(result, isOriginals) {
    const users = {};
    if (result.included) result.included.forEach(r => { if (r.type === 'users') users[r.id] = r.attributes; });
    
    const mapped = result.data.map(img => {
        let username = 'Misafir / Silinmiş';
        if (img.relationships && img.relationships.user && img.relationships.user.data) {
            const userId = img.relationships.user.data.id;
            if (users[userId]) username = users[userId].username;
        }
        img.attributes.username = username;
        return img;
    });

    if (isOriginals) {
        this.originals = mapped;
        this.isLoadingOriginals = false;
    } else {
        this.images = mapped;
        this.isLoading = false;
    }
    m.redraw();
  }

  // MEVCUT SİLME
  deleteImage(image) {
    if (!confirm(`${image.attributes.filename} dosyasını TAMAMEN (Forumdan da) silmek istediğinize emin misiniz?`)) return;

    app.request({
        method: 'DELETE',
        url: app.forum.attribute('apiUrl') + '/ulasimarsiv-image/' + image.id
    }).then(() => {
        this.images = this.images.filter(i => i.id !== image.id);
        this.originals = this.originals.filter(i => i.id !== image.id); // Orijinallerden de düş
        app.alerts.show({ type: 'success' }, 'Görsel tamamen silindi.');
        m.redraw();
    });
  }

  // YENİ: SADECE ORİJİNALİ SİLME
  deleteOriginalOnly(image) {
      if (!confirm(`Sadece yedeği silip forumdaki görseli korumak istiyor musunuz?`)) return;
      
      // Target parametresi ile backend'e "sadece orijinali sil" diyoruz
      app.request({ 
          method: 'DELETE', 
          url: app.forum.attribute('apiUrl') + '/ulasimarsiv-image/' + image.id,
          params: { target: 'original' } 
      }).then(() => {
          // Listeden kaldırmak yerine sadece original_path'i null yapıp listeden atabiliriz
          this.originals = this.originals.filter(i => i.id !== image.id);
          app.alerts.show({ type: 'success' }, 'Orijinal yedek silindi, yer açıldı.');
          m.redraw();
      });
  }
}