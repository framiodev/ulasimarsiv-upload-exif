/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/components/SpottersSettingsPage.js"
/*!******************************************************!*\
  !*** ./src/admin/components/SpottersSettingsPage.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SpottersSettingsPage)
/* harmony export */ });
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/components/ExtensionPage */ "flarum/admin/components/ExtensionPage");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/admin/utils/saveSettings */ "flarum/admin/utils/saveSettings");
/* harmony import */ var flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_4__);





class SpottersSettingsPage extends (flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_0___default()) {
  oninit(vnode) {
    super.oninit(vnode);
    this.searchQuery = '';
    this.images = [];
    this.originals = []; // Sadece orijinaller için liste
    this.isLoading = false;
    this.isLoadingOriginals = false;
    this.activeTab = 'general'; // Sekme durumu

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
    this.loadTaxonomy();
    this.taxonomy = [];
    this.newBrand = '';
    this.newModel = '';
    this.newVehicleType = 'bus';
    this.isSavingTaxonomy = false;
  }
  content() {
    return m("div", {
      className: "SpottersSettingsPage"
    }, m("div", {
      className: "container"
    }, m("div", {
      className: "SpottersSettings-tabs",
      style: {
        display: 'flex',
        gap: '10px',
        marginTop: '30px',
        marginBottom: '20px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '10px',
        flexWrap: 'wrap'
      }
    }, this.buildTab('general', 'Genel Yapılandırma', 'fas fa-cogs'), this.buildTab('visibility', 'Görünürlük', 'fas fa-eye'), this.buildTab('watermark', 'Filigran Yönetimi', 'fas fa-stamp'), this.buildTab('taxonomy', 'Marka & Model', 'fas fa-bus'), this.buildTab('media', 'Medya Yönetimi', 'fas fa-images')), m("div", {
      className: "SpottersSettings-content"
    }, this.activeTab === 'general' && this.renderGeneralTab(), this.activeTab === 'visibility' && this.renderVisibilityTab(), this.activeTab === 'watermark' && this.renderWatermarkTab(), this.activeTab === 'taxonomy' && this.renderTaxonomyTab(), this.activeTab === 'media' && this.renderMediaTab())));
  }
  buildTab(id, label, icon) {
    const isActive = this.activeTab === id;
    return m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button ".concat(isActive ? 'Button--primary' : 'Button--link'),
      icon: icon,
      onclick: () => {
        this.activeTab = id;
        m.redraw();
      }
    }, label);
  }
  renderGeneralTab() {
    return m("div", {
      className: "Form-group"
    }, m("h3", {
      className: "Settings-title"
    }, "Genel Yap\u0131land\u0131rma"), this.buildSettingComponent({
      type: 'number',
      setting: 'ulasimarsiv-upload-exif.resize_width',
      label: 'Maksimum Fotoğraf Genişliği (px)',
      placeholder: '3840'
    }), this.buildSettingComponent({
      type: 'number',
      setting: 'ulasimarsiv-upload-exif.compression_quality',
      label: 'Sıkıştırma Kalitesi (0-100)',
      placeholder: '90'
    }), this.buildSettingComponent({
      type: 'number',
      setting: 'ulasimarsiv-upload-exif.thumb_width',
      label: 'Thumbnail Genişliği',
      placeholder: '1024'
    }), this.buildSettingComponent({
      type: 'number',
      setting: 'ulasimarsiv-upload-exif.mini_width',
      label: 'Mini Galeri Genişliği',
      placeholder: '250'
    }), m("div", {
      className: "Form-group",
      style: {
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        border: '1px solid #e8e8e8'
      }
    }, m("h3", {
      className: "Settings-title",
      style: {
        color: '#800000',
        marginTop: 0
      }
    }, "Orijinal (\u0130mzas\u0131z) Foto\u011Fraf Ayarlar\u0131"), m("p", {
      className: "helpText"
    }, "Sadece y\xF6neticilerin g\xF6rebilece\u011Fi, imzas\u0131z yedeklenen foto\u011Fraflar i\xE7in ge\xE7erlidir. Bo\u015F b\u0131rak\u0131rsan\u0131z cihazdaki orijinal haliyle y\xFCklenir."), this.buildSettingComponent({
      type: 'number',
      setting: 'ulasimarsiv-upload-exif.original_resize_width',
      label: 'Orijinal Maksimum Genişlik (Opsiyonel)',
      placeholder: 'Sınırsız (Boş Bırakın)'
    }), this.buildSettingComponent({
      type: 'number',
      setting: 'ulasimarsiv-upload-exif.original_compression_quality',
      label: 'Orijinal Sıkıştırma Kalitesi (0-100)',
      placeholder: '100 (Kayıpsız)'
    })), m("div", {
      className: "Form-group",
      style: {
        marginTop: '30px'
      }
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--primary",
      onclick: this.save.bind(this)
    }, "Ayarlar\u0131 Kaydet")));
  }
  renderVisibilityTab() {
    return m("div", {
      className: "Form-group"
    }, m("h3", {
      className: "Settings-title"
    }, "G\xF6r\xFCn\xFCrl\xFCk"), this.buildSettingComponent({
      type: 'boolean',
      setting: 'ulasimarsiv-upload-exif.show_exif_publicly',
      label: 'EXIF Bilgilerini Herkese Göster',
      help: 'Aktif edilirse ziyaretçiler ve üyeler kamera bilgilerini görebilir. Pasifse sadece admin görür.'
    }), m("div", {
      className: "Form-group",
      style: {
        marginTop: '30px'
      }
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--primary",
      onclick: this.save.bind(this)
    }, "Ayarlar\u0131 Kaydet")));
  }
  renderWatermarkTab() {
    return m("div", {
      className: "WatermarkManager-section"
    }, m("h3", {
      className: "Settings-title",
      style: {
        color: '#800000'
      }
    }, m("i", {
      className: "fas fa-stamp",
      style: {
        marginRight: '10px'
      }
    }), "Filigran (Watermark) Y\xF6netimi"), m("p", {
      className: "helpText"
    }, "Kullan\u0131c\u0131lara \xF6zel yatay veya dikey imzalar\u0131 buradan y\xFCkleyebilirsiniz. Sistem otomatik olarak klas\xF6r a\xE7\u0131p do\u011Fru isimlendirmeyi (\xF6rn: ", m("code", null, "alikaankaya_yatay_wm.png"), ") yapacakt\u0131r. Sadece ", m("strong", null, ".png"), " format\u0131 desteklenir."), m("div", {
      style: {
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        background: '#f9f9f9',
        padding: '15px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }
    }, m("input", {
      className: "FormControl",
      type: "text",
      placeholder: "Kullan\u0131c\u0131 Ad\u0131 (\xD6rn: alikaankaya)",
      value: this.newWmUsername,
      oninput: e => this.newWmUsername = e.target.value,
      style: {
        width: '200px'
      }
    }), m("select", {
      className: "FormControl",
      value: this.newWmType,
      onchange: e => this.newWmType = e.target.value,
      style: {
        width: '120px'
      }
    }, m("option", {
      value: "yatay"
    }, "Yatay"), m("option", {
      value: "dikey"
    }, "Dikey")), m("input", {
      type: "file",
      accept: "image/png",
      onchange: e => this.newWmFile = e.target.files[0]
    }), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--primary",
      icon: "fas fa-upload",
      loading: this.isUploadingWm,
      onclick: () => this.uploadAdminWatermark(),
      disabled: !this.newWmUsername || !this.newWmFile
    }, "Y\xFCkle")), m("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '15px'
      }
    }, this.adminWatermarks.map(folder => m("div", {
      style: {
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '6px',
        overflow: 'hidden'
      }
    }, m("div", {
      style: {
        background: '#f5f6fa',
        padding: '10px',
        borderBottom: '1px solid #eee',
        fontWeight: 'bold'
      }
    }, m("i", {
      className: "fas fa-folder-open",
      style: {
        color: '#f39c12',
        marginRight: '8px'
      }
    }), folder.username), m("div", {
      style: {
        padding: '10px'
      }
    }, folder.watermarks.length === 0 ? m("span", {
      style: {
        color: '#999',
        fontSize: '12px'
      }
    }, "\u0130mza Yok") : null, folder.watermarks.map(wm => m("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        fontSize: '12px'
      }
    }, m("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflow: 'hidden'
      }
    }, m("div", {
      style: {
        width: '30px',
        height: '20px',
        background: '#eee',
        borderRadius: '3px',
        overflow: 'hidden',
        flexShrink: 0
      }
    }, m("img", {
      src: flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('baseUrl') + wm.url,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }
    })), m("span", {
      title: wm.filename,
      style: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, wm.type === 'yatay' ? m("strong", {
      style: {
        color: '#3498db'
      }
    }, "[Yatay]") : wm.type === 'dikey' ? m("strong", {
      style: {
        color: '#e74c3c'
      }
    }, "[Dikey]") : '')), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--danger Button--icon",
      icon: "fas fa-times",
      onclick: () => this.deleteAdminWatermark(folder.username, wm.filename),
      style: {
        minWidth: '24px',
        height: '24px',
        padding: 0
      }
    }))))))), this.adminWatermarks.length === 0 && m("div", {
      style: {
        padding: '20px',
        textAlign: 'center',
        color: '#999'
      }
    }, "Hen\xFCz \xF6zel imza klas\xF6r\xFC bulunmuyor."));
  }
  renderTaxonomyTab() {
    // Markalara göre gruplayalım
    const grouped = {};
    this.taxonomy.forEach(item => {
      if (!grouped[item.brand]) grouped[item.brand] = [];
      grouped[item.brand].push(item);
    });
    return m("div", {
      className: "TaxonomyManager-section"
    }, m("h3", {
      className: "Settings-title",
      style: {
        color: '#800000'
      }
    }, m("i", {
      className: "fas fa-bus",
      style: {
        marginRight: '10px'
      }
    }), "Marka & Model Y\xF6netimi"), m("p", {
      className: "helpText"
    }, "Buradan ekledi\u011Finiz marka ve modeller, kullan\u0131c\u0131lar\u0131n foto\u011Fraf y\xFCkleme modal\u0131nda se\xE7im yapabilmesini sa\u011Flar."), m("div", {
      style: {
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        background: '#f9f9f9',
        padding: '15px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }
    }, m("input", {
      className: "FormControl",
      type: "text",
      placeholder: "Marka (\xD6rn: Mercedes-Benz)",
      value: this.newBrand,
      oninput: e => this.newBrand = e.target.value,
      style: {
        width: '200px'
      }
    }), m("input", {
      className: "FormControl",
      type: "text",
      placeholder: "Model (\xD6rn: Travego)",
      value: this.newModel,
      oninput: e => this.newModel = e.target.value,
      style: {
        width: '200px'
      }
    }), m("select", {
      className: "FormControl",
      value: this.newVehicleType,
      onchange: e => this.newVehicleType = e.target.value,
      style: {
        width: '120px'
      }
    }, m("option", {
      value: "bus"
    }, "Otob\xFCs"), m("option", {
      value: "truck"
    }, "Kamyon")), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--primary",
      icon: "fas fa-plus",
      loading: this.isSavingTaxonomy,
      onclick: () => this.saveTaxonomy(),
      disabled: !this.newBrand || !this.newModel
    }, "Ekle")), m("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }
    }, Object.keys(grouped).sort().map(brand => m("div", {
      style: {
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '6px',
        overflow: 'hidden'
      }
    }, m("div", {
      style: {
        background: '#f5f6fa',
        padding: '10px',
        borderBottom: '1px solid #eee',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between'
      }
    }, m("span", null, brand), m("span", {
      style: {
        fontSize: '11px',
        color: '#999'
      }
    }, grouped[brand].length, " Model")), m("div", {
      style: {
        padding: '10px'
      }
    }, grouped[brand].map(item => m("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px',
        padding: '5px',
        borderRadius: '4px',
        background: '#fcfcfc',
        border: '1px solid #f0f0f0'
      }
    }, m("span", {
      style: {
        fontSize: '13px'
      }
    }, item.model), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--link Button--icon",
      icon: "fas fa-trash-alt",
      onclick: () => this.deleteTaxonomy(item.id),
      style: {
        color: '#e74c3c'
      }
    }))))))), this.taxonomy.length === 0 && m("div", {
      style: {
        padding: '40px',
        textAlign: 'center',
        color: '#999'
      }
    }, "Hen\xFCz kay\u0131tl\u0131 marka/model bulunmuyor."));
  }
  renderMediaTab() {
    return m("div", null, m("div", {
      className: "MediaManager-section"
    }, m("div", {
      className: "MediaManager-header",
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }
    }, m("h3", {
      className: "Settings-title",
      style: {
        margin: 0
      }
    }, "T\xFCm Medya Y\xF6netimi"), m("div", {
      className: "MediaManager-search",
      style: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }
    }, m("input", {
      className: "FormControl",
      type: "text",
      placeholder: "Dosya ad\u0131 veya kullan\u0131c\u0131 ad\u0131 ile ara...",
      value: this.searchQuery,
      oninput: e => this.searchQuery = e.target.value,
      onkeydown: e => {
        if (e.key === 'Enter') this.performSearch();
      },
      style: {
        width: '300px'
      }
    }), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--primary",
      onclick: this.performSearch.bind(this)
    }, m("i", {
      className: "fas fa-search"
    })))), this.renderGrid(this.images, this.isLoading, false), this.renderPagination(this.images.length, false)), m("hr", {
      style: {
        margin: '40px 0'
      }
    }), m("div", {
      className: "MediaManager-section"
    }, m("h3", {
      className: "Settings-title",
      style: {
        color: '#800000'
      }
    }, m("i", {
      className: "fas fa-archive",
      style: {
        marginRight: '10px'
      }
    }), "Orijinal (\u0130mzas\u0131z) Medya Deposu"), m("p", {
      className: "helpText"
    }, "Burada sadece \"Orijinal\" yede\u011Fi bulunan foto\u011Fraflar listelenir. \"Yede\u011Fi Sil\" derseniz, forumdaki foto\u011Fraf (imzal\u0131) kal\u0131r, sadece yedek silinerek yer a\xE7\u0131l\u0131r."), this.renderGrid(this.originals, this.isLoadingOriginals, true), this.renderPagination(this.originals.length, true)));
  }

  // --- ORTAK RENDER FONKSİYONLARI ---

  renderGrid(list, loading, isOriginals) {
    if (loading) return m("div", {
      style: {
        textAlign: 'center',
        padding: '20px'
      }
    }, m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2___default()), null));
    if (list.length === 0) return m("div", {
      style: {
        textAlign: 'center',
        color: '#999',
        padding: '20px'
      }
    }, "Kay\u0131t bulunamad\u0131.");
    return m("div", {
      className: "MediaManager-grid",
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '10px',
        marginBottom: '20px'
      }
    }, list.map(image => {
      // Eğer Orijinal bölümündeysek ve orijinal link varsa onu göster, yoksa thumb
      const thumbUrl = isOriginals && image.attributes.original_path ? image.attributes.original_path : image.attributes.thumb_path || image.attributes.url;
      return m("div", {
        className: "MediaManager-card",
        style: {
          background: '#fff',
          border: isOriginals ? '1px solid #e67e22' : '1px solid #ddd',
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }
      }, m("div", {
        style: {
          height: '110px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid #eee'
        }
      }, m("a", {
        href: image.attributes.url,
        target: "_blank",
        style: {
          width: '100%',
          height: '100%'
        }
      }, m("img", {
        src: thumbUrl,
        loading: "lazy",
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }
      }))), m("div", {
        style: {
          padding: '8px',
          fontSize: '11px',
          flexGrow: 1
        }
      }, m("div", {
        title: image.attributes.filename,
        style: {
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: '3px'
        }
      }, image.attributes.filename), m("div", {
        style: {
          color: '#666'
        }
      }, image.attributes.username)), m("div", {
        style: {
          padding: '5px',
          background: '#fafafa',
          borderTop: '1px solid #eee'
        }
      }, isOriginals ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
        className: "Button Button--block Button--small",
        style: {
          backgroundColor: '#e67e22',
          color: 'white'
        },
        onclick: () => this.deleteOriginalOnly(image)
      }, "Yede\u011Fi Sil") : m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
        className: "Button Button--danger Button--block Button--small",
        icon: "fas fa-trash-alt",
        onclick: () => this.deleteImage(image)
      }, "Tamamen Sil")));
    }));
  }
  renderPagination(count, isOriginals) {
    const offset = isOriginals ? this.offsetOrig : this.offset;
    const label = count > 0 ? "".concat(offset + 1, " - ").concat(offset + count) : '0';
    return m("div", {
      className: "MediaManager-footer",
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        alignItems: 'center',
        paddingBottom: '30px'
      }
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button",
      icon: "fas fa-chevron-left",
      disabled: offset === 0,
      onclick: () => this.changePage(-1, isOriginals)
    }, "\xD6nceki"), m("span", {
      style: {
        fontWeight: 'bold',
        color: '#666'
      }
    }, label), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button",
      icon: "fas fa-chevron-right",
      disabled: count < this.limit,
      onclick: () => this.changePage(1, isOriginals)
    }, "Sonraki"));
  }

  // --- FONKSİYONLAR ---

  save() {
    flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_4___default()(this.settings).then(() => flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show({
      type: 'success'
    }, 'Ayarlar kaydedildi.'));
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
    this.isLoading = true;
    m.redraw();
    const params = {
      page: {
        offset: this.offset,
        limit: this.limit
      }
    };
    if (this.searchQuery) params.filter = {
      q: this.searchQuery
    };
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'GET',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-images/all',
      params: params
    }).then(result => {
      this.processResults(result, false);
    });
  }

  // --- ADMIN WATERMARK METOTLARI ---
  loadAdminWatermarks() {
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'GET',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-admin-watermarks'
    }).then(result => {
      this.adminWatermarks = result.data || [];
      m.redraw();
    });
  }
  loadTaxonomy() {
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'GET',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-taxonomy'
    }).then(result => {
      this.taxonomy = result.data || [];
      m.redraw();
    });
  }
  saveTaxonomy() {
    if (!this.newBrand || !this.newModel) return;
    this.isSavingTaxonomy = true;
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'POST',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-taxonomy',
      body: {
        brand: this.newBrand,
        model: this.newModel,
        type: this.newVehicleType
      }
    }).then(res => {
      this.newModel = ''; // Sadece modeli temizle ki aynı markaya seri ekleme kolay olsun
      this.isSavingTaxonomy = false;
      this.loadTaxonomy();
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show({
        type: 'success'
      }, 'Kaydedildi.');
    });
  }
  deleteTaxonomy(id) {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'POST',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-taxonomy',
      body: {
        action: 'delete',
        id
      }
    }).then(() => {
      this.loadTaxonomy();
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show({
        type: 'success'
      }, 'Silindi.');
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
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'POST',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-admin-watermarks',
      serialize: raw => raw,
      body: data
    }).then(res => {
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show({
        type: 'success'
      }, res.message);
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
    if (!confirm("".concat(username, " kullan\u0131c\u0131s\u0131n\u0131n ").concat(filename, " imzas\u0131n\u0131 silmek istedi\u011Finize emin misiniz?"))) return;
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'POST',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-admin-watermarks-delete',
      body: {
        username,
        filename
      }
    }).then(res => {
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show({
        type: 'success'
      }, 'İmza silindi.');
      this.loadAdminWatermarks();
    });
  }

  // SADECE ORİJİNALLER (YENİ)
  loadOriginals() {
    this.isLoadingOriginals = true;
    m.redraw();
    const params = {
      page: {
        offset: this.offsetOrig,
        limit: this.limit
      },
      filter: {
        has_original: 1
      } // Backend'deki filtreyi tetikler
    };
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'GET',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-images/all',
      params: params
    }).then(result => {
      this.processResults(result, true);
    });
  }
  processResults(result, isOriginals) {
    const users = {};
    if (result.included) result.included.forEach(r => {
      if (r.type === 'users') users[r.id] = r.attributes;
    });
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
    if (!confirm("".concat(image.attributes.filename, " dosyas\u0131n\u0131 TAMAMEN (Forumdan da) silmek istedi\u011Finize emin misiniz?"))) return;
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'DELETE',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-image/' + image.id
    }).then(() => {
      this.images = this.images.filter(i => i.id !== image.id);
      this.originals = this.originals.filter(i => i.id !== image.id); // Orijinallerden de düş
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show({
        type: 'success'
      }, 'Görsel tamamen silindi.');
      m.redraw();
    });
  }

  // YENİ: SADECE ORİJİNALİ SİLME
  deleteOriginalOnly(image) {
    if (!confirm("Sadece yede\u011Fi silip forumdaki g\xF6rseli korumak istiyor musunuz?")) return;

    // Target parametresi ile backend'e "sadece orijinali sil" diyoruz
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'DELETE',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-image/' + image.id,
      params: {
        target: 'original'
      }
    }).then(() => {
      // Listeden kaldırmak yerine sadece original_path'i null yapıp listeden atabiliriz
      this.originals = this.originals.filter(i => i.id !== image.id);
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show({
        type: 'success'
      }, 'Orijinal yedek silindi, yer açıldı.');
      m.redraw();
    });
  }
}
flarum.reg.add('ulasimarsiv-upload-exif', 'admin/components/SpottersSettingsPage', SpottersSettingsPage);

