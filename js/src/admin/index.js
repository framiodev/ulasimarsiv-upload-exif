import app from 'flarum/admin/app';
import SpottersSettingsPage from './components/SpottersSettingsPage';

app.initializers.add('ulasimarsiv-upload-exif', () => {
  app.extensionData
    .for('ulasimarsiv-upload-exif')
    .registerPage(SpottersSettingsPage);
});