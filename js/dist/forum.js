/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/forum/components/AttributeModal.js"
/*!************************************************!*\
  !*** ./src/forum/components/AttributeModal.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AttributeModal)
/* harmony export */ });
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__);




class AttributeModal extends (flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0___default()) {
  oninit(vnode) {
    super.oninit(vnode);
    const initial = this.attrs.initialValues || {};
    this.company = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()(initial.company || '');
    this.plate = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()(initial.plate || '');
    this.brand = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()(initial.brand || '');
    this.model = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()(initial.model || '');
    this.location = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()(initial.location || '');
    this.year = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()(initial.year || '');
    this.taxonomy = [];
    this.availableModels = [];
    this.loadTaxonomy();
    this.onsubmitCallback = this.attrs.onsubmit;
    this.onskipCallback = this.attrs.onskip;
    this.onInfoCallback = this.attrs.onInfo;
  }
  loadTaxonomy() {
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'GET',
      url: flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-taxonomy'
    }).then(result => {
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
    return m("div", {
      className: "Modal-body"
    }, m("div", {
      className: "Form-group"
    }, m("p", {
      className: "helpText",
      style: "margin-bottom: 25px; font-size: 14px; color: #666; text-align: center;"
    }, "Foto\u011Fraflar arka planda y\xFCkleniyor. L\xFCtfen ara\xE7 bilgilerini giriniz.", m("br", null), m("i", {
      style: "font-size: 12px; color: #999;"
    }, "(Bo\u015F b\u0131rak\u0131lan alanlar \u015Fablonda g\xF6sterilmez)")), m("div", {
      style: "display: flex; gap: 20px; margin-bottom: 15px;"
    }, m("div", {
      style: "flex: 1;"
    }, m("label", {
      style: labelStyle
    }, "Firma \u0130smi (\xD6rn: Kamil Ko\xE7)"), m("input", {
      className: "FormControl",
      bidi: this.company
    })), m("div", {
      style: "flex: 1;"
    }, m("label", {
      style: labelStyle
    }, "Plaka (\xD6rn: 34 ABC 12)"), m("input", {
      className: "FormControl",
      bidi: this.plate
    }))), m("div", {
      style: "display: flex; gap: 20px; margin-bottom: 15px;"
    }, m("div", {
      style: "flex: 1;"
    }, m("label", {
      style: labelStyle
    }, "Marka Se\xE7iniz"), m("select", {
      className: "FormControl",
      value: this.brand(),
      onchange: e => {
        this.brand(e.target.value);
        this.model(''); // Marka değişince modeli sıfırla
        this.updateModels(e.target.value);
      }
    }, m("option", {
      value: ""
    }, "-- Marka Se\xE7 --"), brands.map(b => m("option", {
      value: b
    }, b)), m("option", {
      value: "Di\u011Fer"
    }, "Di\u011Fer"))), m("div", {
      style: "flex: 1;"
    }, m("label", {
      style: labelStyle
    }, "Model Se\xE7iniz"), this.brand() === 'Diğer' ? m("input", {
      className: "FormControl",
      bidi: this.model,
      placeholder: "Modeli el ile yaz\u0131n..."
    }) : m("select", {
      className: "FormControl",
      value: this.model(),
      onchange: e => this.model(e.target.value),
      disabled: !this.brand()
    }, m("option", {
      value: ""
    }, "-- Model Se\xE7 --"), this.availableModels.map(m => m("option", {
      value: m.model
    }, m.model))))), m("div", {
      style: "display: flex; gap: 20px; margin-bottom: 30px;"
    }, m("div", {
      style: "flex: 1;"
    }, m("label", {
      style: labelStyle
    }, "\xC7ekim Yeri (\xD6rn: \u0130stanbul)"), m("input", {
      className: "FormControl",
      bidi: this.location
    })), m("div", {
      style: "flex: 1;"
    }, m("label", {
      style: labelStyle
    }, "Y\u0131l (\xD6rn: 2025)"), m("input", {
      className: "FormControl",
      type: "number",
      bidi: this.year
    }))), m("div", {
      className: "Form-group",
      style: "display: flex; justify-content: space-between; align-items: center;"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--primary",
      style: "background-color: #3498db; border-color: #3498db;",
      icon: "fas fa-info-circle",
      onclick: this.goToInfo.bind(this)
    }, "Info Ekle"), m("div", {
      style: "display: flex; gap: 10px;"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--text",
      onclick: this.skip.bind(this)
    }, "K\xFCnye Ekleme"), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--primary",
      onclick: this.submit.bind(this)
    }, "Bilgileri Onayla")))));
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
    if (firmVal && plateVal) line1 = "".concat(firmVal, " | ").concat(plateVal);else if (firmVal) line1 = firmVal;else if (plateVal) line1 = plateVal;
    if (line1) lines.push("- **".concat(line1, "**"));
    const brandVal = this.brand();
    const modelVal = this.model();
    let line2 = '';
    if (brandVal && modelVal) line2 = "".concat(brandVal, " ").concat(modelVal);else if (brandVal) line2 = brandVal;else if (modelVal) line2 = modelVal;
    if (line2) lines.push("- **".concat(line2, "**"));
    const locVal = this.location();
    let yearVal = this.year();
    if (yearVal) yearVal = "'" + yearVal.toString().slice(-2);
    let line3 = '';
    if (locVal && yearVal) line3 = "".concat(locVal, " / ").concat(yearVal);else if (locVal) line3 = locVal;else if (yearVal) line3 = yearVal;
    if (line3) lines.push("- **".concat(line3, "**"));
    return lines.length > 0 ? lines.join('\n') : null;
  }
  submit(e) {
    e.preventDefault();
    const resultText = this.prepareData();
    if (this.onsubmitCallback) this.onsubmitCallback(resultText);
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().modal.close();
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
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().modal.close();
  }
}
flarum.reg.add('ulasimarsiv-upload-exif', 'forum/components/AttributeModal', AttributeModal);

/***/ },

/***/ "./src/forum/components/GalleryButton.js"
/*!***********************************************!*\
  !*** ./src/forum/components/GalleryButton.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GalleryButton)
/* harmony export */ });
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Icon */ "flarum/common/components/Icon");
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Tooltip */ "flarum/common/components/Tooltip");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _GalleryModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GalleryModal */ "./src/forum/components/GalleryModal.js");





class GalleryButton extends (flarum_common_Component__WEBPACK_IMPORTED_MODULE_0___default()) {
  view() {
    return m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_2___default()), {
      text: "Y\xFCklemelerim (Galeri)"
    }, m("button", {
      className: "Button Button--icon Button--link hasIcon",
      type: "button",
      onclick: () => flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().modal.show(_GalleryModal__WEBPACK_IMPORTED_MODULE_4__["default"], {
        editor: this.attrs.editor
      })
    }, m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_1___default()), {
      name: "fas fa-images"
    }), m("span", {
      className: "Button-label"
    }, "Galeri")));
  }
}
flarum.reg.add('ulasimarsiv-upload-exif', 'forum/components/GalleryButton', GalleryButton);

