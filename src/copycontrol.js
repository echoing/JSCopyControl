/**
 * JSCopyControl
 * 
 * Author: Leo Selig
 * Version: 0.1
 * 
 * License: MIT
 */
(function(window) {
	var lastCopiedText = null;
	var lastCopyInfo = null;
	
	function onCopy(e) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
	        var parts = [];
	        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
		        parts.push(sel.getRangeAt(i).cloneContents().textContent);
	        }
	        lastCopiedText = parts.join('');
        	lastCopyInfo = window.copycontrol.oncopy(lastCopiedText, sel) || null;
        }
    }

    function onPaste(e) {
    	var target = e.target;
    	var nodeName = target.nodeName.toLowerCase();
    	var pasteText = lastCopiedText;
    	var curVal;
    	if(nodeName !== 'textarea') {
    		if(nodeName === 'input') {
        		pasteText = pasteText.replace(/\n/, ' ');
        	}
    		else {
    			return;
    		}
    	}
    	curVal = target.value;
    	
	    var selStart = target.selectionStart;
	    var selEnd = target.selectionEnd;
	    target.value = '';
	    window.setTimeout(function() {
			var pastedText = target.value;
			target.value = curVal;
			pasteText = window.copycontrol.onpaste(
					pasteText,
					(pasteText === pastedText) ? lastCopyInfo : null,
					target);
	    	if(pasteText !== null) {
	    		target.value = curVal.slice(0, selStart) + pasteText + curVal.slice(selEnd);
	    		target.selectionStart = target.selectionEnd = selStart + pasteText.length;
	    	}
	    }, 1);
    }
    
    window.copycontrol = {
    		/**
    		 * Initializes the plugin
    		 * Should be called whe DOM is ready
    		 */
    		init: function() {
    			var body = document.getElementsByTagName('body')[0];
    			if(typeof document.addEventListener !== 'undefined') {
    				body.addEventListener('copy', onCopy);
    				body.addEventListener('paste', onPaste);
    			}
    			else {
    				body.attachEvent('oncopy', onCopy);
    				body.attachEvent('onpaste', onPaste);
    			}
    		},
    		
    		/**
    		 * Listener to be evoked when the user copies text on the page
    		 * Can be overwritten in order to listen to copy events
    		 * 
    		 * @param {String} copiedText The string that has been copied
    		 * @param {Selection} selection The selection object from which the text copy was created
    		 * @returns {Object} information to attach to the current copied text
    		 */
    		oncopy: function(copiedText, selection) {
    			return null;
    		},
    		
    		/**
    		 * Listener to be evoked when the user pastes text into an input or textarea element
    		 * Can be overwritten in order to listen to paste events
    		 * 
    		 * @param {String} Text that is pasted
    		 * @param [Object} Information attached to corresponding copy event
    		 * @param {HTMLElement} Target element on which the event occured
    		 * 
    		 * @returns {Object} information to attach to the current copied text
    		 */
    		onpaste: function(pasteText, copyInfo, targetElement) {
    			return pasteText;
    		}
    }
})(window);