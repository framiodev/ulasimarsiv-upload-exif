import Component from 'flarum/common/Component';
import CommentPost from 'flarum/forum/components/CommentPost';
import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';

class SpotterImageCard extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.id = this.attrs.photoId;
    this.data = null;
    this.showExif = false;
    this.fetchExifData();
  }

  fetchExifData() {
    app.request({
      method: 'GET',
      url: app.forum.attribute('apiUrl') + '/spotter-image/' + this.id
    }).then(response => {
      this.data = response;
      m.redraw();
    });
  }

  formatDate(dateString) {
    if (!dateString) return '-';
    try {
        const parts = dateString.split(' '); 
        const datePart = parts[0].replace(/:/g, '-');
        const timePart = parts[1] || '';
        const [year, month, day] = datePart.split('-');
        return `${day}-${month}-${year} ${timePart}`;
    } catch (e) { return dateString; }
  }

  view() {
    if (!this.data) return null;

    const isAdmin = app.session.user && app.session.user.isAdmin();
    const settingValue = app.forum.attribute('ulasiminfo-upload-exif.show_exif_publicly');
    const showPublicly = settingValue === '1' || settingValue === true;
    const canSeeExif = showPublicly || isAdmin;

    const exif = JSON.parse(this.data.exif_data || '{}');
    const camera = `${exif.make || ''} ${exif.model || ''}`.trim() || 'Belirtilmemiş';
    let lens = exif.lens || 'Belirtilmemiş';
    if (lens !== 'Belirtilmemiş' && camera.includes(lens)) lens = '-';
    const aperture = exif.aperture || '-';
    const exposure = exif.exposure || '-';
    const iso = exif.iso || '-';
    const focal = exif.focal || '-';
    const formattedDate = this.formatDate(exif.date);

    return (
      <div className="SpotterCard-exif-wrapper">
        
        {/* DÜZELTİLMİŞ CSS: ARTIK ANA KAPSAYICIYA (RESİM DAHİL) BAKACAK */}
        <style>{`
            /* Ana kapsayıcıyı referans noktası yap */
            .spotter-image-container {
                position: relative !important;
                display: block;
            }
            
            /* Buton grubu varsayılan olarak gizli */
            .SpotterCard-overlay-controls {
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s ease, visibility 0.2s ease;
            }

            /* HİLE BURADA: Ana kapsayıcı (.spotter-image-container) hover olunca göster */
            /* Bu sayede resmin üzerine gelince de çalışır */
            .spotter-image-container:hover .SpotterCard-overlay-controls {
                opacity: 1;
                visibility: visible;
            }
        `}</style>

        {/* BUTON GRUBU */}
        <div className="SpotterCard-overlay-controls" 
             style={{
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '6px', 
                 position: 'absolute', 
                 top: '10px', 
                 right: '10px', 
                 zIndex: 900
             }}>
             
             {/* 1. BUTON: ORİJİNAL (Sadece Admin) */}
             {isAdmin && this.data.original_path ? (
                 <a href={this.data.original_path} 
                    target="_blank" 
                    className="SpotterCard-zoomIcon" 
                    style={{
                        position: 'relative',
                        display: 'inline-block',
                        backgroundColor: '#e67e22', 
                        color: '#fff', 
                        border: 'none',
                        textDecoration: 'none',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                        lineHeight: 'normal'
                    }}
                    title="İmzasız Orijinal Dosya">
                    <i className="fas fa-download" style={{marginRight: '4px'}}></i> Orijinal
                 </a>
             ) : null}

             {/* 2. BUTON: YÜKSEK KALİTE (Herkes) */}
             <a href={this.data.path} 
                target="_blank" 
                className="SpotterCard-zoomIcon" 
                style={{
                    position: 'relative',
                    display: 'inline-block',
                    backgroundColor: '#000', 
                    color: '#fff', 
                    border: 'none',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    lineHeight: 'normal'
                }}
                title="Yüksek Kalite (Watermarklı)">
                Yüksek Kalite
             </a>
        </div>

        {/* EXIF Toggle Butonu */}
        {canSeeExif ? (
            <div className="SpotterCard-toggle" onclick={() => this.showExif = !this.showExif}>
                <span className="toggle-label">
                    Fotoğraf Bilgileri (EXIF) 
                    {!showPublicly && isAdmin ? ' (Gizli - Sadece Admin)' : ''}
                </span>
                <i className={this.showExif ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>
            </div>
        ) : null}

        {/* EXIF İçeriği */}
        {this.showExif && canSeeExif ? (
            <div className="SpotterCard-exif fade-in">
                <div className="SpotterCard-grid">
                    <div className="sc-left-col">
                        <div className="gear-group"><div className="gear-label">Kamera</div><div className="gear-name">{camera}</div></div>
                        <div className="gear-group"><div className="gear-label">Lens</div><div className="lens-name">{lens}</div></div>
                    </div>
                    <div className="sc-right-col">
                        <div className="stat-box"><span>Enstantane</span><b>{exposure}</b></div>
                        <div className="stat-box"><span>Diyafram</span><b>{aperture}</b></div>
                        <div className="stat-box"><span>ISO</span><b>{iso}</b></div>
                        <div className="stat-box"><span>Odak Uzaklığı</span><b>{focal}</b></div>
                    </div>
                    <div className="sc-footer">
                        <div className="date-box"><span>Çekim Tarihi</span><b>{formattedDate}</b></div>
                        {exif.lat && exif.lon ? (<a href={`https://www.google.com/maps?q=${exif.lat},${exif.lon}`} target="_blank" className="map-btn">Haritada Gör</a>) : null}
                    </div>
                </div>
            </div>
        ) : null}
      </div>
    );
  }
}