/***/ },

/***/ "./src/forum/components/GalleryModal.js"
/*!**********************************************!*\
  !*** ./src/forum/components/GalleryModal.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GalleryModal)
/* harmony export */ });
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__);




class GalleryModal extends (flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0___default()) {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = true;
    this.images = [];
    this.editor = this.attrs.editor;
    this.loadImages();
  }
  className() {
    return 'GalleryModal Modal--large';
  }
  title() {
    return 'Medyalarım';
  }
  loadImages() {
    this.loading = true;
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'GET',
      url: flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-images/user'
    }).then(response => {
      // DEĞİŞİKLİK 1: SIRALAMA
      // ID'si büyük olan (yeni olan) en başa gelsin (b.id - a.id)
      this.images = response.sort((a, b) => b.id - a.id);
      this.loading = false;
      m.redraw();
    });
  }
  deleteImage(img, e) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Bu fotoğrafı kalıcı olarak silmek istiyor musunuz?')) return;
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'DELETE',
      url: flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-image/' + img.id
    }).then(() => {
      this.images = this.images.filter(i => i.id !== img.id);
      m.redraw();
    });
  }
  copyLink(img, e) {
    e.preventDefault();
    e.stopPropagation();
    const bbcode = "[ulasimarsiv-image id=".concat(img.id, " url=").concat(img.thumb_path, " alt=").concat(img.filename, "]");
    navigator.clipboard.writeText(bbcode).then(() => {
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show({
        type: 'success'
      }, 'BBCode kopyalandı!');
    });
  }
  insertImage(img) {
    let altText = img.filename.split('.').slice(0, -1).join('.');
    altText = altText.replace(/[-_]/g, ' ');
    const bbcode = "[ulasimarsiv-image id=".concat(img.id, " url=").concat(img.thumb_path, " alt=").concat(altText, "]");
    this.editor.insertAtCursor(bbcode + '\n');
    this.hide();
  }
  content() {
    return m("div", {
      className: "Modal-body"
    }, this.loading ? m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2___default()), null) : this.images.length === 0 ? m("div", {
      className: "Gallery-empty"
    }, m("i", {
      className: "fas fa-camera-retro",
      style: "font-size:48px; margin-bottom:20px; opacity:0.5"
    }), m("br", null), "Hen\xFCz hi\xE7 foto\u011Fraf y\xFCklemediniz.") : m("div", {
      className: "Gallery-grid"
    }, this.images.map(img => m("div", {
      className: "Gallery-item",
      onclick: () => this.insertImage(img)
    }, m("div", {
      className: "Gallery-image-wrapper"
    }, m("img", {
      src: img.mini_url || img.thumb_path,
      alt: img.filename,
      loading: "lazy",
      onerror: e => {
        e.target.onerror = null;
        e.target.src = img.thumb_path;
      }
    })), m("div", {
      className: "Gallery-actions"
    }, m("button", {
      className: "Button Button--icon Button--danger",
      type: "button",
      onclick: e => this.deleteImage(img, e),
      title: "Sil"
    }, m("i", {
      className: "fas fa-trash"
    })), m("span", {
      className: "Gallery-date",
      title: img.filename,
      style: "white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; display: inline-block; vertical-align: middle;"
    }, img.filename), m("button", {
      className: "Button Button--icon",
      type: "button",
      style: "color: #3498db",
      onclick: e => this.copyLink(img, e),
      title: "Kodu Kopyala"
    }, m("i", {
      className: "fas fa-copy"
    })))))));
  }
}
flarum.reg.add('ulasimarsiv-upload-exif', 'forum/components/GalleryModal', GalleryModal);

/***/ },

/***/ "./src/forum/components/InfoModal.js"
/*!*******************************************!*\
  !*** ./src/forum/components/InfoModal.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InfoModal)
/* harmony export */ });
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__);




class InfoModal extends (flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0___default()) {
  oninit(vnode) {
    super.oninit(vnode);
    this.infoText = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()('');
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
    return m("div", {
      className: "Modal-body"
    }, m("div", {
      className: "Rich-Toolbar",
      style: {
        display: 'flex',
        gap: '5px',
        padding: '5px',
        border: '1px solid #ddd',
        borderBottom: 'none',
        background: '#f9f9f9',
        borderRadius: '4px 4px 0 0',
        flexWrap: 'wrap'
      }
    }, this.renderButton('bold', 'fa fa-bold', 'Kalın'), this.renderButton('italic', 'fa fa-italic', 'İtalik'), this.renderButton('strikethrough', 'fa fa-strikethrough', 'Üstü Çizili'), m("div", {
      style: {
        width: '1px',
        background: '#ccc',
        margin: '0 5px'
      }
    }), this.renderButton('url', 'fa fa-link', 'Bağlantı'), this.renderButton('quote', 'fa fa-quote-right', 'Alıntı'), this.renderButton('code', 'fa fa-code', 'Kod'), m("div", {
      style: {
        width: '1px',
        background: '#ccc',
        margin: '0 5px'
      }
    }), this.renderButton('list', 'fa fa-list-ul', 'Madde İşareti'), this.renderButton('numlist', 'fa fa-list-ol', 'Numaralı Liste'), m("div", {
      style: {
        width: '1px',
        background: '#ccc',
        margin: '0 5px'
      }
    }), m("div", {
      className: "Toolbar-Item",
      style: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }
    }, m("label", {
      htmlFor: "txtColor",
      style: {
        margin: 0,
        cursor: 'pointer',
        padding: '5px'
      },
      title: "Metin Rengi"
    }, m("i", {
      className: "fa fa-palette"
    })), m("input", {
      type: "color",
      id: "txtColor",
      onchange: e => this.insertColor(e.target.value),
      style: {
        width: '20px',
        height: '20px',
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer'
      }
    }))), m("div", {
      className: "Form-group"
    }, m("textarea", {
      className: "FormControl",
      rows: "10",
      bidi: this.infoText,
      id: "infoTextArea",
      placeholder: "Detayl\u0131 bilgileri buraya girebilirsiniz...",
      style: {
        borderRadius: '0 0 4px 4px',
        fontFamily: 'monospace'
      }
    })), m("div", {
      className: "Form-group",
      style: "display: flex; justify-content: space-between; gap: 10px;"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--text",
      icon: "fas fa-arrow-left",
      onclick: this.back.bind(this)
    }, "K\xFCnye Ekran\u0131na D\xF6n"), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--primary",
      onclick: this.submit.bind(this)
    }, "Info'yu Tamamla ve Bitir")));
  }
  renderButton(type, iconClass, title) {
    return m("button", {
      className: "Button Button--icon Button--link",
      type: "button",
      title: title,
      onclick: () => this.formatText(type)
    }, m("i", {
      className: iconClass
    }));
  }
  formatText(type) {
    const textarea = document.getElementById('infoTextArea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = this.infoText();
    const selected = text.substring(start, end);
    let before = '';
    let after = '';
    switch (type) {
      case 'bold':
        before = '[b]';
        after = '[/b]';
        break;
      case 'italic':
        before = '[i]';
        after = '[/i]';
        break;
      case 'strikethrough':
        before = '[s]';
        after = '[/s]';
        break;
      case 'url':
        before = '[url]';
        after = '[/url]';
        break;
      case 'quote':
        before = '[quote]';
        after = '[/quote]';
        break;
      case 'code':
        before = '[code]';
        after = '[/code]';
        break;
      case 'list':
        before = '[list]\n[*]';
        after = '\n[/list]';
        break;
      case 'numlist':
        before = '[list=1]\n[*]';
        after = '\n[/list]';
        break;
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
    const before = "[color=".concat(colorHex, "]");
    const after = "[/color]";
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    this.infoText(newText);
  }
  submit(e) {
    e.preventDefault();
    if (this.onsubmitCallback) this.onsubmitCallback(this.infoText());
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().modal.close();
  }
  back(e) {
    e.preventDefault();
    // DÜZELTME: Sinyal gönder, modal kapanmaz.
    if (this.onbackCallback) this.onbackCallback();
  }
}
flarum.reg.add('ulasimarsiv-upload-exif', 'forum/components/InfoModal', InfoModal);

/***/ },

