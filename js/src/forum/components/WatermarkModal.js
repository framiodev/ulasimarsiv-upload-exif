import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import Avatar from 'flarum/common/components/Avatar';
import app from 'flarum/forum/app';

// --- CSS STİLLERİ ---
const CUSTOM_CSS = `
    /* Başlık */
    .WatermarkModal .Modal-header { padding: 12px 20px; border-bottom: 1px solid #eee; }
    .WatermarkModal .Modal-title { font-size: 1.1em; font-weight: 600; }
    
    /* Önizleme Alanı */
    .Watermark-preview-area { background: transparent !important; padding: 0 !important; box-shadow: none !important; }
    
    /* Ortak Hizalama Kapsayıcısı */
    .Preview-Wrapper {
        width: 100%;
        max-width: 400px; /* Fotoğraf ve input buraya sığacak */
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* Butonlar */
    .Watermark-option {
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 40px;
        font-size: 12px;
        font-weight: 500;
        user-select: none;
        position: relative;
        border: 1px solid #ddd;
    }
    .Watermark-option:hover { transform: translateY(-1px); box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
    
    /* SEÇİLİ DURUM (KALIN KONTUR) */
    .Watermark-option.active { 
        border: 2px solid !important;
        font-weight: 700;
        box-shadow: 0 0 0 1px rgba(0,0,0,0.05);
    }

    /* Başlık Yanındaki "Tümüne Uygula" Butonu */
    .Header-Apply-Btn {
        background: #e67e22; color: white; border: none; padding: 4px 10px;
        border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer;
        display: flex; align-items: center; gap: 5px; margin-left: auto;
    }
    .Header-Apply-Btn:hover { background: #d35400; }

    /* Grup Başlıkları */
    .Group-Header-Row {
        display: flex; align-items: center; justify-content: space-between;
        border-bottom: 1px solid #f0f0f0; margin-bottom: 10px; padding-bottom: 5px;
    }
    .Group-Title {
        font-size: 11px; text-transform: uppercase; color: #999;
        font-weight: bold; margin: 0; display: flex; align-items: center; gap: 6px;
    }

    /* Gizli Menü Butonu */
    .Show-Other-Options-Btn {
        background: transparent; border: 1px dashed #ccc; color: #666;
        width: 100%; padding: 8px; font-size: 12px; cursor: pointer;
        border-radius: 4px; margin-top: 10px; transition: all 0.2s;
    }
    .Show-Other-Options-Btn:hover { background: #f9f9f9; color: #333; border-color: #999; }

    /* Animasyonlar */
    .slide-in-right { animation: slideInRight 0.2s ease-out; }
    .slide-in-left { animation: slideInLeft 0.2s ease-out; }
    @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideInLeft { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;

export default class WatermarkModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
    
    this.injectStyles();

    this.files = this.attrs.files || []; 
    this.onconfirm = this.attrs.onconfirm; 
    
    this.selections = new Array(this.files.length).fill('none');
    
    // Dosya adları
    this.customFileNames = this.files.map(f => {
        const name = f.name;
        const lastDotIndex = name.lastIndexOf('.');
        return lastDotIndex !== -1 ? name.substring(0, lastDotIndex) : name;
    });

    this.activeIndex = 0;
    this.previewUrl = Stream(null); 
    this.currentImageOrientation = Stream('landscape'); 
    this.showHiddenOptions = Stream(false); 
    this.hoveredOption = Stream(null);

    // Admin
    this.targetUsername = Stream('');
    this.targetWatermarkType = Stream('yatay'); 
    this.userSearchResults = [];
    this.isSearching = false;
    this.searchTimeout = null;

    this.loadingOptions = true;
    
    // Gruplar
    this.horizontalPersonal = null;
    this.horizontalCenter = []; // Yatay - Orta
    this.horizontalCorner = []; // Yatay - Köşe
    
    this.verticalPersonal = null;
    this.verticalGeneral = []; // Dikey - Genel

    if (this.files.length > 0) this.loadPreview(0);
    this.loadWatermarks();
  }

  injectStyles() {
      if (!document.getElementById('watermark-modal-css')) {
          const style = document.createElement('style');
          style.id = 'watermark-modal-css';
          style.innerHTML = CUSTOM_CSS;
          document.head.appendChild(style);
      }
  }

  onremove(vnode) {
      if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl());
      const styleTag = document.getElementById('watermark-modal-css');
      if (styleTag) styleTag.remove();
      super.onremove(vnode);
  }

  loadPreview(index) {
      if (!this.files[index]) return;
      if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl());
      const objectUrl = URL.createObjectURL(this.files[index]);
      this.previewUrl(objectUrl);

      const img = new Image();
      img.onload = () => {
          const orientation = img.width >= img.height ? 'landscape' : 'portrait';
          this.currentImageOrientation(orientation);
          this.showHiddenOptions(false); 
          m.redraw();
      };
      img.src = objectUrl;
      
      m.redraw();
  }

  changeActiveImage(direction) {
      const newIndex = this.activeIndex + direction;
      if (newIndex >= 0 && newIndex < this.files.length) {
          this.activeIndex = newIndex;
          this.loadPreview(newIndex);
      }
  }

  handleFileNameChange(e) {
      this.customFileNames[this.activeIndex] = e.target.value;
  }

  toggleHiddenOptions() {
      this.showHiddenOptions(!this.showHiddenOptions());
  }

  className() { return 'WatermarkModal Modal--large'; }
  title() { return `İmza Seçimi (${this.activeIndex + 1} / ${this.files.length})`; }

  content() {
    const isAdmin = app.session.user && app.session.user.isAdmin();

    return (
      <div className="Modal-body">
        
        {/* 1. ÖNİZLEME (Hizalama Düzeltildi) */}
        {this.renderPreviewArea()}

        {/* 2. UYARI */}
        <div style={{ color: '#e74c3c', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center', marginBottom: '15px', fontSize: '11px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
            Crop yapılmış fotoğraflara filigran düzgün eklenemeyebilir. Bu tarz fotoğraflarda lütfen bilgisayarınızdaki görsel düzenleme araçlarını kullanınız.
        </div>

        {/* 3. SEÇENEKLER */}
        {this.loadingOptions ? (
            <div style={{textAlign: 'center', padding: '20px'}}><i className="fas fa-spinner fa-spin fa-2x"></i><p>İmzalar yükleniyor...</p></div>
        ) : (
            this.renderFilteredOptions()
        )}

        {/* 4. İMZASIZ */}
        {this.renderNoWatermarkOption()}

        {/* 5. ADMİN */}
        {isAdmin && this.renderAdminPanel()}

        {/* 6. BUTON */}
        <div className="Form-group" style={{marginTop: '20px'}}>
            <Button className="Button Button--primary Button--block" onclick={this.confirmUpload.bind(this)}>
                {this.files.length} Fotoğrafı Yükle
            </Button>
        </div>
      </div>
    );
  }

  renderPreviewArea() {
      const currentSelectionId = this.selections[this.activeIndex];
      let baseUrl = app.forum.attribute('baseUrl').replace(/\/$/, '');
      if (window.location.protocol === 'https:' && baseUrl.startsWith('http:')) baseUrl = baseUrl.replace(/^http:/, 'https:');
      const username = app.session.user ? app.session.user.username() : '';
      const watermarkUrl = currentSelectionId !== 'none' ? baseUrl + '/assets/watermarks/' + username + '/' + encodeURIComponent(currentSelectionId) : '';

      return (
        <div className="Watermark-preview-group" style={{marginBottom: '10px'}}>
            
            {/* WRAPPER: Fotoğraf ve Input'u aynı hizada tutar */}
            <div className="Preview-Wrapper">
                
                <div className="Watermark-preview-area" style={{textAlign: 'center', position: 'relative', minHeight: '160px', width:'100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                    {this.previewUrl() ? (
                        <div style={{position: 'relative', display: 'inline-block', maxWidth: '100%'}}>
                            <img src={this.previewUrl()} style={{maxWidth: '100%', maxHeight: '200px', display: 'block', borderRadius: '4px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}} />
                            {currentSelectionId !== 'none' && (
                                <img src={watermarkUrl} style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none'}} onerror={(e) => { e.target.style.display = 'none'; }} />
                            )}
                        </div>
                    ) : (
                        <div style={{color: '#666', padding:'20px'}}><i className="fas fa-spinner fa-spin"></i> Önizleme hazırlanıyor...</div>
                    )}

                    {/* OKLAR (Wrapper dışında tutulabilir ama burada da çalışır) */}
                    {this.files.length > 1 && (
                        <div style={{position: 'absolute', width: '100%', top: '50%', left: 0, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'space-between', padding: '0 5px', pointerEvents: 'none'}}>
                            <button className="Button Button--icon Button--primary" type="button" style={{ pointerEvents: 'auto', opacity: this.activeIndex === 0 ? 0.3 : 1, boxShadow:'0 2px 5px rgba(0,0,0,0.2)' }} onclick={(e) => { e.preventDefault(); e.stopPropagation(); this.changeActiveImage(-1); }} disabled={this.activeIndex === 0}><i className="fas fa-chevron-left"></i></button>
                            <button className="Button Button--icon Button--primary" type="button" style={{ pointerEvents: 'auto', opacity: this.activeIndex === this.files.length - 1 ? 0.3 : 1, boxShadow:'0 2px 5px rgba(0,0,0,0.2)' }} onclick={(e) => { e.preventDefault(); e.stopPropagation(); this.changeActiveImage(1); }} disabled={this.activeIndex === this.files.length - 1}><i className="fas fa-chevron-right"></i></button>
                        </div>
                    )}
                    
                    <div style={{position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '9px'}}>{this.activeIndex + 1} / {this.files.length}</div>
                </div>

                {/* Dosya Adı - Wrapper içinde olduğu için fotoğrafla hizalı olur */}
                <div className="FileName-Editor" style={{marginTop: '8px', width: '100%'}}>
                    <div className="Form-group" style={{marginBottom: 0, display: 'flex', justifyContent: 'center'}}>
                        <div className="input-group" style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                            <span style={{marginRight: '8px', fontSize: '11px', color: '#666', fontWeight: 'bold', whiteSpace: 'nowrap'}}>Dosya Adı:</span>
                            <input 
                                className="FormControl" 
                                type="text" 
                                value={this.customFileNames[this.activeIndex]} 
                                oninput={this.handleFileNameChange.bind(this)} 
                                style={{textAlign: 'center', fontSize: '12px', height: '30px', flex: 1}} 
                            />
                        </div>
                    </div>
                </div>

            </div> {/* End Wrapper */}
        </div>
      );
  }

  renderFilteredOptions() {
      const isLandscape = this.currentImageOrientation() === 'landscape';
      const isPortrait = this.currentImageOrientation() === 'portrait';
      const showOthers = this.showHiddenOptions();

      return (
        <div>
            {isLandscape && this.renderHorizontalGroup(true)}
            {isPortrait && this.renderVerticalGroup(true)}

            <button type="button" className="Show-Other-Options-Btn" onclick={this.toggleHiddenOptions.bind(this)}>
                {showOthers ? 'Diğer Seçenekleri Gizle' : `Diğer (${isLandscape ? 'Dikey' : 'Yatay'}) Seçenekleri Göster`}
                <i className={`fas fa-chevron-${showOthers ? 'up' : 'down'}`} style={{marginLeft: '5px'}}></i>
            </button>

            {showOthers && (
                <div style={{marginTop: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '6px', border: '1px solid #eee'}}>
                    {isLandscape ? this.renderVerticalGroup(false) : this.renderHorizontalGroup(false)}
                </div>
            )}
        </div>
      );
  }

  renderHorizontalGroup(isPrimary) {
      const currentSelection = this.selections[this.activeIndex];
      const showApplyAll = this.files.length > 1;
      
      const isGroupActive = this.horizontalPersonal?.id === currentSelection || 
                            this.horizontalCenter.some(o => o.id === currentSelection) ||
                            this.horizontalCorner.some(o => o.id === currentSelection);

      return (
        <div style={{marginBottom: isPrimary ? '0' : '10px'}}>
            <div className="Group-Header-Row">
                <h4 className="Group-Title"><i className="fas fa-image"></i> Yatay Fotoğraflar İçin</h4>
                {showApplyAll && isGroupActive && (
                    <button className="Header-Apply-Btn" type="button" onclick={(e) => { e.preventDefault(); this.applyToAll(currentSelection); }}>
                        <i className="fas fa-check-double"></i> Seçimi Tümüne Uygula
                    </button>
                )}
            </div>
            
            <div className="Watermark-layout-container" style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {/* 1. SATIR: Kişisel İmza */}
                {this.horizontalPersonal && (<div style={{width: '100%'}}>{this.renderOption(this.horizontalPersonal)}</div>)}
                
                {/* 2. SATIR: Orta İmzalar */}
                {this.horizontalCenter.length > 0 && (
                    <div style={{display: 'flex', gap: '8px', width: '100%'}}>
                        {this.horizontalCenter.map(opt => <div style={{flex: 1}}>{this.renderOption(opt)}</div>)}
                    </div>
                )}

                {/* 3. SATIR: Köşe İmzalar */}
                {this.horizontalCorner.length > 0 && (
                    <div style={{display: 'flex', gap: '8px', width: '100%'}}>
                        {this.horizontalCorner.map(opt => <div style={{flex: 1}}>{this.renderOption(opt)}</div>)}
                    </div>
                )}
            </div>
        </div>
      );
  }

  renderVerticalGroup(isPrimary) {
      const currentSelection = this.selections[this.activeIndex];
      const showApplyAll = this.files.length > 1;
      
      const isGroupActive = this.verticalPersonal?.id === currentSelection || 
                            this.verticalGeneral.some(o => o.id === currentSelection);

      return (
        <div style={{marginBottom: isPrimary ? '0' : '10px'}}>
            <div className="Group-Header-Row">
                <h4 className="Group-Title"><i className="fas fa-portrait"></i> Dikey Fotoğraflar İçin</h4>
                {showApplyAll && isGroupActive && (
                    <button className="Header-Apply-Btn" type="button" onclick={(e) => { e.preventDefault(); this.applyToAll(currentSelection); }}>
                        <i className="fas fa-check-double"></i> Seçimi Tümüne Uygula
                    </button>
                )}
            </div>

            <div className="Watermark-layout-container" style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {this.verticalPersonal && (<div style={{width: '100%'}}>{this.renderOption(this.verticalPersonal)}</div>)}
                
                {this.verticalGeneral.length > 0 && (
                     <div style={{display: 'flex', gap: '8px', width: '100%'}}>
                        {this.verticalGeneral.map(opt => <div style={{flex: 1}}>{this.renderOption(opt)}</div>)}
                     </div>
                )}
            </div>
        </div>
      );
  }

  renderOption(opt) {
      const isSelected = this.selections[this.activeIndex] === opt.id;
      const isHovered = this.hoveredOption() === opt.id;
      
      const style = { 
          background: opt.bg, 
          color: opt.color, 
          borderColor: isSelected ? opt.color : opt.border, 
      };
      
      return (
        <div 
            className={`Watermark-option ${isSelected ? 'active' : ''}`}
            onclick={() => this.selectWatermark(opt.id)}
            onmouseenter={() => this.hoveredOption(opt.id)}
            onmouseleave={() => this.hoveredOption(null)}
            style={style}
        >
            <div style={{display: 'flex', alignItems: 'center'}}>
                <i className={opt.icon} style={{marginRight: '6px', fontSize: '11px'}}></i>
                <span>{opt.label}</span>
            </div>
        </div>
      );
  }

  renderNoWatermarkOption() {
      const isSelected = this.selections[this.activeIndex] === 'none';
      const isHovered = this.hoveredOption() === 'none';
      const showApplyAll = this.files.length > 1;

      return (
        <div style={{marginTop: '15px'}}>
             {showApplyAll && (
                <div className="Group-Header-Row" style={{borderBottom: 'none', marginBottom: '5px'}}>
                    <span style={{fontSize:'10px', color:'#999'}}>İmzasız Seçenek</span>
                    {isSelected && (
                        <button className="Header-Apply-Btn" style={{background: '#7f8c8d'}} type="button" onclick={(e) => { e.preventDefault(); this.applyToAll('none'); }}>
                            <i className="fas fa-check-double"></i> İptali Tümüne Uygula
                        </button>
                    )}
                </div>
             )}

            <div 
                className={`Watermark-option full-width ${isSelected ? 'active' : ''}`} 
                onclick={() => this.selectWatermark('none')}
                onmouseenter={() => this.hoveredOption('none')}
                onmouseleave={() => this.hoveredOption(null)}
                style={{background: '#eee', color: '#666', borderColor: isSelected ? '#e74c3c' : '#ddd'}}
            >
                <i className="fas fa-ban" style={{marginRight: '8px'}}></i>
                <span>İmza Ekleme (Orijinal Kalsın)</span>
            </div>
        </div>
      );
  }

  renderAdminPanel() {
      const isActive = this.selections[this.activeIndex] === 'admin_override';
      
      return (
        <div>
            <div 
                className={`Watermark-option full-width ${isActive ? 'active' : ''}`} 
                onclick={() => this.selectWatermark('admin_override')} 
                style={{background: '#fff3cd', color: '#856404', borderColor: isActive ? '#856404' : '#ffeeba', marginTop: '10px'}}
            >
                <i className="fas fa-user-secret" style={{marginRight: '8px'}}></i>
                <span>Yönetici: Başka Kullanıcı Adına Yükle</span>
            </div>

            {isActive && (
                <div className="Admin-Override-Panel" style={{marginTop: '10px', padding: '10px', background: '#fffbf2', border: '1px dashed #ffeeba', borderRadius: '5px'}}>
                    <div className="UserSearch-wrapper" style={{position: 'relative'}}>
                        <input className="FormControl" type="text" placeholder="Kullanıcı Ara..." value={this.targetUsername()} oninput={this.handleSearchInput.bind(this)}/>
                        {this.isSearching && <i className="fas fa-spinner fa-spin" style={{position: 'absolute', right: '10px', top: '10px', color: '#999'}}></i>}
                        {this.userSearchResults.length > 0 && (
                            <ul className="Dropdown-menu" style={{display: 'block', width: '100%', position: 'absolute', top: '100%', left: 0, zIndex: 999, maxHeight: '200px', overflowY: 'auto', marginTop: '5px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}}>
                                {this.userSearchResults.map(user => (
                                    <li style={{cursor: 'pointer', padding:'5px 10px'}} onclick={() => this.selectUser(user)}>
                                        <Avatar user={user} className="Avatar--small" style={{marginRight: '10px', verticalAlign: 'middle'}} />
                                        <span style={{fontWeight: 'bold'}}>{user.username()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div style={{marginTop: '10px'}}>
                        <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#856404', fontSize:'12px'}}>Hedef İmza Türü:</label>
                        <div style={{display: 'flex', gap: '20px'}}>
                            <label style={{cursor: 'pointer', color: '#856404', display: 'flex', alignItems: 'center', fontSize:'13px'}}>
                                <input type="radio" name="targetWmType" value="yatay" checked={this.targetWatermarkType() === 'yatay'} onchange={e => this.targetWatermarkType(e.target.value)} style={{marginRight: '5px'}} />
                                Yatay İmza
                            </label>
                            <label style={{cursor: 'pointer', color: '#856404', display: 'flex', alignItems: 'center', fontSize:'13px'}}>
                                <input type="radio" name="targetWmType" value="dikey" checked={this.targetWatermarkType() === 'dikey'} onchange={e => this.targetWatermarkType(e.target.value)} style={{marginRight: '5px'}} />
                                Dikey İmza
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
  }

  loadWatermarks() {
    app.request({
        method: 'GET', url: app.forum.attribute('apiUrl') + '/spotter-watermarks',
    }).then((response) => {
        const list = response.watermarks || [];
        list.forEach(wm => {
            const option = this.generateStyleFromFilename(wm);
            const n = wm.name.toLowerCase();
            if (wm.type === 'landscape') {
                if (option.label.includes('Kişisel')) this.horizontalPersonal = option;
                else if (n.includes('orta')) this.horizontalCenter.push(option);
                else this.horizontalCorner.push(option);
            } else {
                if (option.label.includes('Kişisel')) this.verticalPersonal = option;
                else this.verticalGeneral.push(option);
            }
        });
        
        const sortFunc = (a, b) => {
            const score = (id) => id.includes('beyaz') ? 1 : id.includes('siyah') ? 2 : 3;
            return score(a.id.toLowerCase()) - score(b.id.toLowerCase());
        };
        this.horizontalCenter.sort(sortFunc);
        this.horizontalCorner.sort(sortFunc);
        this.verticalGeneral.sort(sortFunc);

        this.loadingOptions = false;
        m.redraw();
    }).catch(err => { console.error(err); this.loadingOptions = false; m.redraw(); });
  }

  generateStyleFromFilename(wm) {
    const n = wm.name.toLowerCase();
    let s = { id: wm.name, label: wm.name, icon: 'fas fa-stamp', color: '#333', bg: '#f9f9f9', border: '#ddd', isPersonal: false };
    let c = ''; 
    if (n.includes('siyah')) { s.color = '#fff'; s.bg = '#333'; s.border = '#333'; c = 'Siyah'; }
    else if (n.includes('beyaz')) { s.color = '#333'; s.bg = '#fff'; s.border = '#ddd'; c = 'Beyaz'; }
    else if (n.includes('renkli') || n.includes('color')) { s.color = '#e74c3c'; s.bg = '#fff'; s.border = '#e74c3c'; c = 'Renkli'; }

    if (!n.includes('ulasimarsiv')) {
        s.label = 'Kişisel İmza'; s.icon = 'fas fa-signature'; s.bg = '#e3f2fd'; s.color = '#1565c0'; s.border = '#90caf9'; s.isPersonal = true;
    } else {
        const p = n.includes('kose') ? ' (Köşe)' : (n.includes('orta') ? ' (Orta)' : '');
        s.label = `${c || 'Standart'} İmza${p}`;
    }
    return s;
  }

  handleSearchInput(e) {
      const q = e.target.value;
      this.targetUsername(q); 
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      if (q.length < 3) { this.userSearchResults = []; m.redraw(); return; }
      this.searchTimeout = setTimeout(() => {
          this.isSearching = true; m.redraw();
          app.store.find('users', { filter: { q }, page: { limit: 5 } }).then(u => { this.userSearchResults = u; this.isSearching = false; m.redraw(); });
      }, 300);
  }

  selectUser(user) { this.targetUsername(user.username()); this.userSearchResults = []; m.redraw(); }
  selectWatermark(id) { this.selections[this.activeIndex] = id; }
  
  applyToAll(id) { 
      this.selections.fill(id); 
      app.alerts.show({ type: 'success' }, 'Tümüne uygulandı.'); 
  }

  confirmUpload() {
    if (this.onconfirm) this.onconfirm({
        selections: this.selections,
        customFileNames: this.customFileNames, 
        targetUsername: this.targetUsername(), 
        targetWatermarkType: this.targetWatermarkType()
    });
    this.hide();
  }
}