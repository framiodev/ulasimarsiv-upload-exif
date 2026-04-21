import app from 'flarum/admin/app';
import SpottersSettingsPage from './components/SpottersSettingsPage';

app.initializers.add('ulasiminfo-upload-exif', () => {
  app.extensionData
    .for('ulasiminfo-upload-exif')
    .registerPage(SpottersSettingsPage);
});