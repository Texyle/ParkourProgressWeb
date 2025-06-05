class Modal {
    constructor(id, title) {
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.marginLeft = 0;
        this.marginTop = 0;

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

        const modalRect = this.modal.getBoundingClientRect();
        const modalWidth = modalRect.width;
        const modalHeight = modalRect.height;

        const minLeft = modalWidth / 2;
        const minTop = modalHeight / 2;
        const maxLeft = window.innerWidth - modalWidth / 2 - 2;
        const maxTop = window.innerHeight - modalHeight / 2 - 2;

        // prevent modal from going outside the window
        newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
        newTop = Math.max(minTop, Math.min(newTop, maxTop));

        this.modal.style.left = newLeft + "px";
        this.modal.style.top = newTop + "px";
    }

    stopDrag() {
        this.isDragging = false;
        document.body.style.userSelect = "";
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
    }
}

class UpdateProgressModal extends Modal {
    constructor() {
        super('update-progress-modal', 'Updating progress');
        this.addElements();
    }

    addElements() {
        const paragraph = document.createElement('p');
        paragraph.textContent = 'test';
        this.modal.appendChild(paragraph);
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
        this.modal.appendChild(paragraph);
    }
}