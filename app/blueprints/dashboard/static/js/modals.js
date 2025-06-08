class Modal {
    constructor(id, title) {
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.marginLeft = 0;
        this.marginTop = 0;

        this.handlePasteFn = (e) => this.handlePaste(e);

        this.createModal(id, title);
        this.setupEventListeners();
    }

    createModal(id, title) {
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.onclick = () => {
            this.close();
        };

        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.id = id;

        this.header = document.createElement('div');
        this.header.className = 'modal-header';

        this.body = document.createElement('div');
        this.body.className = 'modal-body';

        this.titleElement = document.createElement('h2');
        this.titleElement.className = 'modal-title';
        this.titleElement.textContent = title;

        this.closeButton = document.createElement('span');
        this.closeButton.className = 'modal-close';
        this.closeButton.innerHTML = '&times;';
        this.closeButton.onclick = () => {
            this.close();
        };

        this.header.appendChild(this.titleElement);
        this.header.appendChild(this.closeButton);

        this.modal.appendChild(this.header);
        this.modal.appendChild(this.body);

        document.body.appendChild(this.modal);
        document.body.appendChild(this.overlay);
    }

    setupEventListeners() {
        this.header.addEventListener("mousedown", (e) => this.startDrag(e));
        document.addEventListener("mousemove", (e) => this.drag(e));
        document.addEventListener("mouseup", () => this.stopDrag());
    }

    startDrag(e) {
        if (e.target == this.closeButton) {
            return;
        }

        this.isDragging = true;

        const style = window.getComputedStyle(this.modal);
        this.marginLeft = parseInt(style.marginLeft, 10) || 0;
        this.marginTop = parseInt(style.marginTop, 10) || 0;

        const rect = this.modal.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;

        document.body.style.userSelect = "none";
    }

    drag(e) {
        if (!this.isDragging) return;

        let newLeft = e.clientX - this.offsetX - this.marginLeft;
        let newTop = e.clientY - this.offsetY - this.marginTop;

        this.modal.style.left = newLeft + "px";
        this.modal.style.top = newTop + "px";
    }

    stopDrag() {
        this.isDragging = false;
        document.body.style.userSelect = "";
    }

    initializePasteArea() {
        if (this.pasteArea == null) {
            return;
        }

        document.body.addEventListener('paste', this.handlePasteFn);
    }

    handlePaste(e) {
        if (this.pasteArea == null) {
            return;
        }

        e.preventDefault();

        const pasteData = (e.clipboardData || window.clipboardData);
        const items = pasteData.items;

        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                var blob = items[i].getAsFile();
                var reader = new FileReader();

                reader.onload = (e) => {
                    var img = document.createElement('img');
                    img.className = 'modal-paste-area-image';
                    img.src = e.target.result;
                    this.pasteArea.innerHTML = '';
                    this.pasteArea.appendChild(img);
                };

                reader.readAsDataURL(blob);
                return;
            }
        }

        const pastedText = pasteData.getData('text/plain');
        if (pastedText) {
            if (isImageUrl(pastedText)) {
                var img = document.createElement('img');
                img.className = 'modal-paste-area-image';
                img.src = pastedText;
                this.pasteArea.innerHTML = '';
                this.pasteArea.appendChild(img);
            } else if (isValidUrl(pastedText)) {
                var linkDiv = document.createElement('div');
                linkDiv.className = 'modal-paste-area-link';

                const domainName = extractDomainName(pastedText);
                linkDiv.textContent = domainName || pastedText;

                const icon = document.createElement('img');
                icon.src = linkIconUrl;
                icon.alt = 'Link Icon';
                linkDiv.appendChild(icon);

                linkDiv.onclick = function() {
                    window.open(pastedText, '_blank');
                };
                this.pasteArea.innerHTML = '';
                this.pasteArea.appendChild(linkDiv);
            } else {
                var textElement = document.createElement('p');
                textElement.textContent = pastedText;
                this.pasteArea.innerHTML = '';
                this.pasteArea.appendChild(textElement);
            }
        }
    }

    show() {
        this.modal.style.display = 'block';
        this.overlay.style.display = 'block';

        // animation
        setTimeout(() => {
            this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        }, 10);

        this.modal.style.transform = 'scale(0)';
        this.modal.style.opacity = 0;
        void this.modal.offsetWidth;
        this.modal.style.transform = 'scale(1)';
        this.modal.style.opacity = 1;
    }

    close() {
        this.modal.style.transform = 'scale(0)';
        this.modal.style.opacity = 0;
        this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';

        setTimeout(() => {
            if (this.modal && this.modal.parentNode) {
                this.modal.parentNode.removeChild(this.modal);
                this.overlay.parentNode.removeChild(this.overlay);
            }
        }, 300);

        document.body.removeEventListener('paste', this.handlePasteFn);
    }
}

class UpdateProgressModal extends Modal {
    constructor() {
        super('update-progress-modal', 'Updating progress');
        this.addElements();
        this.initializePasteArea();
    }

    addElements() {
        this.pasteArea = document.createElement('div');
        this.pasteArea.className = 'modal-paste-area';
        this.pasteArea.innerText = 'Paste proof here (Ctrl+V)';
        this.body.appendChild(this.pasteArea);

        const confirmButton = document.createElement('button');
        confirmButton.className = 'modal-confirm-button';
        confirmButton.textContent = 'Confirm';
        this.body.appendChild(confirmButton);
    }
}

class SetVictorModal extends Modal {
    constructor() {
        super('update-progress-modal', 'Adding victor');
        this.addElements();
    }

    addElements() {
        const paragraph = document.createElement('p');
        paragraph.textContent = 'test';
        this.header.appendChild(paragraph);
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function isImageUrl(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

function extractDomainName(url) {
    try {
        const domain = new URL(url).hostname;
        const domainWithoutWww = domain.replace(/^www\./, '');
        const domainParts = domainWithoutWww.split('.');
        const domainName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
        return domainName;
    } catch (e) {
        console.error("Invalid URL:", e);
        return null;
    }
}