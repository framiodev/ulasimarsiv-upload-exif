import app from 'flarum/admin/app';
import SpottersSettingsPage from './components/SpottersSettingsPage';

app.initializers.add('ulasimarsiv/upload-exif', () => {
  if (app.registry) {
    app.registry
      .for('ulasimarsiv-upload-exif')
      .registerPage(SpottersSettingsPage);
  } else if (app.extensionData) {
    app.extensionData
      .for('ulasimarsiv-upload-exif')
      .registerPage(SpottersSettingsPage);
  }
});