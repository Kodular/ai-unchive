import os, sys

current_dir = os.path.dirname( __file__ )
def generate_blockly():
	plovr_path = os.path.abspath(os.path.join(current_dir, 'lib', 'plovr', 'plovr-eba786b34df9.jar'))
	config_path = os.path.abspath(os.path.join(current_dir, 'blockly', 'ploverConfig.js'))
	os.system('java -jar {} build {}'.format(plovr_path, config_path))

def start_server(port):
    os.system('python -m http.server ' + port)

def generate_trans():
    trans_files = []
    for (dirpath, dirnames, filenames) in os.walk(os.path.abspath(os.path.join(current_dir, 'i18n', 'properties'))):
        trans_files.extend(filenames)
        break

    files_part_1 = []
    files_part_2 = []
    for file in trans_files:
        content = open(os.path.abspath(os.path.join(current_dir, 'i18n', 'properties', file)), encoding='utf-8').read()
        if file.split('.')[0].split('_')[1] == '1':
            files_part_1.append({'name' : file.split('.')[0].split('_')[0], 'content' : content})
        elif file.split('.')[0].split('_')[1] == '2':
            files_part_2.append({'name' : file.split('.')[0].split('_')[0], 'content' : content})

    for file in files_part_1:
        js = open(os.path.abspath(os.path.join(current_dir, 'i18n', 'js', file['name'] + '.js')), 'w', encoding='utf-8')
        js.write('m=[];')
        write_to_js(file, js, [''])
        for part_2 in files_part_2:
            if part_2['name'] == file['name']:
                write_to_js(part_2, js, ['Methods', 'Properties', 'Events', 'Params', 'ComponentPallette'], ['HelpComponentPallette', 'HelpStringComponentPallette'])
                break
        js.write('Messages=m;')
        js.close()

def write_to_js(properties, js_writer, valid_endings, invalid_endings = []):
    for line in properties['content'].split('\n'):
        if line != '' and not line.startswith('#') and not line.startswith('\'') and not line.startswith('\"') and not line.startswith('+'):
            name_val_pair = line.split('=', 1)
            for valid_ending in valid_endings:
                if name_val_pair[0].strip().endswith(valid_ending.strip()):
                    valid_ending_flag = True
                    if len(invalid_endings) > 0:
                        for invalid_ending in invalid_endings:
                            if name_val_pair[0].strip().endswith(invalid_ending.strip()):
                                valid_ending_flag = False
                                break
                    if valid_ending_flag:
                        js_writer.write('m[\'%s\']=%s;' % (
                        name_val_pair[0].strip(),
                        '"' +
                        name_val_pair[1].replace('\'\'', '\'').strip().strip('"').replace('\"', '\\\"') +
                        '"'))
                        break

if len(sys.argv) == 1:
    print('Unknown parameter []. Expected usage -> setup.py [generate-blockly | update-components | update-translations | run]')
    exit()
if sys.argv[1] == 'generate-blockly':
    generate_blockly()
elif sys.argv[1] == 'update-components':
    fetch_simple_components()
    fetch_translations()
elif sys.argv[1] == 'update-translations':
    generate_trans()
elif sys.argv[1] == 'run':
    if len(sys.argv) == 3:
        start_server(sys.argv[2])
    else:
        start_server('8000')
else:
	print('Unknown parameter {}. Expected usage -> setup.py [generate-blockly | update-components | update-translations | run]'.format(sys.argv[1]))
