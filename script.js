/* ==========================================
   EDUPLEX - JAVASCRIPT
========================================== */


/* ==========================================
   DATA
========================================== */
/* =========================================
   EDUPLEX DASHBOARD LOGIN PROTECTION
========================================= */

const isDashboardPage = document.getElementById("dashboard");

if (
    isDashboardPage &&
    localStorage.getItem("eduplexLoggedIn") !== "true"
) {
    window.location.href = "index.html";
}
let courses = JSON.parse(
    localStorage.getItem("eduplexCourses")
) || [

    {
        id: 1,
        name: "R Programming",
        icon: "💻",
        description: "Learn R programming, data frames and data analysis."
    },

    {
        id: 2,
        name: "Deep Learning",
        icon: "🤖",
        description: "Study neural networks and deep learning concepts."
    },

    {
        id: 3,
        name: "Software Testing",
        icon: "🧪",
        description: "Learn software quality assurance and testing."
    }

];


let notes = JSON.parse(
    localStorage.getItem("eduplexNotes")
) || [

    {
        id: 101,
        title: "R Data Frames",
        course: "R Programming",
        content: "Data frames are used to store tabular data in R.",
        bookmarked: false,
        date: new Date().toLocaleDateString()
    },

    {
        id: 102,
        title: "Neural Networks",
        course: "Deep Learning",
        content: "Neural networks learn patterns using interconnected layers.",
        bookmarked: true,
        date: new Date().toLocaleDateString()
    }

];


let pdfs = JSON.parse(
    localStorage.getItem("eduplexPDFs")
) || [];


/* ==========================================
   SAVE DATA
========================================== */

function saveData() {

    localStorage.setItem(
        "eduplexCourses",
        JSON.stringify(courses)
    );

    localStorage.setItem(
        "eduplexNotes",
        JSON.stringify(notes)
    );

    localStorage.setItem(
        "eduplexPDFs",
        JSON.stringify(pdfs)
    );
}


/* ==========================================
   START APP
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const isDashboard =
        document.getElementById("dashboard");

    if (isDashboard) {

        renderAll();

        setupNavigation();

        setupModals();

        setupForms();

        setupButtons();

        setupSearch();

    }

});


/* ==========================================
   RENDER EVERYTHING
========================================== */

function renderAll() {

    renderStatistics();

    renderCourses();

    renderNotes();

    renderBookmarks();

    renderPDFs();

    renderRecent();

    populateCourseOptions();
}


/* ==========================================
   STATISTICS
========================================== */

function renderStatistics() {

    document.getElementById(
        "courseCount"
    ).textContent = courses.length;


    document.getElementById(
        "noteCount"
    ).textContent = notes.length;


    document.getElementById(
        "pdfCount"
    ).textContent = pdfs.length;


    const bookmarks =
        notes.filter(
            note => note.bookmarked
        );


    document.getElementById(
        "bookmarkCount"
    ).textContent = bookmarks.length;
}


/* ==========================================
   COURSES
========================================== */

function renderCourses() {

    const dashboardCourses =
        document.getElementById(
            "dashboardCourses"
        );


    const coursesGrid =
        document.getElementById(
            "coursesGrid"
        );


    dashboardCourses.innerHTML = "";

    coursesGrid.innerHTML = "";


    if (courses.length === 0) {

        coursesGrid.innerHTML = `
            <div class="empty-state">
                <h3>No courses yet 📚</h3>
                <p>Add your first course.</p>
            </div>
        `;

        return;
    }


    courses.forEach(
        (course, index) => {

            const courseNotes =
                notes.filter(
                    note =>
                        note.course === course.name
                ).length;


            const coursePdfs =
                pdfs.filter(
                    pdf =>
                        pdf.course === course.name
                ).length;


            const card = createCourseCard(
                course,
                courseNotes,
                coursePdfs
            );


            coursesGrid.appendChild(
                card
            );


            if (index < 3) {

                dashboardCourses.appendChild(
                    createCourseCard(
                        course,
                        courseNotes,
                        coursePdfs
                    )
                );
            }

        }
    );


    addCourseDeleteEvents();
}


/* ==========================================
   CREATE COURSE CARD
========================================== */

function createCourseCard(
    course,
    noteTotal,
    pdfTotal
) {

    const div =
        document.createElement("div");


    div.className =
        "course-card";


    div.innerHTML = `

        <button
            class="delete-course"
            data-id="${course.id}"
        >
            🗑️
        </button>


        <div class="course-icon">
            ${course.icon}
        </div>


        <h3>
            ${course.name}
        </h3>


        <p>
            ${course.description}
        </p>


        <div class="course-footer">

            <span>
                📝 ${noteTotal} Notes
            </span>

            <span>
                📄 ${pdfTotal} PDFs
            </span>

        </div>

    `;


    return div;
}


