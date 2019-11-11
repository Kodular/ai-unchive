export class AIAReader {
  static read(blob) {
    // use a BlobReader to read the zip from a Blob object
    zip.createReader(new zip.BlobReader(blob), function(reader) {

      // get all entries from the zip
      reader.getEntries(function(entries) {
        if (entries.length) {
          // get first entry content as text
          entries[0].getData(new zip.TextWriter(), function(text) {
            // text contains the entry data as a String
            console.log(text);

            // close the zip reader
            reader.close(function() {
              // onclose callback
            });

          }, function(current, total) {
            // onprogress callback
          });
        }
      });
    }, function(error) {
      // onerror callback
    });
  }
}
