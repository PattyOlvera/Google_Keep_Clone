class App {
    constructor() {
        this.notes = [];
        this.title = '';
        this.text = '';
        this.id = '';

        this.$placeholder = document.querySelector('#placeholder');
        this.$form = document.querySelector('#form');
        this.$notes = document.querySelector('#notes');
        this.$noteTitle = document.querySelector('#note-title');
        this.$noteText = document.querySelector('#note-text');
        this.$formButtons = document.querySelector('#form-buttons');
        this.$formCloseButton = document.querySelector('#form-close-button');
        this.$modal = document.querySelector(".modal");
        this.$modalTitle = document.querySelector(".modal-title");
        this.$modalText = document.querySelector(".modal-text");
        this.$modalCloseButton = document.querySelector('.modal-close-button');
        this.$colorToolTip = document.querySelector('#color-tooltip');

        this.addEventListeners();
    }

    addEventListeners() {
        document.body.addEventListener('click', (event) => {
            this.handleFormClick(event);
            this.selectNote(event);
            this.openModal(event);
            this.deleteNote(event);
        });

        document.body.addEventListener('mouseover', (event) => {
            this.openTooltip(event);
        });

        document.body.addEventListener('mouseout', (event) => {
            this.closeTooltip(event);
        });

        this.$colorToolTip.addEventListener('mouseover', function(){
            this.style.display = 'flex';
        });

        this.$colorToolTip.addEventListener('mouseout', function() {
            this.style.display = 'none';
        });

        this.$colorToolTip.addEventListener('click', event => {
            const color = event.target.dataset.color;
            console.log(color);
            if(color) {
                this.editNoteColor(color);
            }
        });
        
        this.$form.addEventListener('submit', event => {
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            // we evaluate that at least one of the fields is not empty
            const hasNote = title || text;
            if(hasNote){
                // add Note
                this.addNote({title, text});
            }            
        });

        this.$formCloseButton.addEventListener('click', event => {
            // We use even stop propagation to prevent from the event listener
            // of the cclick on the handle from running
            event.stopPropagation();
            this.closeForm();
        });

        this.$modalCloseButton.addEventListener('click', event => {
            this.closeModal(event);
        })
    }

    handleFormClick(event){
        const isFormClicked = this.$form.contains(event.target);

        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const hasNote = title || text;

        if(isFormClicked){
            // Open Form
            this.openForm();
        } else if(hasNote){
            this.addNote({ title, text })
        } else {
            // Close Form
            this.closeForm();
        }
    }

    openForm() {
        this.$form.classList.add('form-open');
        this.$noteTitle.style.display = 'block';
        this.$formButtons.style.display = 'block';
    }

    closeForm(){
        this.$form.classList.remove('form-open');
        this.$noteTitle.style.display = 'none';
        this.$formButtons.style.display = 'none';
        this.$noteTitle.value = '';
        this.$noteText.value = '';
    }

    openModal(event) {
        if(event.target.matches('.toolbar-delete')) return;
        if(event.target.closest('.note')) {
           this.$modal.classList.toggle('open-modal');
           this.$modalTitle.value = this.title;
           this.$modalText.value = this.text;
        }
     }

    closeModal(event) {
        this.editNote();
        this.$modal.classList.toggle('open-modal');
    }

    openTooltip(event) {
        if(!event.target.matches('.toolbar-color')) return;
        this.id = event.target.dataset.id;
        const noteCoords = event.target.getBoundingClientRect();
        const horizontal = noteCoords.left + window.scrollX;
        const vertical = window.scrollY - 25;
        console.log(vertical);
        this.$colorToolTip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
        this.$colorToolTip.style.display = 'flex';
    }

    closeTooltip(event) {
        if(!event.target.matches('.toolbar-color')) return;
        this.$colorToolTip.style.display = 'none';
    }


    addNote( { title, text }) {
        const newNote = {
            title,
            text,
            color: 'white',
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        };
        this.notes = [...this.notes, newNote];
        this.displayNotes();
        this.closeForm();
    }

    editNote(){
        const title = this.$modalTitle.value;
        const text = this.$modalText.value;
        this.notes = this.notes.map(note => 
            note.id === Number(this.id) ? { ...note, title, text} : note
        );
        this.displayNotes();        
    }

    editNoteColor(color) {
        this.notes = this.notes.map(note => 
            note.id === Number(this.id) ? {...note, color} : note
        );
        this.displayNotes();
    }

    selectNote(event) {
        if (event.target.closest('.note')){
            const $selectedNote = event.target.closest('.note');
            const [$noteTitle, $noteText] =  $selectedNote.children;
            this.title = $noteTitle.innerText;
            this.text = $noteText.innerText;
            this.id = $selectedNote.dataset.id;
        }
    }

    deleteNote(event) {
        event.stopPropagation();
        if(!event.target.matches('.toolbar-delete')) return;
        const id = event.target.dataset.id;
        this.notes = this.notes.filter(note => note.id !== Number(id));
        this.displayNotes();

    }

    displayNotes() {
        const hasNotes = this.notes.length > 0;
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

        this.$notes.innerHTML = this.notes.map(note => `
            <div style="background: ${note.color}" class="note" data-id="${note.id}">
                <div class="${note.title && 'note-title'}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <div class="toolbar">
                        <img class="toolbar-color" data-id=${note.id} src="./assets/img/palette.png">
                        <img class="toolbar-delete" data-id=${note.id} src="./assets/img/delete.png">
                    </div>
                </div>
            </div>
        `).join("");

    }
}

new App();