/***/ "./src/forum/components/SpotterImageManager.js"
/*!*****************************************************!*\
  !*** ./src/forum/components/SpotterImageManager.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/components/CommentPost */ "flarum/forum/components/CommentPost");
/* harmony import */ var flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__);




class SpotterImageCard extends (flarum_common_Component__WEBPACK_IMPORTED_MODULE_0___default()) {
  oninit(vnode) {
    super.oninit(vnode);
    this.id = this.attrs.photoId;
    this.data = null;
    this.showExif = false;
    this.fetchExifData();
  }
  fetchExifData() {
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'GET',
      url: flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-image/' + this.id
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
      return "".concat(day, "-").concat(month, "-").concat(year, " ").concat(timePart);
    } catch (e) {
      return dateString;
    }
  }
  view() {
    if (!this.data) return null;
    const isAdmin = (flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().session).user && flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().session.user.isAdmin();
    const settingValue = flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('ulasimarsiv-upload-exif.show_exif_publicly');
    const showPublicly = settingValue === '1' || settingValue === true;
    const canSeeExif = showPublicly || isAdmin;
    const exif = JSON.parse(this.data.exif_data || '{}');
    const camera = "".concat(exif.make || '', " ").concat(exif.model || '').trim() || 'Belirtilmemiş';
    let lens = exif.lens || 'Belirtilmemiş';
    if (lens !== 'Belirtilmemiş' && camera.includes(lens)) lens = '-';
    const aperture = exif.aperture || '-';
    const exposure = exif.exposure || '-';
    const iso = exif.iso || '-';
    const focal = exif.focal || '-';
    const formattedDate = this.formatDate(exif.date);
    return m("div", {
      className: "SpotterCard-exif-wrapper"
    }, m("style", null, "\n            /* Ana kapsay\u0131c\u0131y\u0131 referans noktas\u0131 yap */\n            .ulasimarsiv-image-container {\n                position: relative !important;\n                display: block;\n            }\n            \n            /* Buton grubu varsay\u0131lan olarak gizli */\n            .SpotterCard-overlay-controls {\n                opacity: 0;\n                visibility: hidden;\n                transition: opacity 0.2s ease, visibility 0.2s ease;\n            }\n\n            /* H\u0130LE BURADA: Ana kapsay\u0131c\u0131 (.ulasimarsiv-image-container) hover olunca g\xF6ster */\n            /* Bu sayede resmin \xFCzerine gelince de \xE7al\u0131\u015F\u0131r */\n            .ulasimarsiv-image-container:hover .SpotterCard-overlay-controls {\n                opacity: 1;\n                visibility: visible;\n            }\n        "), m("div", {
      className: "SpotterCard-overlay-controls",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 900
      }
    }, isAdmin && this.data.original_path ? m("a", {
      href: this.data.original_path,
      target: "_blank",
      className: "SpotterCard-zoomIcon",
      style: {
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
      },
      title: "\u0130mzas\u0131z Orijinal Dosya"
    }, m("i", {
      className: "fas fa-download",
      style: {
        marginRight: '4px'
      }
    }), " Orijinal") : null, m("a", {
      href: this.data.path,
      target: "_blank",
      className: "SpotterCard-zoomIcon",
      style: {
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
      },
      title: "Y\xFCksek Kalite (Watermarkl\u0131)"
    }, "Y\xFCksek Kalite")), canSeeExif ? m("div", {
      className: "SpotterCard-toggle",
      onclick: () => this.showExif = !this.showExif
    }, m("span", {
      className: "toggle-label"
    }, "Foto\u011Fraf Bilgileri (EXIF)", !showPublicly && isAdmin ? ' (Gizli - Sadece Admin)' : ''), m("i", {
      className: this.showExif ? "fas fa-chevron-up" : "fas fa-chevron-down"
    })) : null, this.showExif && canSeeExif ? m("div", {
      className: "SpotterCard-exif fade-in"
    }, m("div", {
      className: "SpotterCard-grid"
    }, m("div", {
      className: "sc-left-col"
    }, m("div", {
      className: "gear-group"
    }, m("div", {
      className: "gear-label"
    }, "Kamera"), m("div", {
      className: "gear-name"
    }, camera)), m("div", {
      className: "gear-group"
    }, m("div", {
      className: "gear-label"
    }, "Lens"), m("div", {
      className: "lens-name"
    }, lens))), m("div", {
      className: "sc-right-col"
    }, m("div", {
      className: "stat-box"
    }, m("span", null, "Enstantane"), m("b", null, exposure)), m("div", {
      className: "stat-box"
    }, m("span", null, "Diyafram"), m("b", null, aperture)), m("div", {
      className: "stat-box"
    }, m("span", null, "ISO"), m("b", null, iso)), m("div", {
      className: "stat-box"
    }, m("span", null, "Odak Uzakl\u0131\u011F\u0131"), m("b", null, focal))), m("div", {
      className: "sc-footer"
    }, m("div", {
      className: "date-box"
    }, m("span", null, "\xC7ekim Tarihi"), m("b", null, formattedDate)), exif.lat && exif.lon ? m("a", {
      href: "https://www.google.com/maps?q=".concat(exif.lat, ",").concat(exif.lon),
      target: "_blank",
      className: "map-btn"
    }, "Haritada G\xF6r") : null))) : null);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init: () => {
    const mountSpotterImages = function () {
      const postBody = this.element.querySelector('.Post-body');
      if (!postBody) return;
      const containers = postBody.querySelectorAll('.ulasimarsiv-image-container');
      containers.forEach(el => {
        const id = el.getAttribute('data-id');
        const exifPlaceholder = el.querySelector('.spotter-exif-placeholder');
        el.classList.add('SpotterCard');
        if (exifPlaceholder && !exifPlaceholder.hasChildNodes()) {
          m.mount(exifPlaceholder, {
            view: () => m(SpotterImageCard, {
              photoId: id
            })
          });
        }
      });
      const contentImages = postBody.querySelectorAll('img');
      contentImages.forEach(img => {
        if (!img.closest('.ulasimarsiv-image-container') && !img.classList.contains('emoji') && !img.classList.contains('Avatar')) {
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
    (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__.extend)((flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_1___default().prototype), 'oncreate', mountSpotterImages);
    (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__.extend)((flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_1___default().prototype), 'onupdate', mountSpotterImages);
  }
});

/***/ },

/***/ "./src/forum/components/UploadButton.js"
/*!**********************************************!*\
  !*** ./src/forum/components/UploadButton.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadButton)
/* harmony export */ });
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Icon */ "flarum/common/components/Icon");
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Tooltip */ "flarum/common/components/Tooltip");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _WatermarkModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WatermarkModal */ "./src/forum/components/WatermarkModal.js");
/* harmony import */ var _AttributeModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AttributeModal */ "./src/forum/components/AttributeModal.js");
/* harmony import */ var _InfoModal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./InfoModal */ "./src/forum/components/InfoModal.js");







