/**
 * Class that represents a downloader utility.
 *
 * @since  1.0.0
 * @access public
 */
export class Downloader {

  /**
   * Downloads a file referenced by its URL.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} url  The URL of the file to be downloaded.
   * @param {String} fileName  The name of the file to be downloaded.
   */
  static downloadURL(url, fileName) {
    var anchor = new View('A');
    anchor.domElement.href = url;
    anchor.domElement.target = '_blank';
    anchor.domElement.download = fileName;
    anchor.domElement.click();
  }

  /**
   * Downloads a Blob with a file name.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Blob} blob  The blob representing the file to be downloaded.
   * @param {String} fileName  The name of the file to be downloaded.
   */
  static downloadBlob(blob, fileName) {
    var url = URL.createObjectURL(blob);
    this.downloadURL(url, fileName);
    URL.revokeObjectURL(url);
  }

  /**
   * Downloads some text as a file.
   *
   * @since 1.0.0
   * @access public
   *
   * @param {String} text  The text to be downloaded.
   * @param {String} fileName  The name of the file to be downloaded.
   */
  static downloadText(text, fileName) {
    this.downloadBlob(new Blob([text], { type: 'text/html' }), fileName);
  }
}

/**
 * Utility class that handles URL GET parameters.
 *
 * @since  1.0.0
 * @access public
 */
export class URLHandler {

  /**
   * Gets the request parameters
   *
   * @since 1.0.0
   * @access public
   *
   * @return {Array} Array of name-value pairs of request parameters.
   */
  static getReqParams() {
    var paramString = window.location.search.substr(1);
    return paramString != null && paramString != "" ? this.makeArray(paramString) : {};
  }

  /**
   * Makes an array of string of parameters.
   *
   * @since 1.0.0
   * @access private
   *
   * @return {String} String of request parameters.
   */
  static makeArray(paramString) {
    var params = {};
    var paramArray = paramString.split("&");
    for (var i = 0; i < paramArray.length; i++) {
      var tempArr = paramArray[i].split("=");
      params[tempArr[0]] = tempArr[1];
    }
    return params;
  }
}

/**
 * Utility class that formats asset sizes.
 *
 * @since  1.0.0
 * @access public
 */
export class AssetFormatter {
  /**
   * Formats an asset size to its nearest unit (B, kB, mB, etc.)
   *
   * @since 1.0.0
   * @access public
   *
   * @param {Integer} size The size of the asset in bytes.
   */
  static formatSize(size) {
    var unitCount = 0
    while (size > 1000) {
      size /= 1000;
      unitCount++;
    }
    return parseInt(size) + ['B', 'kB', 'mB', 'gB', 'tB', 'pB'][unitCount];
  }
}