export default {
  init: () => {
    const mountSpotterImages = function() {
      const postBody = this.element.querySelector('.Post-body');
      if (!postBody) return;

      const containers = postBody.querySelectorAll('.spotter-image-container');
      containers.forEach(el => {
        const id = el.getAttribute('data-id');
        const exifPlaceholder = el.querySelector('.spotter-exif-placeholder');
        el.classList.add('SpotterCard');
        if (exifPlaceholder && !exifPlaceholder.hasChildNodes()) {
            m.mount(exifPlaceholder, { view: () => m(SpotterImageCard, { photoId: id }) });
        }
      });

      const contentImages = postBody.querySelectorAll('img');
      contentImages.forEach(img => {
          if (!img.closest('.spotter-image-container') && 
              !img.classList.contains('emoji') && 
              !img.classList.contains('Avatar')) {
              
              img.classList.add('spotter-old-image');
              img.style.cssText = "display: block !important; width: 100% !important; margin: 0 !important; padding: 0 !important; border: none !important;";

              if (img.nextSibling && img.nextSibling.tagName === 'BR') {
                 img.nextSibling.style.display = 'none';
              }
              if (img.previousSibling && img.previousSibling.tagName === 'BR') {
                 img.previousSibling.style.display = 'none';
              }

              const parentP = img.closest('p');
              if (parentP) {
                  parentP.style.fontSize = "0";
                  parentP.style.lineHeight = "0";
                  parentP.style.margin = "0";
                  parentP.style.padding = "0";
                  
                  const nextEl = parentP.nextElementSibling;
                  if (nextEl && nextEl.tagName === 'P' && nextEl.querySelector('img')) {
                      parentP.style.marginBottom = "0";
                  }
                  
                  const prevEl = parentP.previousElementSibling;
                  if (prevEl && prevEl.tagName === 'P' && prevEl.querySelector('img')) {
                      parentP.style.marginTop = "0";
                  } else {
                      if (parentP.previousElementSibling) { 
                          parentP.style.marginTop = "10px"; 
                      }
                  }
              }
          }
      });
    };

    extend(CommentPost.prototype, 'oncreate', mountSpotterImages);
    extend(CommentPost.prototype, 'onupdate', mountSpotterImages);
  }
};