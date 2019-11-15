export class BlockWriter {
	static COMPONENT_EVENT = 'component_event';
	static COMPONENT_METHOD = 'component_method';
	static COMPONENT_SET_GET = 'component_set_get';
	static GLOBAL_DECLARATION = 'global_declaration';
	static LOGIC_FALSE = 'logic_false';
	static LOGIC_TRUE = 'logic_true';
	static COMPONENT_COMPONENT_BLOCK = 'component_component_block';

	static writeBlock(blockXML) {
		switch(blockXML.getAttribute('type')) {
			case this.COMPONENT_EVENT:
			return this.writeComponentEvent(blockXML);

			case this.COMPONENT_SET_GET:
			return this.writeComponentSetGet(blockXML);

			case this.COMPONENT_METHOD:
			return this.writeComponentMethod(blockXML);

			case this.GLOBAL_DECLARATION:
			return this.writeGlobalDeclaration(blockXML);

			case this.LOGIC_FALSE:
			case this.LOGIC_TRUE:
			return this.writeLogic(blockXML);

			case this.COMPONENT_COMPONENT_BLOCK:
			return this.writeComponentComponentBlock(blockXML);
		}
	}

	static validGlobalBlock(blockXML) {
		switch(blockXML.getAttribute('type')) {
			case this.COMPONENT_EVENT:
			case this.GLOBAL_DECLARATION:
			return true;
		}
		return false;
	}

	static next(blockXML) {
		var lastChild = blockXML.children[blockXML.children.length - 1];
		var content = '';
		if(lastChild.tagName == 'next')
			content += this.writeBlock(lastChild.children[0]);
		return content;
	}

	static writeComponentEvent(blockXML) {
		return '<span class="block--event">when ' +
		blockXML.children[0].getAttribute('instance_name') +
		'.' +
		blockXML.children[0].getAttribute('event_name') +
		' do:</span>' +
		this.writeBlock(blockXML.children[2].children[0]);
	}

	static writeComponentSetGet(blockXML) {
		var content = '<span class="block--set-get">' +
		blockXML.children[0].getAttribute('instance_name') +
		'.' +
		blockXML.children[0].getAttribute('property_name');
		if(blockXML.children[0].getAttribute('set_or_get') == 'set') {
			content += ' = ' +
			this.writeBlock(blockXML.children[3].children[0]);
		}

		content += '</span>';
		content += this.next(blockXML);
		return content;
	}

	static writeComponentMethod(blockXML) {
		var content = '<span class="block--method">' +
		blockXML.children[0].getAttribute('instance_name') +
		'.' +
		blockXML.children[0].getAttribute('method_name') +
		'(';
		var hasArgs = false;
		for(let arg of blockXML.children) {
			if(arg.tagName == 'value') {
				content += this.writeBlock(arg.children[0]) + ', ';
				hasArgs = true;
			}
		}
		if(hasArgs) {
			content = content.replace(/.$/,'');
		}
		content += ')</span>' +
		this.next(blockXML);

		return content;
	}

	static writeGlobalDeclaration(blockXML) {
		return '<span class="block--global">' +
		blockXML.children[0].innerHTML +
		' = ' +
		this.writeBlock(blockXML.children[1].children[0]) +
		'</span>';
	}

	static writeLogic(blockXML) {
		return '<span class="block--logic">' +
		blockXML.children[0].innerHTML.toLowerCase() +
		'</span>'
	}

	static writeComponentComponentBlock(blockXML) {
		return '<span class="block--component">' +
		blockXML.children[0].getAttribute('instance_name') +
		'</span>';
	}
}