class UploadButton extends (flarum_common_Component__WEBPACK_IMPORTED_MODULE_0___default()) {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = false;
  }
  view() {
    const buttonClasses = ['Button', 'spotter-upload-button', 'hasIcon', this.loading ? '' : 'Button--link Button--icon'].join(' ');
    return m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_3___default()), {
      text: this.loading ? '' : 'Fotoğraf Yükle'
    }, m("button", {
      className: buttonClasses,
      type: "button",
      onclick: () => !this.loading && this.element.querySelector('input').click()
    }, this.loading ? m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_1___default()), {
      name: "fas fa-spinner fa-spin"
    }) : m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_1___default()), {
      name: "fas fa-camera"
    }), m("span", {
      className: "Button-label"
    }, this.loading ? ' Yükleniyor...' : 'Fotoğraf Yükle'), m("input", {
      type: "file",
      multiple: true,
      accept: "image/*",
      style: "display:none",
      onchange: this.process.bind(this)
    })));
  }
  process(e) {
    const fileList = Array.from(e.target.files);
    if (fileList.length === 0) return;
    fileList.sort((a, b) => a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: 'base'
    }));
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().modal.show(_WatermarkModal__WEBPACK_IMPORTED_MODULE_4__["default"], {
      files: fileList,
      onconfirm: result => this.startUpload(fileList, result)
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
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().modal.show(_AttributeModal__WEBPACK_IMPORTED_MODULE_5__["default"], {
      initialValues: initialData,
      onsubmit: attributeText => {
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
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().modal.show(_InfoModal__WEBPACK_IMPORTED_MODULE_6__["default"], {
      onsubmit: infoText => {
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
          const quotedLines = lines.map(line => "> ".concat(line));

          // Satırları birleştir ve ana metne ekle
          textToInsert += quotedLines.join('\n') + '\n';
        } else {
          // Info yoksa sadece alt satıra geç
          textToInsert += '\n';
        }

        // Editöre yapıştır
        if (this.attrs.editor && typeof this.attrs.editor.insertAtCursor === 'function') {
          this.attrs.editor.insertAtCursor(textToInsert);
        } else if ((flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().composer) && (flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().composer).editor) {
          flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().composer.editor.insertAtCursor(textToInsert);
        }
      } else {
        flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().alerts.show({
          type: 'error'
        }, 'Yükleme başarısız oldu.');
      }
    }).catch(err => {
      console.error(err);
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().alerts.show({
        type: 'error'
      }, 'Bir hata oluştu.');
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
    let apiUrl = flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().forum.attribute('apiUrl');
    if (window.location.protocol === 'https:' && apiUrl.startsWith('http:')) apiUrl = apiUrl.replace(/^http:/, 'https:');
    return fetch(apiUrl + '/ulasimarsiv-upload', {
      method: 'POST',
      body: data,
      headers: {
        'X-CSRF-Token': (flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().session).csrfToken
      }
    }).then(response => {
      if (!response.ok) return response.text().then(text => {
        throw new Error(response.status);
      });
      return response.json();
    }).then(data => data.bbcode).catch(error => {
      console.warn('Yükleme hatası:', file.name, error);
      return null;
    });
  }
}
flarum.reg.add('ulasimarsiv-upload-exif', 'forum/components/UploadButton', UploadButton);

/***/ },

/***/ "./src/forum/components/UserUploadsPage.js"
/*!*************************************************!*\
  !*** ./src/forum/components/UserUploadsPage.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UserUploadsPage)
/* harmony export */ });
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/components/UserPage */ "flarum/forum/components/UserPage");
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Icon */ "flarum/common/components/Icon");
/* harmony import */ var flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__);




class UserUploadsPage extends (flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_0___default()) {
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
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().request({
      method: 'GET',
      url: flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/ulasimarsiv-images',
      params: {
        filter: {
          user: userId
        }
      }
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
    if (e) e.stopPropagation();
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    m.redraw();
  }
  prevImage(e) {
    if (e) e.stopPropagation();
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    m.redraw();
  }
  openOriginal(url) {
    if (url) window.open(url, '_blank');
  }
  content() {
    return m("div", {
      className: "UserUploads"
    }, m("div", {
      className: "UserUploads-header",
      style: {
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #e8e8e8'
      }
    }, m("h3", {
      style: {
        margin: 0,
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333'
      }
    }, m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_2___default()), {
      name: "fas fa-photo-video",
      style: {
        marginRight: '8px',
        color: '#666'
      }
    }), "Kullan\u0131c\u0131 Medyas\u0131")), m("div", {
      className: "Spotter-Gallery-Grid",
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '10px'
      }
    }, this.loading ? m("div", {
      style: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '20px'
      }
    }, m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_1___default()), null)) : this.images.length === 0 ? m("div", {
      className: "Placeholder",
      style: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '40px',
        color: '#777'
      }
    }, m("p", null, m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_2___default()), {
      name: "fas fa-camera-retro",
      style: {
        fontSize: '40px',
        marginBottom: '10px',
        display: 'block'
      }
    })), m("p", null, "Hen\xFCz hi\xE7 foto\u011Fraf y\xFCklenmemi\u015F.")) : this.images.map((image, index) => {
      const imgSrc = this.getImageUrl(image);
      const attr = image.attributes || image;
      return m("div", {
        className: "Spotter-Gallery-Item",
        style: {
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #ddd',
          aspectRatio: '16/9',
          cursor: 'pointer'
        },
        onclick: () => this.openLightbox(index)
      }, m("img", {
        src: imgSrc,
        alt: attr.filename,
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        },
        loading: "lazy"
      }), m("div", {
        className: "Spotter-Hover-Icon"
      }, m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_2___default()), {
        name: "fas fa-expand-arrows-alt"
      })));
    })), this.lightboxOpen && this.images[this.currentIndex] ? m("div", {
      className: "Spotter-Lightbox-Overlay",
      onclick: () => this.closeLightbox()
    }, m("div", {
      className: "Spotter-Lightbox-Close"
    }, m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_2___default()), {
      name: "fas fa-times"
    })), m("div", {
      className: "Spotter-Lightbox-Container",
      onclick: e => e.stopPropagation()
    }, m("div", {
      className: "Spotter-Nav Prev",
      onclick: e => this.prevImage(e)
    }, m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_2___default()), {
      name: "fas fa-chevron-left"
    })), (() => {
      const currentItem = this.images[this.currentIndex];
      const currentAttr = currentItem.attributes || currentItem;
      const currentSrc = this.getImageUrl(currentItem);
      return m("div", {
        className: "Spotter-Main-Image"
      }, m("img", {
        src: currentSrc,
        alt: currentAttr.filename,
        title: "Orijinal boyutta a\xE7mak i\xE7in t\u0131klay\u0131n",
        onclick: () => this.openOriginal(currentSrc)
      }), m("div", {
        className: "Spotter-Image-Meta"
      }, m("span", null, this.currentIndex + 1, " / ", this.images.length), m("span", null, currentAttr.filename)));
    })(), m("div", {
      className: "Spotter-Nav Next",
      onclick: e => this.nextImage(e)
    }, m((flarum_common_components_Icon__WEBPACK_IMPORTED_MODULE_2___default()), {
      name: "fas fa-chevron-right"
    })))) : null);
  }
}
flarum.reg.add('ulasimarsiv-upload-exif', 'forum/components/UserUploadsPage', UserUploadsPage);

