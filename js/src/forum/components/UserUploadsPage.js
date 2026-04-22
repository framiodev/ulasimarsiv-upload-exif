import UserPage from 'flarum/forum/components/UserPage';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import icon from 'flarum/common/helpers/icon';
import app from 'flarum/forum/app';

export default class UserUploadsPage extends UserPage {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = true;
    this.images = [];
    
    // LIGHTBOX İÇİN GEREKLİ DEĞİŞKENLER
    this.lightboxOpen = false;
    this.currentIndex = 0;

    // Kullanıcıyı yükle
    this.loadUser(m.route.param('username'));
  }

  // KLAVYE KONTROLLERİ
  oncreate(vnode) {
    super.oncreate(vnode);
    this.boundHandleKeydown = this.handleKeydown.bind(this);
    document.addEventListener('keydown', this.boundHandleKeydown);
  }

  onremove(vnode) {
    super.onremove(vnode);
    document.removeEventListener('keydown', this.boundHandleKeydown);
  }

  handleKeydown(e) {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape') this.closeLightbox();
    if (e.key === 'ArrowLeft') this.prevImage(e);
    if (e.key === 'ArrowRight') this.nextImage(e);
  }

  show(user) {
    super.show(user);
    this.loadImages(user.id());
  }

  loadImages(userId) {
    this.loading = true;
    m.redraw();

    app.request({
      method: 'GET',
      url: app.forum.attribute('apiUrl') + '/ulasimarsiv-images',
      params: { filter: { user: userId } }
    }).then(response => {
      this.images = response.data || [];
      this.loading = false;
      m.redraw();
    });
  }

  getImageUrl(imageItem) {
    if (!imageItem) return '';
    const attr = imageItem.attributes || imageItem;
    return attr.path || attr.url || attr.thumb_path || '';
  }

  // --- LIGHTBOX ---

  openLightbox(index) {
    this.currentIndex = index;
    this.lightboxOpen = true;
    m.redraw();
  }

  closeLightbox() {
    this.lightboxOpen = false;
    m.redraw();
  }

  nextImage(e) {
    if(e) e.stopPropagation();
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    m.redraw();
  }

  prevImage(e) {
    if(e) e.stopPropagation();
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    m.redraw();
  }

  openOriginal(url) {
    if (url) window.open(url, '_blank');
  }

  content() {
    return (
      <div className="UserUploads">
        
        {/* --- YENİ BAŞLIK ALANI --- */}
        <div className="UserUploads-header" style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #e8e8e8' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                {icon('fas fa-photo-video', {style: 'margin-right:8px; color: #666'})}
                Kullanıcı Medyası
            </h3>
        </div>

        {/* GALERİ GRID ALANI */}
        <div className="Spotter-Gallery-Grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
          
          {this.loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                <LoadingIndicator />
            </div>
          ) : this.images.length === 0 ? (
            <div className="Placeholder" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#777' }}>
              <p>{icon('fas fa-camera-retro', {style: 'font-size:40px; margin-bottom:10px; display:block;'})}</p>
              <p>Henüz hiç fotoğraf yüklenmemiş.</p>
            </div>
          ) : (
            this.images.map((image, index) => {
                const imgSrc = this.getImageUrl(image);
                const attr = image.attributes || image;

                return (
                  <div 
                    className="Spotter-Gallery-Item" 
                    style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', aspectRatio: '16/9', cursor: 'pointer' }}
                    onclick={() => this.openLightbox(index)}
                  >
                        <img 
                            src={imgSrc} 
                            alt={attr.filename} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            loading="lazy"
                        />
                        <div className="Spotter-Hover-Icon">
                            {icon('fas fa-expand-arrows-alt')}
                        </div>
                  </div>
                );
            })
          )}
        </div>

        {/* LIGHTBOX PENCERESİ */}
        {this.lightboxOpen && this.images[this.currentIndex] ? (
            <div className="Spotter-Lightbox-Overlay" onclick={() => this.closeLightbox()}>
                
                <div className="Spotter-Lightbox-Close">{icon('fas fa-times')}</div>

                <div className="Spotter-Lightbox-Container" onclick={(e) => e.stopPropagation()}>
                    <div className="Spotter-Nav Prev" onclick={(e) => this.prevImage(e)}>
                        {icon('fas fa-chevron-left')}
                    </div>

                    {(() => {
                        const currentItem = this.images[this.currentIndex];
                        const currentAttr = currentItem.attributes || currentItem;
                        const currentSrc = this.getImageUrl(currentItem);

                        return (
                            <div className="Spotter-Main-Image">
                                <img 
                                    src={currentSrc} 
                                    alt={currentAttr.filename}
                                    title="Orijinal boyutta açmak için tıklayın"
                                    onclick={() => this.openOriginal(currentSrc)}
                                />
                                <div className="Spotter-Image-Meta">
                                    <span>{this.currentIndex + 1} / {this.images.length}</span>
                                    <span>{currentAttr.filename}</span>
                                </div>
                            </div>
                        );
                    })()}

                    <div className="Spotter-Nav Next" onclick={(e) => this.nextImage(e)}>
                        {icon('fas fa-chevron-right')}
                    </div>
                </div>
            </div>
        ) : null}
      </div>
    );
  }
}