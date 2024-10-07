function getTimeString(time) {
    const year = parseInt(time / 31536000);
    let remainingSecond = time % 31536000;
    const mon = parseInt(remainingSecond / 2592000);
    remainingSecond = remainingSecond % 2592000;
    const day = parseInt(time / 86400);
    remainingSecond = time % 86400;
    const hour = parseInt(remainingSecond / 3600);
    remainingSecond = remainingSecond % 3600;
    const min = parseInt(remainingSecond / 60);
    if (year == 0 && mon != 0) {
        return `${mon} mon ${day} d ${hour} h ago`
    }
    else if (year == 0 && mon == 0) {
        return ` ${hour} h ${min} min ago`
    }
    else {
        return `${year}y ${mon} mon ago`
    }


}

const loadCategoriesVideos = (id) => {
    console.log(id)
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then((res) => res.json())
        .then((data) => displayVideos(data.category))
        .catch((error) => console.log(error));
};

const load_categories = () => {
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
        .then((res) => res.json())
        .then((data) => display_categories(data.categories))
        .catch((error) => console.log(error));
};

// Remove Active Buttons
const removeActiveB = () => {
    const buttons = document.getElementsByClassName("btn");
    for (let btn of buttons) {
        btn.classList.remove("active");
    }
}

//showing video details
const loadDetails = async (videoId) => {
    console.log(videoId);
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.video);
};

const displayDetails = (video) => {
    const details = document.getElementById("modal-content");
    details.innerHTML =
        `<img src=${video.thumbnail}/>
        <p>${video.description}</p>
        `
    document.getElementById("customModal").showModal();
}



const display_categories = (data) => {
    const categoryContainer = document.getElementById("categories");
    data.forEach((item) => {
        const button = document.createElement("button");
        button.classList = "btn";
        button.innerText = item.category;
        button.onclick = () => {
            loadCategoriesVideos(item.category_id);
            removeActiveB();
            button.classList.add("active");
        }
        categoryContainer.append(button);
    })
}


const loadVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then((res) => res.json())
        .then((data) => displayVideos(data.videos))
        .catch((error) => console.log(error));

}

const displayVideos = (data) => {
    const videoContainer = document.getElementById("videos")
    videoContainer.innerHTML = "";
    if (data.length == 0) {
        videoContainer.classList.remove('grid');
        videoContainer.innerHTML = `<div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
        <img src="assets/Icon.png" alt="">
        <h2 class="text-center text-xl font-bold">"No Content Here in this category"</h2>
    </div>`;
        return
    }
    else {
        videoContainer.classList.add("grid");
    }

    data.forEach((item) => {
        // console.log(item)
        const card = document.createElement("div");
        card.classList = "card card-compact"
        card.innerHTML = `
        <figure class="h-[200px] relative">
    <img class="h-full w-full object-cover"
      src=${item.thumbnail}
      alt="Shoes" />
      ${item.others.posted_date.length == 0 ? `` : `<span class="absolute text-xs right-2 bottom-2 bg-black text-white rounded p-1">
      ${getTimeString(item.others.posted_date)}
      </span>`}
     
  </figure>
  <div class="px-0 py-2 flex gap-2">
  <div>
  <img class="w-10 h-10 rounded-full object-cover" src=${item.authors[0].profile_picture}>
  </div>
    <div>
    <h2 class="font-bold">${item.title}
    </h2>
    <div class="flex items-center gap-2">
     <p class="text-grey-400">${item.authors[0].profile_name}
    </p>
    ${item.authors[0].verified === true ? `<img class="w-5" src="https://img.icons8.com/?size=100&id=D9RtvkuOe31p&format=png&color=000000" alt=""/>
    </div>`: ``}

    </div>
    <p> <button onclick="loadDetails('${item.video_id}')" class="btn btn-sm bg-green-200">Details</p>
    </div>
  </div>
        `
        videoContainer.append(card)
    });
};




document.getElementById("search_input").addEventListener("keyup", (e) => {
    loadVideos(e.target.value)
});
load_categories();
loadVideos();