/***/ },

/***/ "./src/forum/components/WatermarkModal.js"
/*!************************************************!*\
  !*** ./src/forum/components/WatermarkModal.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WatermarkModal)
/* harmony export */ });
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Avatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Avatar */ "flarum/common/components/Avatar");
/* harmony import */ var flarum_common_components_Avatar__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Avatar__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_4__);






// --- CSS STİLLERİ ---
const CUSTOM_CSS = "\n    /* Ba\u015Fl\u0131k */\n    .WatermarkModal .Modal-header { padding: 12px 20px; border-bottom: 1px solid #eee; }\n    .WatermarkModal .Modal-title { font-size: 1.1em; font-weight: 600; }\n    \n    /* \xD6nizleme Alan\u0131 */\n    .Watermark-preview-area { background: transparent !important; padding: 0 !important; box-shadow: none !important; }\n    \n    /* Ortak Hizalama Kapsay\u0131c\u0131s\u0131 */\n    .Preview-Wrapper {\n        width: 100%;\n        max-width: 400px; /* Foto\u011Fraf ve input buraya s\u0131\u011Facak */\n        margin: 0 auto;\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n    }\n\n    /* Butonlar */\n    .Watermark-option {\n        cursor: pointer;\n        border-radius: 5px;\n        transition: all 0.15s ease;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        min-height: 40px;\n        font-size: 12px;\n        font-weight: 500;\n        user-select: none;\n        position: relative;\n        border: 1px solid #ddd;\n    }\n    .Watermark-option:hover { transform: translateY(-1px); box-shadow: 0 2px 6px rgba(0,0,0,0.08); }\n    \n    /* SE\xC7\u0130L\u0130 DURUM (KALIN KONTUR) */\n    .Watermark-option.active { \n        border: 2px solid !important;\n        font-weight: 700;\n        box-shadow: 0 0 0 1px rgba(0,0,0,0.05);\n    }\n\n    /* Ba\u015Fl\u0131k Yan\u0131ndaki \"T\xFCm\xFCne Uygula\" Butonu */\n    .Header-Apply-Btn {\n        background: #e67e22; color: white; border: none; padding: 4px 10px;\n        border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer;\n        display: flex; align-items: center; gap: 5px; margin-left: auto;\n    }\n    .Header-Apply-Btn:hover { background: #d35400; }\n\n    /* Grup Ba\u015Fl\u0131klar\u0131 */\n    .Group-Header-Row {\n        display: flex; align-items: center; justify-content: space-between;\n        border-bottom: 1px solid #f0f0f0; margin-bottom: 10px; padding-bottom: 5px;\n    }\n    .Group-Title {\n        font-size: 11px; text-transform: uppercase; color: #999;\n        font-weight: bold; margin: 0; display: flex; align-items: center; gap: 6px;\n    }\n\n    /* Gizli Men\xFC Butonu */\n    .Show-Other-Options-Btn {\n        background: transparent; border: 1px dashed #ccc; color: #666;\n        width: 100%; padding: 8px; font-size: 12px; cursor: pointer;\n        border-radius: 4px; margin-top: 10px; transition: all 0.2s;\n    }\n    .Show-Other-Options-Btn:hover { background: #f9f9f9; color: #333; border-color: #999; }\n\n    /* Animasyonlar */\n    .slide-in-right { animation: slideInRight 0.2s ease-out; }\n    .slide-in-left { animation: slideInLeft 0.2s ease-out; }\n    @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }\n    @keyframes slideInLeft { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }\n";
class WatermarkModal extends (flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_0___default()) {
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
    this.previewUrl = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()(null);
    this.currentImageOrientation = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()('landscape');
    this.showHiddenOptions = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()(false);
    this.hoveredOption = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()(null);