/* ==========================================
   DELETE COURSE
========================================== */

function addCourseDeleteEvents() {

    document
        .querySelectorAll(
            ".delete-course"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );


                        const course =
                            courses.find(
                                item =>
                                    item.id === id
                            );


                        if (!course) return;


                        const confirmDelete =
                            confirm(
                                `Delete ${course.name}?`
                            );


                        if (!confirmDelete) return;


                        courses =
                            courses.filter(
                                item =>
                                    item.id !== id
                            );


                        notes =
                            notes.filter(
                                note =>
                                    note.course !==
                                    course.name
                            );


                        pdfs =
                            pdfs.filter(
                                pdf =>
                                    pdf.course !==
                                    course.name
                            );


                        saveData();

                        renderAll();

                        showToast(
                            "Course deleted successfully."
                        );

                    }
                );

            }
        );
}


/* ==========================================
   NOTES
========================================== */

function renderNotes() {

    const notesGrid =
        document.getElementById(
            "notesGrid"
        );


    notesGrid.innerHTML = "";


    if (notes.length === 0) {

        notesGrid.innerHTML = `
            <div class="empty-state">
                <h3>No notes yet 📝</h3>
                <p>Create your first study note.</p>
            </div>
        `;

        return;
    }


    notes.forEach(
        note => {

            notesGrid.appendChild(
                createNoteCard(note)
            );

        }
    );


    setupNoteActions();
}


/* ==========================================
   CREATE NOTE CARD
========================================== */

function createNoteCard(note) {

    const div =
        document.createElement("div");


    div.className =
        "note-card";


    div.innerHTML = `

        <div class="note-top">

            <span>
                📝
            </span>


            <div class="note-actions">

                <button
                    class="bookmark-note"
                    data-id="${note.id}"
                >
                    ${note.bookmarked ? "⭐" : "☆"}
                </button>


                <button
                    class="edit-note"
                    data-id="${note.id}"
                >
                    ✏️
                </button>


                <button
                    class="delete-note"
                    data-id="${note.id}"
                >
                    🗑️
                </button>

            </div>

        </div>


        <h3>
            ${note.title}
        </h3>


        <div class="note-course">
            📚 ${note.course}
        </div>


        <p class="note-content">
            ${note.content}
        </p>


        <div class="note-date">
            Added: ${note.date}
        </div>

    `;


    return div;
}


/* ==========================================
   NOTE ACTIONS
========================================== */

function setupNoteActions() {

    document
        .querySelectorAll(
            ".delete-note"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        deleteNote(
                            Number(
                                button.dataset.id
                            )
                        );

                    };

            }
        );


    document
        .querySelectorAll(
            ".edit-note"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        editNote(
                            Number(
                                button.dataset.id
                            )
                        );

                    };

            }
        );


    document
        .querySelectorAll(
            ".bookmark-note"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        toggleBookmark(
                            Number(
                                button.dataset.id
                            )
                        );

                    };

            }
        );
}


/* ==========================================
   DELETE NOTE
========================================== */

function deleteNote(id) {

    const confirmDelete =
        confirm(
            "Delete this note?"
        );


    if (!confirmDelete) return;


    notes =
        notes.filter(
            note =>
                note.id !== id
        );


    saveData();

    renderAll();

    showToast(
        "Note deleted."
    );
}


/* ==========================================
   EDIT NOTE
========================================== */

function editNote(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note) return;


    document.getElementById(
        "editNoteId"
    ).value = note.id;


    document.getElementById(
        "noteTitle"
    ).value = note.title;


    document.getElementById(
        "noteCourse"
    ).value = note.course;


    document.getElementById(
        "noteContent"
    ).value = note.content;


    document.getElementById(
        "noteModalTitle"
    ).textContent =
        "Edit Note";


    openModal(
        "noteModal"
    );
}


/* ==========================================
   BOOKMARK
========================================== */

function toggleBookmark(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note) return;


    note.bookmarked =
        !note.bookmarked;


    saveData();

    renderAll();

    showToast(
        note.bookmarked
            ? "Added to bookmarks ⭐"
            : "Removed from bookmarks"
    );
}


/* ==========================================
   BOOKMARK PAGE
========================================== */