/***/ },

/***/ "flarum/admin/app"
/*!******************************************************!*\
  !*** external "flarum.reg.get('core', 'admin/app')" ***!
  \******************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'admin/app');

/***/ },

/***/ "flarum/admin/components/ExtensionPage"
/*!***************************************************************************!*\
  !*** external "flarum.reg.get('core', 'admin/components/ExtensionPage')" ***!
  \***************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'admin/components/ExtensionPage');

/***/ },

/***/ "flarum/admin/utils/saveSettings"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'admin/utils/saveSettings')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'admin/utils/saveSettings');

/***/ },

/***/ "flarum/common/components/Button"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Button')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Button');

/***/ },

/***/ "flarum/common/components/LoadingIndicator"
/*!*******************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/LoadingIndicator')" ***!
  \*******************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/LoadingIndicator');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		flarum.reg._webpack_runtimes["ulasimarsiv-upload-exif"] ||= __webpack_require__;// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_SpottersSettingsPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/SpottersSettingsPage */ "./src/admin/components/SpottersSettingsPage.js");


flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('ulasimarsiv/upload-exif', () => {
  if ((flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().registry)) {
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().registry.for('ulasimarsiv-upload-exif').registerPage(_components_SpottersSettingsPage__WEBPACK_IMPORTED_MODULE_1__["default"]);
  } else if ((flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().extensionData)) {
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().extensionData.for('ulasimarsiv-upload-exif').registerPage(_components_SpottersSettingsPage__WEBPACK_IMPORTED_MODULE_1__["default"]);
  }
});
})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=admin.js.map