    // Admin
    this.targetUsername = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()('');
    this.targetWatermarkType = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_2___default()('yatay');
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
  className() {
    return 'WatermarkModal Modal--large';
  }
  title() {
    return "\u0130mza Se\xE7imi (".concat(this.activeIndex + 1, " / ").concat(this.files.length, ")");
  }
  content() {
    const isAdmin = (flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().session).user && flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().session.user.isAdmin();
    return m("div", {
      className: "Modal-body"
    }, this.renderPreviewArea(), m("div", {
      style: {
        color: '#e74c3c',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: '15px',
        fontSize: '11px',
        borderBottom: '1px solid #eee',
        paddingBottom: '8px'
      }
    }, "Crop yap\u0131lm\u0131\u015F foto\u011Fraflara filigran d\xFCzg\xFCn eklenemeyebilir. Bu tarz foto\u011Fraflarda l\xFCtfen bilgisayar\u0131n\u0131zdaki g\xF6rsel d\xFCzenleme ara\xE7lar\u0131n\u0131 kullan\u0131n\u0131z."), this.loadingOptions ? m("div", {
      style: {
        textAlign: 'center',
        padding: '20px'
      }
    }, m("i", {
      className: "fas fa-spinner fa-spin fa-2x"
    }), m("p", null, "\u0130mzalar y\xFCkleniyor...")) : this.renderFilteredOptions(), this.renderNoWatermarkOption(), isAdmin && this.renderAdminPanel(), m("div", {
      className: "Form-group",
      style: {
        marginTop: '20px'
      }
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      className: "Button Button--primary Button--block",
      onclick: this.confirmUpload.bind(this)
    }, this.files.length, " Foto\u011Fraf\u0131 Y\xFCkle")));
  }
  renderPreviewArea() {
    const currentSelectionId = this.selections[this.activeIndex];
    let baseUrl = flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().forum.attribute('baseUrl').replace(/\/$/, '');
    if (window.location.protocol === 'https:' && baseUrl.startsWith('http:')) baseUrl = baseUrl.replace(/^http:/, 'https:');
    const username = (flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().session).user ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().session.user.username() : '';
    const watermarkUrl = currentSelectionId !== 'none' ? baseUrl + '/assets/watermarks/' + username + '/' + encodeURIComponent(currentSelectionId) : '';
    return m("div", {
      className: "Watermark-preview-group",
      style: {
        marginBottom: '10px'
      }
    }, m("div", {
      className: "Preview-Wrapper"
    }, m("div", {
      className: "Watermark-preview-area",
      style: {
        textAlign: 'center',
        position: 'relative',
        minHeight: '160px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }
    }, this.previewUrl() ? m("div", {
      style: {
        position: 'relative',
        display: 'inline-block',
        maxWidth: '100%'
      }
    }, m("img", {
      src: this.previewUrl(),
      style: {
        maxWidth: '100%',
        maxHeight: '200px',
        display: 'block',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }
    }), currentSelectionId !== 'none' && m("img", {
      src: watermarkUrl,
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      },
      onerror: e => {
        e.target.style.display = 'none';
      }
    })) : m("div", {
      style: {
        color: '#666',
        padding: '20px'
      }
    }, m("i", {
      className: "fas fa-spinner fa-spin"
    }), " \xD6nizleme haz\u0131rlan\u0131yor..."), this.files.length > 1 && m("div", {
      style: {
        position: 'absolute',
        width: '100%',
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 5px',
        pointerEvents: 'none'
      }
    }, m("button", {
      className: "Button Button--icon Button--primary",
      type: "button",
      style: {
        pointerEvents: 'auto',
        opacity: this.activeIndex === 0 ? 0.3 : 1,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      },
      onclick: e => {
        e.preventDefault();
        e.stopPropagation();
        this.changeActiveImage(-1);
      },
      disabled: this.activeIndex === 0
    }, m("i", {
      className: "fas fa-chevron-left"
    })), m("button", {
      className: "Button Button--icon Button--primary",
      type: "button",
      style: {
        pointerEvents: 'auto',
        opacity: this.activeIndex === this.files.length - 1 ? 0.3 : 1,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      },
      onclick: e => {
        e.preventDefault();
        e.stopPropagation();
        this.changeActiveImage(1);
      },
      disabled: this.activeIndex === this.files.length - 1
    }, m("i", {
      className: "fas fa-chevron-right"
    }))), m("div", {
      style: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '9px'
      }
    }, this.activeIndex + 1, " / ", this.files.length)), m("div", {
      className: "FileName-Editor",
      style: {
        marginTop: '8px',
        width: '100%'
      }
    }, m("div", {
      className: "Form-group",
      style: {
        marginBottom: 0,
        display: 'flex',
        justifyContent: 'center'
      }
    }, m("div", {
      className: "input-group",
      style: {
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }
    }, m("span", {
      style: {
        marginRight: '8px',
        fontSize: '11px',
        color: '#666',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
      }
    }, "Dosya Ad\u0131:"), m("input", {
      className: "FormControl",
      type: "text",
      value: this.customFileNames[this.activeIndex],
      oninput: this.handleFileNameChange.bind(this),
      style: {
        textAlign: 'center',
        fontSize: '12px',
        height: '30px',
        flex: 1
      }
    }))))), " ");
  }
  renderFilteredOptions() {
    const isLandscape = this.currentImageOrientation() === 'landscape';
    const isPortrait = this.currentImageOrientation() === 'portrait';
    const showOthers = this.showHiddenOptions();
    return m("div", null, isLandscape && this.renderHorizontalGroup(true), isPortrait && this.renderVerticalGroup(true), m("button", {
      type: "button",
      className: "Show-Other-Options-Btn",
      onclick: this.toggleHiddenOptions.bind(this)
    }, showOthers ? 'Diğer Seçenekleri Gizle' : "Di\u011Fer (".concat(isLandscape ? 'Dikey' : 'Yatay', ") Se\xE7enekleri G\xF6ster"), m("i", {
      className: "fas fa-chevron-".concat(showOthers ? 'up' : 'down'),
      style: {
        marginLeft: '5px'
      }
    })), showOthers && m("div", {
      style: {
        marginTop: '15px',
        padding: '10px',
        background: '#f9f9f9',
        borderRadius: '6px',
        border: '1px solid #eee'
      }
    }, isLandscape ? this.renderVerticalGroup(false) : this.renderHorizontalGroup(false)));
  }
  renderHorizontalGroup(isPrimary) {
    var _this$horizontalPerso;
    const currentSelection = this.selections[this.activeIndex];
    const showApplyAll = this.files.length > 1;
    const isGroupActive = ((_this$horizontalPerso = this.horizontalPersonal) == null ? void 0 : _this$horizontalPerso.id) === currentSelection || this.horizontalCenter.some(o => o.id === currentSelection) || this.horizontalCorner.some(o => o.id === currentSelection);
    return m("div", {
      style: {
        marginBottom: isPrimary ? '0' : '10px'
      }
    }, m("div", {
      className: "Group-Header-Row"
    }, m("h4", {
      className: "Group-Title"
    }, m("i", {
      className: "fas fa-image"
    }), " Yatay Foto\u011Fraflar \u0130\xE7in"), showApplyAll && isGroupActive && m("button", {
      className: "Header-Apply-Btn",
      type: "button",
      onclick: e => {
        e.preventDefault();
        this.applyToAll(currentSelection);
      }
    }, m("i", {
      className: "fas fa-check-double"
    }), " Se\xE7imi T\xFCm\xFCne Uygula")), m("div", {
      className: "Watermark-layout-container",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }
    }, this.horizontalPersonal && m("div", {
      style: {
        width: '100%'
      }
    }, this.renderOption(this.horizontalPersonal)), this.horizontalCenter.length > 0 && m("div", {
      style: {
        display: 'flex',
        gap: '8px',
        width: '100%'
      }
    }, this.horizontalCenter.map(opt => m("div", {
      style: {
        flex: 1
      }
    }, this.renderOption(opt)))), this.horizontalCorner.length > 0 && m("div", {
      style: {
        display: 'flex',
        gap: '8px',
        width: '100%'
      }
    }, this.horizontalCorner.map(opt => m("div", {
      style: {
        flex: 1
      }
    }, this.renderOption(opt))))));
  }
  renderVerticalGroup(isPrimary) {
    var _this$verticalPersona;
    const currentSelection = this.selections[this.activeIndex];
    const showApplyAll = this.files.length > 1;
    const isGroupActive = ((_this$verticalPersona = this.verticalPersonal) == null ? void 0 : _this$verticalPersona.id) === currentSelection || this.verticalGeneral.some(o => o.id === currentSelection);
    return m("div", {
      style: {
        marginBottom: isPrimary ? '0' : '10px'
      }
    }, m("div", {
      className: "Group-Header-Row"
    }, m("h4", {
      className: "Group-Title"
    }, m("i", {
      className: "fas fa-portrait"
    }), " Dikey Foto\u011Fraflar \u0130\xE7in"), showApplyAll && isGroupActive && m("button", {
      className: "Header-Apply-Btn",
      type: "button",
      onclick: e => {
        e.preventDefault();
        this.applyToAll(currentSelection);
      }
    }, m("i", {
      className: "fas fa-check-double"
    }), " Se\xE7imi T\xFCm\xFCne Uygula")), m("div", {
      className: "Watermark-layout-container",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }
    }, this.verticalPersonal && m("div", {
      style: {
        width: '100%'
      }
    }, this.renderOption(this.verticalPersonal)), this.verticalGeneral.length > 0 && m("div", {
      style: {
        display: 'flex',
        gap: '8px',
        width: '100%'
      }
    }, this.verticalGeneral.map(opt => m("div", {
      style: {
        flex: 1
      }
    }, this.renderOption(opt))))));
  }
  renderOption(opt) {
    const isSelected = this.selections[this.activeIndex] === opt.id;
    const isHovered = this.hoveredOption() === opt.id;
    const style = {
      background: opt.bg,
      color: opt.color,
      borderColor: isSelected ? opt.color : opt.border
    };
    return m("div", {
      className: "Watermark-option ".concat(isSelected ? 'active' : ''),
      onclick: () => this.selectWatermark(opt.id),
      onmouseenter: () => this.hoveredOption(opt.id),
      onmouseleave: () => this.hoveredOption(null),
      style: style
    }, m("div", {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    }, m("i", {
      className: opt.icon,
      style: {
        marginRight: '6px',
        fontSize: '11px'
      }
    }), m("span", null, opt.label)));
  }
  renderNoWatermarkOption() {
    const isSelected = this.selections[this.activeIndex] === 'none';
    const isHovered = this.hoveredOption() === 'none';
    const showApplyAll = this.files.length > 1;
    return m("div", {
      style: {
        marginTop: '15px'
      }
    }, showApplyAll && m("div", {
      className: "Group-Header-Row",
      style: {
        borderBottom: 'none',
        marginBottom: '5px'
      }
    }, m("span", {
      style: {
        fontSize: '10px',
        color: '#999'
      }
    }, "\u0130mzas\u0131z Se\xE7enek"), isSelected && m("button", {
      className: "Header-Apply-Btn",
      style: {
        background: '#7f8c8d'
      },
      type: "button",
      onclick: e => {
        e.preventDefault();
        this.applyToAll('none');
      }
    }, m("i", {
      className: "fas fa-check-double"
    }), " \u0130ptali T\xFCm\xFCne Uygula")), m("div", {
      className: "Watermark-option full-width ".concat(isSelected ? 'active' : ''),
      onclick: () => this.selectWatermark('none'),
      onmouseenter: () => this.hoveredOption('none'),
      onmouseleave: () => this.hoveredOption(null),
      style: {
        background: '#eee',
        color: '#666',
        borderColor: isSelected ? '#e74c3c' : '#ddd'
      }
    }, m("i", {
      className: "fas fa-ban",
      style: {
        marginRight: '8px'
      }
    }), m("span", null, "\u0130mza Ekleme (Orijinal Kals\u0131n)")));
  }
  renderAdminPanel() {
    const isActive = this.selections[this.activeIndex] === 'admin_override';
    return m("div", null, m("div", {
      className: "Watermark-option full-width ".concat(isActive ? 'active' : ''),
      onclick: () => this.selectWatermark('admin_override'),
      style: {
        background: '#fff3cd',
        color: '#856404',
        borderColor: isActive ? '#856404' : '#ffeeba',
        marginTop: '10px'
      }
    }, m("i", {
      className: "fas fa-user-secret",
      style: {
        marginRight: '8px'
      }
    }), m("span", null, "Y\xF6netici: Ba\u015Fka Kullan\u0131c\u0131 Ad\u0131na Y\xFCkle")), isActive && m("div", {
      className: "Admin-Override-Panel",
      style: {
        marginTop: '10px',
        padding: '10px',
        background: '#fffbf2',
        border: '1px dashed #ffeeba',
        borderRadius: '5px'
      }
    }, m("div", {
      className: "UserSearch-wrapper",
      style: {
        position: 'relative'
      }
    }, m("input", {
      className: "FormControl",
      type: "text",
      placeholder: "Kullan\u0131c\u0131 Ara...",
      value: this.targetUsername(),
      oninput: this.handleSearchInput.bind(this)
    }), this.isSearching && m("i", {
      className: "fas fa-spinner fa-spin",
      style: {
        position: 'absolute',
        right: '10px',
        top: '10px',
        color: '#999'
      }
    }), this.userSearchResults.length > 0 && m("ul", {
      className: "Dropdown-menu",
      style: {
        display: 'block',
        width: '100%',
        position: 'absolute',
        top: '100%',
        left: 0,
        zIndex: 999,
        maxHeight: '200px',
        overflowY: 'auto',
        marginTop: '5px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }
    }, this.userSearchResults.map(user => m("li", {
      style: {
        cursor: 'pointer',
        padding: '5px 10px'
      },
      onclick: () => this.selectUser(user)
    }, m((flarum_common_components_Avatar__WEBPACK_IMPORTED_MODULE_3___default()), {
      user: user,
      className: "Avatar--small",
      style: {
        marginRight: '10px',
        verticalAlign: 'middle'
      }
    }), m("span", {
      style: {
        fontWeight: 'bold'
      }
    }, user.username()))))), m("div", {
      style: {
        marginTop: '10px'
      }
    }, m("label", {
      style: {
        display: 'block',
        fontWeight: 'bold',
        marginBottom: '5px',
        color: '#856404',
        fontSize: '12px'
      }
    }, "Hedef \u0130mza T\xFCr\xFC:"), m("div", {
      style: {
        display: 'flex',
        gap: '20px'
      }
    }, m("label", {
      style: {
        cursor: 'pointer',
        color: '#856404',
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px'
      }
    }, m("input", {
      type: "radio",
      name: "targetWmType",
      value: "yatay",
      checked: this.targetWatermarkType() === 'yatay',
      onchange: e => this.targetWatermarkType(e.target.value),
      style: {
        marginRight: '5px'
      }
    }), "Yatay \u0130mza"), m("label", {
      style: {
        cursor: 'pointer',
        color: '#856404',
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px'
      }
    }, m("input", {
      type: "radio",
      name: "targetWmType",
      value: "dikey",
      checked: this.targetWatermarkType() === 'dikey',
      onchange: e => this.targetWatermarkType(e.target.value),
      style: {
        marginRight: '5px'
      }
    }), "Dikey \u0130mza")))));
  }
  loadWatermarks() {
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().request({
      method: 'GET',
      url: flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().forum.attribute('apiUrl') + '/ulasimarsiv-watermarks'
    }).then(response => {
      const list = response.watermarks || [];
      list.forEach(wm => {
        const option = this.generateStyleFromFilename(wm);
        const n = wm.name.toLowerCase();
        if (wm.type === 'landscape') {
          if (option.label.includes('Kişisel')) this.horizontalPersonal = option;else if (n.includes('orta')) this.horizontalCenter.push(option);else this.horizontalCorner.push(option);
        } else {
          if (option.label.includes('Kişisel')) this.verticalPersonal = option;else this.verticalGeneral.push(option);
        }
      });
      const sortFunc = (a, b) => {
        const score = id => id.includes('beyaz') ? 1 : id.includes('siyah') ? 2 : 3;
        return score(a.id.toLowerCase()) - score(b.id.toLowerCase());
      };
      this.horizontalCenter.sort(sortFunc);
      this.horizontalCorner.sort(sortFunc);
      this.verticalGeneral.sort(sortFunc);
      this.loadingOptions = false;
      m.redraw();
    }).catch(err => {
      console.error(err);
      this.loadingOptions = false;
      m.redraw();
    });
  }
  generateStyleFromFilename(wm) {
    const n = wm.name.toLowerCase();
    let s = {
      id: wm.name,
      label: wm.name,
      icon: 'fas fa-stamp',
      color: '#333',
      bg: '#f9f9f9',
      border: '#ddd',
      isPersonal: false
    };
    let c = '';
    if (n.includes('siyah')) {
      s.color = '#fff';
      s.bg = '#333';
      s.border = '#333';
      c = 'Siyah';
    } else if (n.includes('beyaz')) {
      s.color = '#333';
      s.bg = '#fff';
      s.border = '#ddd';
      c = 'Beyaz';
    } else if (n.includes('renkli') || n.includes('color')) {
      s.color = '#e74c3c';
      s.bg = '#fff';
      s.border = '#e74c3c';
      c = 'Renkli';
    }
    if (!n.includes('ulasimarsiv')) {
      s.label = 'Kişisel İmza';
      s.icon = 'fas fa-signature';
      s.bg = '#e3f2fd';
      s.color = '#1565c0';
      s.border = '#90caf9';
      s.isPersonal = true;
    } else {
      const p = n.includes('kose') ? ' (Köşe)' : n.includes('orta') ? ' (Orta)' : '';
      s.label = "".concat(c || 'Standart', " \u0130mza").concat(p);
    }
    return s;
  }
  handleSearchInput(e) {
    const q = e.target.value;
    this.targetUsername(q);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    if (q.length < 3) {
      this.userSearchResults = [];
      m.redraw();
      return;
    }
    this.searchTimeout = setTimeout(() => {
      this.isSearching = true;
      m.redraw();
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().store.find('users', {
        filter: {
          q
        },
        page: {
          limit: 5
        }
      }).then(u => {
        this.userSearchResults = u;
        this.isSearching = false;
        m.redraw();
      });
    }, 300);
  }
  selectUser(user) {
    this.targetUsername(user.username());
    this.userSearchResults = [];
    m.redraw();
  }
  selectWatermark(id) {
    this.selections[this.activeIndex] = id;
  }
  applyToAll(id) {
    this.selections.fill(id);
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().alerts.show({
      type: 'success'
    }, 'Tümüne uygulandı.');
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
flarum.reg.add('ulasimarsiv-upload-exif', 'forum/components/WatermarkModal', WatermarkModal);

/***/ },

/***/ "flarum/common/Component"
/*!*************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/Component')" ***!
  \*************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/Component');

/***/ },

