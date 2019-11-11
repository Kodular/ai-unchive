import { Screen } from './screen.js'

export class AIAReader {
  static read(content) {
    var screens = [];
    var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
    zip.createReader(readerObj, (reader) => {
      reader.getEntries((entries) => {
        if (entries.length) {
          for(let entry of entries) {
            entry.getData(new zip.TextWriter(), function(text) {
              switch (entry.filename.split('.')[1]) {
                case 'bky':
                screens.append({
                  'name' : entry.filename.split('/').pop().split('.')[0],
                  'screen' : new Screen('', text)
                });
                break;

                case 'scm':
                screens.find(x => x.name == entry.filename.split('/').pop().split('.')[0]).screen.setScheme(text);
              }
              reader.close(function() {
                // onclose callback
              });
            });
          }
        }
      });
    }, function(error) {
      // onerror callback
    });

    return screens;
  }
}
