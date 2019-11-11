import { Screen } from './screen.js'

export class AIAReader {
  static read(content) {
    var readerObj = content instanceof Blob ? new zip.BlobReader(content) : new zip.HttpReader(content);
    zip.createReader(readerObj, (reader) => {
      reader.getEntries((entries) => {
        if (entries.length) {
          for(var entry of entries) {
            entry.getData(new zip.TextWriter(), function(text) {
              console.log(text);
              reader.close(function() {
                // onclose callback
              });
            }
          }
        }
      });
    }, function(error) {
      // onerror callback
    });
  }
}