/***/ "flarum/common/components/Avatar"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Avatar')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Avatar');

/***/ },

/***/ "flarum/common/components/Button"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Button')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Button');

/***/ },

/***/ "flarum/common/components/Icon"
/*!*******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Icon')" ***!
  \*******************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Icon');

/***/ },

/***/ "flarum/common/components/LinkButton"
/*!*************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/LinkButton')" ***!
  \*************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/LinkButton');

/***/ },

/***/ "flarum/common/components/LoadingIndicator"
/*!*******************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/LoadingIndicator')" ***!
  \*******************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/LoadingIndicator');

/***/ },

/***/ "flarum/common/components/Modal"
/*!********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Modal')" ***!
  \********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Modal');

/***/ },

/***/ "flarum/common/components/TextEditor"
/*!*************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/TextEditor')" ***!
  \*************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/TextEditor');

/***/ },

/***/ "flarum/common/components/Tooltip"
/*!**********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Tooltip')" ***!
  \**********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Tooltip');

/***/ },

/***/ "flarum/common/extend"
/*!**********************************************************!*\
  !*** external "flarum.reg.get('core', 'common/extend')" ***!
  \**********************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/extend');

/***/ },

/***/ "flarum/common/utils/Stream"
/*!****************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/utils/Stream')" ***!
  \****************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/utils/Stream');

/***/ },

