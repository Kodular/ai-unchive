#! python

import os, sys
import requests
import subprocess


current_dir = os.path.dirname( __file__ )
def generate_blockly():
    print('Generating required blockly files...')
    blockly_path = os.path.abspath(os.path.join(current_dir, 'lib', 'blockly'))
    p = subprocess.Popen(
    [os.path.join(blockly_path, "build.py"), "-core"],
    cwd=blockly_path, shell = True)
    p.wait()
    print('Blockly files compressed')

def start_server(port):
    os.system('python -m http.server ' + port)

def generate_trans():
    print('Building translation files...')
    trans_files = []
    for (dirpath, dirnames, filenames) in os.walk(os.path.abspath(os.path.join(current_dir, 'i18n', 'properties'))):
        trans_files.extend(filenames)
        break

    files_part_1 = []
    files_part_2 = []

    en_part_1 = en_part_2 = ''
    for file in trans_files:
        content = open(os.path.abspath(os.path.join(current_dir, 'i18n', 'properties', file)), encoding='utf-8').read()
        filename = file.split('.')[0].rsplit('_', 1)[0]
        if file.split('.')[0].rsplit('_', 1)[1] == '1':
            files_part_1.append({'name' : filename, 'content' : content})
            if filename == 'en':
                en_part_1 = content
        elif file.split('.')[0].rsplit('_', 1)[1] == '2':
            files_part_2.append({'name' : filename, 'content' : content})
            if filename == 'en':
                en_part_2 = content

    for file in files_part_1:
        print('Writing translations for {}'.format(file['name'].upper()))
        js = open(os.path.abspath(os.path.join(current_dir, 'i18n', 'js', file['name'] + '.js')), 'w', encoding='utf-8')
        js.write('m=[];')
        write_to_js(file, en_part_1, js, [''])
        for part_2 in files_part_2:
            if part_2['name'] == file['name']:
                write_to_js(part_2, en_part_2, js, ['Methods', 'Properties', 'Events', 'Params', 'ComponentPallette'], ['HelpComponentPallette', 'HelpStringComponentPallette'])
                break
        js.write('Messages=m;')
        js.close()
    print('Translations built')

def write_to_js(properties, en_standard, js_writer, valid_endings, invalid_endings = []):
    for line in en_standard.split('\n'):
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
                        if properties['name'] != 'en':
                            for p_line in properties['content'].split('\n'):
                                if p_line.strip().split('=', 1)[0] == name_val_pair[0].strip():
                                    write_translation(js_writer, p_line.strip().split('=', 1))
                                    break
                            else:
                                write_translation(js_writer, name_val_pair)
                        else:
                            write_translation(js_writer, name_val_pair)

def write_translation(writer, name_val_pair):
    writer.write('m[\'%s\']=%s;' % (
    name_val_pair[0].strip(),
    '"' +
    name_val_pair[1].replace('\'\'', '\'').strip().strip('"').strip('\'').replace('\"', '\\\"') +
    '"'))

def generate_core():
    print('Building core scripts...')
    core_files = []
    gen_core_files_recursive(core_files, os.path.join(current_dir, 'views'));
    gen_core_files_recursive(core_files, os.path.join(current_dir, 'unchive'));
    if not os.path.exists('build'):
        os.mkdir('build')

    for file in core_files:
        if file.endswith('.js'):
            url = 'https://javascript-minifier.com/raw'
        elif file.endswith('.css'):
            url = 'https://cssminifier.com/raw'
        else:
            continue
        print('Compressing {}'.format(file))
        data = {'input': open(file, 'rb').read()}
        response = requests.post(url, data=data)
        req_path = '\\'.join(file.split('\\')[:-1]);
        if not os.path.exists(os.path.join('build', req_path)):
            os.mkdir(os.path.join('build', req_path))
        f = open(os.path.join('build', file), 'w')
        f.write(response.text)
        f.close()

    print('Building index...')
    f = open('index.html', 'r')
    f_build = open(os.path.join('build', 'index.html'), 'w')
    f_build.write(f.read())
    print('Core files built successfully')

def gen_core_files_recursive(core_files, dir):
    for (dirpath, dirnames, filenames) in os.walk(os.path.abspath(dir)):
        for file in filenames:
            core_files.append(os.path.join(dir, file))
        for dirname in dirnames:
            gen_core_files_recursive(core_files, os.path.join(dir, dirname))
        break

error_message = 'Unknown parameter {}. Expected usage -> setup.py all | build-blockly | build-core | build-translations | serve [port]'
if len(sys.argv) == 1:
    print(error_message)
    exit()
elif sys.argv[1] == 'all':
    generate_core()
    generate_blockly()
    generate_trans()
elif sys.argv[1] == 'build-blockly':
    generate_blockly()
elif sys.argv[1] == 'build-core':
    generate_core()
elif sys.argv[1] == 'build-translations':
    generate_trans()
elif sys.argv[1] == 'serve':
    if len(sys.argv) == 3:
        start_server(sys.argv[2])
    else:
        start_server('8000')
else:
	print(error_message.format(sys.argv[1]))
