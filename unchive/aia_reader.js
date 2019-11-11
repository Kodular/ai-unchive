import { Screen } from './screen.js'

export class AIAReader {
  static read(content) {
    var screens = [];
    var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
    zip.createReader(readerObj, (reader) => {
      reader.getEntries((entries) => {
        if (entries.length) {
          for(var entry of entries) {
            entry.getData(new zip.TextWriter(), function(text) {
              console.log(text);
              alert(entry.filename);
              if(entry.filename.split('.')[1] == 'bky') {
                  //screens.append({})

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
  }
}