function renderBookmarks() {

    const grid =
        document.getElementById(
            "bookmarkGrid"
        );


    grid.innerHTML = "";


    const bookmarkedNotes =
        notes.filter(
            note =>
                note.bookmarked
        );


    if (
        bookmarkedNotes.length === 0
    ) {

        grid.innerHTML = `
            <div class="empty-state">
                <h3>No bookmarks yet ⭐</h3>
                <p>Bookmark important notes.</p>
            </div>
        `;

        return;
    }


    bookmarkedNotes.forEach(
        note => {

            grid.appendChild(
                createNoteCard(note)
            );

        }
    );


    setupNoteActions();
}


/* ==========================================
   PDF RENDER
========================================== */

function renderPDFs() {

    const grid =
        document.getElementById(
            "pdfGrid"
        );


    grid.innerHTML = "";


    if (pdfs.length === 0) {

        grid.innerHTML = `
            <div class="empty-state">
                <h3>No PDFs yet 📄</h3>
                <p>Add your study PDF.</p>
            </div>
        `;

        return;
    }


    pdfs.forEach(
        pdf => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "pdf-card";


            card.innerHTML = `

                <div class="course-icon">
                    📄
                </div>


                <h3>
                    ${pdf.title}
                </h3>


                <p>
                    📚 ${pdf.course}
                </p>


                <p>
                    ${pdf.fileName}
                </p>


                <div class="pdf-actions">

                    <button
                        class="view-pdf"
                        data-id="${pdf.id}"
                    >
                        👁 View
                    </button>


                    <button
                        class="delete-pdf"
                        data-id="${pdf.id}"
                    >
                        🗑 Delete
                    </button>

                </div>

            `;


            grid.appendChild(card);

        }
    );


    setupPdfActions();
}


/* ==========================================
   PDF ACTIONS
========================================== */

function setupPdfActions() {

    document
        .querySelectorAll(
            ".view-pdf"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        const pdf =
                            pdfs.find(
                                item =>
                                    item.id ===
                                    Number(
                                        button.dataset.id
                                    )
                            );


                        if (
                            pdf &&
                            pdf.url
                        ) {

                            window.open(
                                pdf.url,
                                "_blank"
                            );

                        } else {

                            showToast(
                                "PDF needs to be uploaded again after refresh."
                            );

                        }

                    };

            }
        );


    document
        .querySelectorAll(
            ".delete-pdf"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );


                        pdfs =
                            pdfs.filter(
                                pdf =>
                                    pdf.id !== id
                            );


                        saveData();

                        renderAll();

                        showToast(
                            "PDF deleted."
                        );

                    };

            }
        );
}


/* ==========================================
   RECENT MATERIALS
========================================== */

function renderRecent() {

    const recentList =
        document.getElementById(
            "recentList"
        );


    recentList.innerHTML = "";


    const recentNotes =
        notes.slice(0, 4);


    if (
        recentNotes.length === 0
    ) {

        recentList.innerHTML = `
            <div class="empty-state">
                <p>No recent materials.</p>
            </div>
        `;

        return;
    }


    recentNotes.forEach(
        note => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "recent-item";


            item.innerHTML = `

                <div class="recent-icon">
                    📝
                </div>


                <div>

                    <h4>
                        ${note.title}
                    </h4>

                    <p>
                        ${note.course}
                    </p>

                </div>


                <span class="recent-date">

                    ${note.date}

                </span>

            `;


            recentList.appendChild(
                item
            );

        }
    );
}


/* ==========================================
   COURSE OPTIONS
========================================== */

function populateCourseOptions() {

    const noteCourse =
        document.getElementById(
            "noteCourse"
        );


    const pdfCourse =
        document.getElementById(
            "pdfCourse"
        );


    noteCourse.innerHTML = "";

    pdfCourse.innerHTML = "";


    courses.forEach(
        course => {

            noteCourse.innerHTML += `
                <option value="${course.name}">
                    ${course.name}
                </option>
            `;


            pdfCourse.innerHTML += `
                <option value="${course.name}">
                    ${course.name}
                </option>
            `;

        }
    );
}


/* ==========================================
   FORMS
========================================== */

