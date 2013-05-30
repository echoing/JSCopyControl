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
		    if(pasteText === pastedText) {
		    	pasteText = window.copycontrol.onpaste(pasteText, lastCopyInfo, target);
		    	if(pasteText !== null) {
		    		target.value = tmpVal.slice(0, selStart) + pasteText + tmpVal.slice(selEnd);
		    		target.selectionStart = target.selectionEnd = selStart + pasteText.length;
		    	}
		    }
	    }, 1);
    }
    
    window.copycontrol = {
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
    		oncopy: function(selection) {
    			return null;
    		},
    		onpaste: function(pasteText, copyInfo, targetElement) {
    			return pasteText;
    		}
    }
})(window);