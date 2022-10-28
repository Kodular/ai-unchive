import { Screen } from './views/screen.js';
import { URLHandler } from './views/widgets.js'

window.DEBUG = true;
window.fetchDir = (dir) => {
  return window.DEBUG ? dir : '../' + dir;
}

window.Messages = Messages;
window.locales = [['English', 'en'], ['German', 'de'], ['Spanish', 'es']];
window.locale = window.locales.find(x => x[1] == URLHandler.getReqParams().locale) || window.locales[0];
console.log(window.locale);

zip.workerScriptsPath = fetchDir('lib/zip/');
window.RootPanel = new Screen();
RootPanel.setStyleName('root-panel');
RootPanel.handleURLData();
document.body.appendChild(RootPanel.domElement);

google.charts.load('current', { 'packages': ['corechart'] });