/***/ "flarum/forum/app"
/*!******************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/app')" ***!
  \******************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/app');

/***/ },

/***/ "flarum/forum/components/CommentPost"
/*!*************************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/components/CommentPost')" ***!
  \*************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/components/CommentPost');

/***/ },

/***/ "flarum/forum/components/UserPage"
/*!**********************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/components/UserPage')" ***!
  \**********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/components/UserPage');

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
  !*** ./src/forum/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/TextEditor */ "flarum/common/components/TextEditor");
/* harmony import */ var flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/UserPage */ "flarum/forum/components/UserPage");
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_UploadButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/UploadButton */ "./src/forum/components/UploadButton.js");
/* harmony import */ var _components_GalleryButton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/GalleryButton */ "./src/forum/components/GalleryButton.js");
/* harmony import */ var _components_UserUploadsPage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/UserUploadsPage */ "./src/forum/components/UserUploadsPage.js");
/* harmony import */ var _components_SpotterImageManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/SpotterImageManager */ "./src/forum/components/SpotterImageManager.js");







 // Yeni Sayfa

flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('ulasimarsiv/upload-exif', () => {
  // 1. ROTA TANIMLA (/u/kullaniciadi/uploads)
  (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().routes)['user.uploads'] = {
    path: '/u/:username/uploads',
    component: _components_UserUploadsPage__WEBPACK_IMPORTED_MODULE_7__["default"]
  };

  // 2. EDİTÖR BUTONLARI (Mevcut yapı korundu)
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'toolbarItems', function (items) {
    // 1. Yükleme Butonu (Solda - Puan 102)
    items.add('spotter-upload', m(_components_UploadButton__WEBPACK_IMPORTED_MODULE_5__["default"], {
      editor: this
    }), 102);

    // 2. Galeri Butonu (Sağda - Puan 101)
    items.add('spotter-gallery', m(_components_GalleryButton__WEBPACK_IMPORTED_MODULE_6__["default"], {
      editor: this
    }), 101);
  });

  // 3. PROFİL SAYFASI MENÜSÜNE EKLE
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'navItems', function (items) {
    const user = this.user;
    items.add('uploads', m((flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_4___default()), {
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('user.uploads', {
        username: user.slug()
      }),
      icon: "fas fa-camera"
    }, "Kullan\u0131c\u0131 Medyas\u0131"), 10 // Sıralama puanı (Tartışmalar ve Yanıtlar'ın altına gelir)
    );
  });
  _components_SpotterImageManager__WEBPACK_IMPORTED_MODULE_8__["default"].init();
});
})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map