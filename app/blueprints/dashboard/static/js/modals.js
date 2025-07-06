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
    constructor(confirmCallback) {
        super('update-progress-modal', 'Updating progress');

        this.addElements(confirmCallback);
        this.initializePasteArea();
    }

    addElements(confirmCallback) {
        this.pasteArea = document.createElement('div');
        this.pasteArea.className = 'modal-paste-area';
        this.pasteArea.innerText = 'Paste proof here (Ctrl+V)';
        this.body.appendChild(this.pasteArea);

        const confirmButton = document.createElement('button');
        confirmButton.className = 'modal-confirm-button';
        confirmButton.textContent = 'Confirm';
        confirmButton.onclick = () => {
            if (this.validate()) {
                confirmCallback();
                this.close();
            }
        };
        this.body.appendChild(confirmButton);
    }

    validate() {
        return true;
    }
}

class SetVictorModal extends Modal {
    constructor(confirmCallback, showFails) {
        super('set-victor-modal', 'Adding victor');

        this.addElements(confirmCallback, showFails);
    }

    addElements(confirmCallback, showFails) {
        this.dateInput = document.createElement('input');
        this.dateInput.type = 'date';
        this.dateInput.className = 'progress-date-input'

        // set date to today
        let today = new Date();
        let formattedDate = today.toISOString().split('T')[0];
        this.dateInput.value = formattedDate;

        const dateLabel = document.createElement('label');
        dateLabel.textContent = 'Date:';
        dateLabel.appendChild(this.dateInput);
        this.body.appendChild(dateLabel);

        if (showFails) {
            this.failsInput = document.createElement('input');
            this.failsInput.type = 'number';
            this.failsInput.min = 0;
            this.failsInput.max = 200;
            this.failsInput.value = 0;
            this.failsInput.className = 'progress-fails-input'
            const failsLabel = document.createElement('label');
            failsLabel.textContent = 'Fails:';
            failsLabel.appendChild(this.failsInput);
            this.body.appendChild(failsLabel);
        }

        this.pasteArea = document.createElement('div');
        this.pasteArea.className = 'modal-paste-area';
        this.pasteArea.innerText = 'Paste proof here (Ctrl+V)';
        this.body.appendChild(this.pasteArea);

        const confirmButton = document.createElement('button');
        confirmButton.className = 'modal-confirm-button';
        confirmButton.textContent = 'Confirm';
        confirmButton.onclick = () => {
            if (this.validate()) {
                confirmCallback();
                this.close();
            }
        };
        this.body.appendChild(confirmButton);
    }

    validate() {
        let error = false;

        this.failsInput.classList.remove('invalid');
        if (this.failsInput.value < 0 || this.failsInput.value > 200) {
            this.failsInput.classList.add('invalid');
            error = true;
        }

        return !error;
    }
}

class EditVictorModal extends Modal {
    constructor(confirmCallback, showFails, oldDate, oldFails) {
        super('edit-victor-modal', 'Editing victor');

        this.addElements(confirmCallback, showFails, oldDate, oldFails);
    }

    addElements(confirmCallback, showFails, oldDate, oldFails) {
        this.dateInput = document.createElement('input');
        this.dateInput.type = 'date';
        this.dateInput.className = 'progress-date-input'
        this.dateInput.value = oldDate.toISOString().split('T')[0];
        console.log(oldDate.toISOString());

        const dateLabel = document.createElement('label');
        dateLabel.textContent = 'Date:';
        dateLabel.appendChild(this.dateInput);
        this.body.appendChild(dateLabel);

        if (showFails) {
            this.failsInput = document.createElement('input');
            this.failsInput.type = 'number';
            this.failsInput.min = 0;
            this.failsInput.max = 200;
            this.failsInput.value = oldFails;
            this.failsInput.className = 'progress-fails-input'
            const failsLabel = document.createElement('label');
            failsLabel.textContent = 'Fails:';
            failsLabel.appendChild(this.failsInput);
            this.body.appendChild(failsLabel);
        }

        this.pasteArea = document.createElement('div');
        this.pasteArea.className = 'modal-paste-area';
        this.pasteArea.innerText = 'Paste proof here (Ctrl+V)';
        this.body.appendChild(this.pasteArea);

        const confirmButton = document.createElement('button');
        confirmButton.className = 'modal-confirm-button';
        confirmButton.textContent = 'Confirm';
        confirmButton.onclick = () => {
            if (this.validate()) {
                confirmCallback();
                this.close();
            }
        };
        this.body.appendChild(confirmButton);
    }

    validate() {
        let error = false;

        this.failsInput.classList.remove('invalid');
        if (this.failsInput.value < 0 || this.failsInput.value > 200) {
            this.failsInput.classList.add('invalid');
            error = true;
        }

        return !error;
    }
}

class DeleteVictorModal extends Modal {
    constructor(confirmCallback) {
        super('delete-victor-modal', 'Deleting victor');

        this.addElements(confirmCallback);
        this.initializePasteArea();
    }

    addElements(confirmCallback) {
        this.pasteArea = document.createElement('div');
        this.pasteArea.className = 'modal-paste-area';
        this.pasteArea.innerText = 'Paste proof here (Ctrl+V)';
        this.body.appendChild(this.pasteArea);

        const confirmButton = document.createElement('button');
        confirmButton.className = 'modal-confirm-button';
        confirmButton.textContent = 'Confirm';
        confirmButton.onclick = () => {
            if (this.validate()) {
                confirmCallback();
                this.close();
            }
        };
        this.body.appendChild(confirmButton);
    }

    validate() {
        return true;
    }
}