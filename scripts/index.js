const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(res => res.json())
    .then(data => displayLessons(data))
}

const loadWords = (level_no) => {
    const url = `https://openapi.programming-hero.com/api/level/${level_no}`;
    fetch(url)
    .then(res => res.json())
    .then(data => displayWords(data))
}

const openModal = (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(data => displayModal(data.data))
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const displayModal = (word) => {
    const modalContainer = document.getElementById("my_modal_5");
    modalContainer.innerHTML = "";

    const div = document.createElement("div");
    div.classList.add("modal-box", "bg-white", "text-black");

    const synonymsHTML = word.synonyms && word.synonyms.length > 0 
        ? word.synonyms.map(syn => `<p class="shadow text-white p-2 rounded-md bg-black text-center text-[17px]">${syn}</p>`).join('')
        : '<p class="text-gray-400 italic">No synonyms found</p>';
    div.innerHTML = `
        <h3 class="text-3xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> ${word.pronunciation})</h3>
        <p class="py-4">Meaning</p>
        <p class="text-3xl font-bangla">${word.meaning}</p>
        <p>Example</p>
        <p class="text-xl font-semibold">${word.sentence}</p>
        <p>সমার্থক শব্দগুলো</p>
        <div class="grid grid-cols-3 gap-5">
            ${synonymsHTML}
        </div>
        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn btn-primary btn-outline">Complete Learning</button>
            </form>
        </div>
    `;
    modalContainer.appendChild(div);
    modalContainer.showModal();
}

const displayWords = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.data.length === 0){
        const div = document.createElement("div");
        div.classList.add("flex", "flex-col", "justify-center", "items-center", "gap-3", "text-center", "col-span-full");
        div.innerHTML = `
            <img src="assets/alert-error.png" alt="Empty Lesson" class="w-40 h-40">
            <p class="text-gray-600">এই লেসনে কোন শব্দ নেই</p>
            <h2 class="text-3xl">অনুগ্রহপূর্বক অন্য একটি Lesson সিলেক্ট করুন</h2>
        `;
        wordContainer.appendChild(div);
        return;
    }

    words.data.forEach(word => {
        const div = document.createElement("div");
        div.classList.add("flex", "flex-col", "justify-center", "items-center", "h-70", "rounded-lg", "bg-white", "p-5", "shadow");
        div.innerHTML = `
            <h2 class="text-3xl font-bold mt-5">${word.word? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="mt-2 mb-2">Meaning/Pronouciation</p>
            <p class="text-3xl font-bangla mb-7">"${word.meaning? word.meaning : "অর্থ পাওয়া যায়নি"}/${word.pronunciation? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</p>
            <div class="flex justify-between items-center w-full">
                <button onclick="openModal('${word.id}')" id = "btn-modal-${word.id}" class="btn btn-square">
                    <i class="fa-solid fa-circle-info"></i>
                </button>
                <button onclick="pronounceWord('${word.word}')" class="btn btn-square">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        `;
        wordContainer.appendChild(div);
    })
}

const displayLessons = (lessons) => {
    const lessonsContainer = document.getElementById("level-container");
    lessonsContainer.innerHTML = "";
    const lessonDiv = document.createElement("ul");
    lessonDiv.classList.add("grid", "grid-cols-4",  "md:grid-cols-7", "justify-center", "items-center", "gap-4", "p-2", "shadow", "bg-base-100", "rounded-box", "w-full", "max-w-6xl");
    lessons.data.forEach(lesson => {
        const li = document.createElement("li");

        li.innerHTML = `
                <button onclick = "loadWords(${lesson.level_no})" class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>Lesson ${lesson.level_no}</button>
        `;

        lessonDiv.appendChild(li);

        
    })
    lessonsContainer.appendChild(lessonDiv);
}

loadLessons()

document.getElementById("btn-search").addEventListener("click", () => {
    const searchInput = document.getElementById("input-search");
    const searchText = searchInput.value.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res => res.json())
    .then(data => {
        const words = data.data;
        const filteredWords = words.filter(word => word.word.toLowerCase().includes(searchText));
        displayWords({data: filteredWords});
    });
})

const toggles = document.querySelectorAll('.faq-toggle');

toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const answer = toggle.nextElementSibling;
        const icon = toggle.querySelector('.icon');

        answer.classList.toggle('hidden');

        if (answer.classList.contains('hidden')) {
            icon.textContent = '+';
            icon.style.transform = 'rotate(0deg)';
        } else {
            icon.textContent = '−'; 
            icon.style.transform = 'rotate(180deg)';
        }
    });
});