function setupForms() {


    /* COURSE FORM */

    document
        .getElementById(
            "courseForm"
        )
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document
                        .getElementById(
                            "courseName"
                        )
                        .value
                        .trim();


                const icon =
                    document
                        .getElementById(
                            "courseIcon"
                        )
                        .value
                        .trim() ||
                    "📚";


                const description =
                    document
                        .getElementById(
                            "courseDescription"
                        )
                        .value
                        .trim();


                courses.push({

                    id: Date.now(),

                    name,

                    icon,

                    description

                });


                saveData();

                renderAll();

                event.target.reset();

                closeModal(
                    "courseModal"
                );

                showToast(
                    "Course added successfully!"
                );

            }
        );


    /* NOTE FORM */

    document
        .getElementById(
            "noteForm"
        )
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const id =
                    document
                        .getElementById(
                            "editNoteId"
                        )
                        .value;


                const title =
                    document
                        .getElementById(
                            "noteTitle"
                        )
                        .value
                        .trim();


                const course =
                    document
                        .getElementById(
                            "noteCourse"
                        )
                        .value;


                const content =
                    document
                        .getElementById(
                            "noteContent"
                        )
                        .value
                        .trim();


                if (id) {

                    const note =
                        notes.find(
                            item =>
                                item.id ===
                                Number(id)
                        );


                    if (note) {

                        note.title =
                            title;

                        note.course =
                            course;

                        note.content =
                            content;

                    }


                    showToast(
                        "Note updated successfully!"
                    );

                } else {

                    notes.unshift({

                        id:
                            Date.now(),

                        title,

                        course,

                        content,

                        bookmarked:
                            false,

                        date:
                            new Date()
                                .toLocaleDateString()

                    });


                    showToast(
                        "Note added successfully!"
                    );

                }


                saveData();

                renderAll();

                event.target.reset();


                document.getElementById(
                    "editNoteId"
                ).value = "";


                closeModal(
                    "noteModal"
                );

            }
        );


    /* PDF FORM */

    document
        .getElementById(
            "pdfForm"
        )
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const title =
                    document
                        .getElementById(
                            "pdfTitle"
                        )
                        .value
                        .trim();


                const course =
                    document
                        .getElementById(
                            "pdfCourse"
                        )
                        .value;


                const file =
                    document
                        .getElementById(
                            "pdfFile"
                        )
                        .files[0];


                if (!file) {

                    showToast(
                        "Please select a PDF."
                    );

                    return;

                }


                if (
                    file.type !==
                    "application/pdf"
                ) {

                    showToast(
                        "Please select a valid PDF."
                    );

                    return;

                }


                const url =
                    URL.createObjectURL(
                        file
                    );


                pdfs.unshift({

                    id:
                        Date.now(),

                    title,

                    course,

                    fileName:
                        file.name,

                    url

                });


                saveData();

                renderAll();

                event.target.reset();

                closeModal(
                    "pdfModal"
                );

                showToast(
                    "PDF added successfully!"
                );

            }
        );
        /* LINK FORM */
     document.getElementById(
            "linkForm"
        ).
            addEventListener(
                "submit", function(event) {
            event.preventDefault();

                const title = 
                document.getElementById(
                    "linkTitle"
                ).
                value.trim();
                const url = 
                document.
                getElementById(
                    "linkUrl"
                ).
                value.trim();

        if (!title || !url) return;

            window.open(url, "_blank");

                this.reset();
                closeModal("linkModal");
                showToast("Link added successfully!");
});

}


/* ==========================================
   BUTTONS
========================================== */

function setupButtons() {

    document
        .getElementById(
            "addCourseBtn"
        )
        .onclick =
        () =>
            openModal(
                "courseModal"
            );


    document
        .getElementById(
            "addNoteBtn"
        )
        .onclick =
        () =>
            openNoteModal();


    document
        .getElementById(
            "addPdfBtn"
        )
        .onclick =
        () =>
            openModal(
                "pdfModal"
            );

    document
        .getElementById(
            "addLinkBtn"
        )
        .onclick =
        () => 
            openModal(
                "linkModal"
            );

    document
        .getElementById(
            "quickAddCourse"
        )
        .onclick =
        () =>
            openModal(
                "courseModal"
            );


    document
        .getElementById(
            "quickAddNote"
        )
        .onclick =
        () =>
            openNoteModal();


    document
        .getElementById(
            "quickAddPdf"
        )
        .onclick =
        () =>
            openModal(
                "pdfModal"
            );
    document
        .getElementById(
            "quickAddLink"
        )
       .onclick =
       () =>
           openModal(
            "linkModal"
        );

    document
        .getElementById(
            "goCoursesBtn"
        )
        .onclick =
        () =>
            goToPage(
                "courses"
            );


    document
        .getElementById(
            "motivationBtn"
        )
        .onclick =
        () => {

            showToast(
                "You don't have to be perfect. You just have to be consistent! 💪🔥"
            );

        };

}


/* ==========================================
   OPEN NOTE MODAL
========================================== */

function openNoteModal() {

    if (
        courses.length === 0
    ) {

        showToast(
            "Please add a course first."
        );

        return;
    }


    document
        .getElementById(
            "noteForm"
        )
        .reset();


    document
        .getElementById(
            "editNoteId"
        )
        .value = "";


    document
        .getElementById(
            "noteModalTitle"
        )
        .textContent =
        "Add New Note";


    openModal(
        "noteModal"
    );
}


/* ==========================================
   NAVIGATION
========================================== */

function setupNavigation() {

    document
        .querySelectorAll(
            ".nav-link"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        goToPage(
                            button.dataset.page
                        );

                    }
                );

            }
        );
}


function goToPage(page) {

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            section =>
                section.classList.remove(
                    "active-page"
                )
        );


    document
        .getElementById(
            page
        )
        .classList.add(
            "active-page"
        );


    document
        .querySelectorAll(
            ".nav-link"
        )
        .forEach(
            link =>
                link.classList.remove(
                    "active"
                )
        );


    document
        .querySelector(
            `[data-page="${page}"]`
        )
        .classList.add(
            "active"
        );


    const titles = {

        dashboard:
            [
                "Welcome back, Sai 👋",
                "Ready to continue your learning journey?"
            ],

        courses:
            [
                "My Courses 📚",
                "Manage your learning subjects."
            ],

        notes:
            [
                "My Notes 📝",
                "Create, edit and organize your notes."
            ],

        pdfs:
            [
                "PDF Library 📄",
                "All your study documents in one place."
            ],

        bookmarks:
            [
                "Bookmarks ⭐",
                "Your important saved notes."
            ]

    };


    document
        .getElementById(
            "pageTitle"
        )
        .textContent =
        titles[page][0];


    document
        .getElementById(
            "pageSubtitle"
        )
        .textContent =
        titles[page][1];


    document
        .getElementById(
            "sidebar"
        )
        .classList.remove(
            "open"
        );

}


/* ==========================================
   MODALS
========================================== */

function setupModals() {

    document
        .querySelectorAll(
            ".close-modal"
        )
        .forEach(
            button => {

                button.onclick =
                    () =>
                        closeModal(
                            button.dataset.close
                        );

            }
        );


    document
        .querySelectorAll(
            ".modal"
        )
        .forEach(
            modal => {

                modal.onclick =
                    event => {

                        if (
                            event.target ===
                            modal
                        ) {

                            modal.classList.remove(
                                "show"
                            );

                        }

                    };

            }
        );
}


function openModal(id) {

    document
        .getElementById(id)
        .classList.add(
            "show"
        );
}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove(
            "show"
        );
}


/* ==========================================
   SEARCH
========================================== */

function setupSearch() {

    document
        .getElementById(
            "searchInput"
        )
        .addEventListener(
            "input",
            event => {

                const query =
                    event.target.value
                        .toLowerCase()
                        .trim();


                document
                    .querySelectorAll(
                        ".course-card, .note-card, .pdf-card"
                    )
                    .forEach(
                        card => {

                            const text =
                                card.textContent
                                    .toLowerCase();


                            card.style.display =
                                text.includes(
                                    query
                                )
                                    ? ""
                                    : "none";

                        }
                    );

            }
        );
}


/* ==========================================
   TOAST
========================================== */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}


/* ==========================================
   MOBILE MENU
========================================== */

const menuBtn = document.getElementById("menuBtn");

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        document
            .getElementById("sidebar")
            .classList.toggle("open");

    });

}
    /* =========================================
   EDUPLEX LOGIN SYSTEM
========================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    /* SHOW / HIDE PASSWORD */

    const togglePassword =
        document.getElementById("togglePassword");

    const passwordInput =
        document.getElementById("loginPassword");


    togglePassword.addEventListener(
        "click",
        () => {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                togglePassword.textContent =
                    "🙈";

            } else {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "👁";

            }

        }
    );


    /* LOGIN */

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value
                    .trim();


            /* DEMO LOGIN */

            if (
                email ===
                "student@eduplex.com" &&

                password ===
                "123456"
            ) {

                localStorage.setItem(
                    "eduplexLoggedIn",
                    "true"
                );


                localStorage.setItem(
                    "eduplexUser",
                    email
                );


                window.location.href =
                    "dashboard.html";

            } else {

                alert(
                    "Invalid email or password!\n\n" +
                    "Use:\n" +
                    "Email: student@eduplex.com\n" +
                    "Password: 123456"
                );

            }

        }
    );

}
/* =========================================
   EDUPLEX LOGOUT SYSTEM
========================================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (confirmLogout) {

            localStorage.removeItem("eduplexLoggedIn");

            localStorage.removeItem("eduplexUser");

            window.location.href = "index.html";
        }

    });

}