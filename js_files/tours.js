// tours.js

let currentPage = 1;
const toursPerPage = 3;

// Function to fetch tours data
async function fetchTours() {
    const response = await fetch('json_files/tours.json');
    return await response.json();
}

// Function to create a tour card
function createTourCard(tour) {
    return `
        <article class="hover-effect bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 relative">
            <span class="absolute top-4 left-4 text-orange-400 bg-white text-xs font-semibold px-3 py-1 rounded-full z-20">
                ${tour.badge}
            </span>
            <button class="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md z-20">
                <img src="assets/heart.png" alt="heart" class="h-4">
            </button>
            <figure class="relative">
                <img src="${tour.image}" alt="${tour.title}" class="w-full h-56 object-cover rounded-t-2xl">
                <div class="absolute -bottom-0 z-20 right-4 bg-white px-3 py-1 rounded-2xl text-sm flex items-center border-black drop-shadow-md">
                    ⭐ <span class="font-semibold text-black ml-1">${tour.rating}</span>(${tour.reviews} reviews)
                </div>
            </figure>
            <figcaption class="p-5 text-left rounded-t-2xl -translate-y-4 bg-white">
                <h3 class="text-lg font-bold">${tour.title}</h3>
                <p class="text-gray-500 text-sm mt-1 flex items-center"><img src="assets/clock.png" alt="clock" class="h-3 mr-1 opacity-50"> ${tour.duration} <img src="assets/user.png" alt="user" class="h-3 mr-1 ml-4 opacity-50"> ${tour.guests}</p>
                <div class="flex items-center justify-between mt-6">
                    <p class="text-lg font-bold">$${tour.price} <span class="text-sm text-gray-500">/ person</span></p>
                    <button class="btn-hover bg-gray-300 text-black text-sm font-semibold px-4 py-2 rounded-full">Book Now</button>
                </div>
            </figcaption>
        </article>
    `;
}

// Function to render tours
async function renderTours() {
    const tours = await fetchTours();
    const tourGrid = document.getElementById('tourGrid');
    const startIndex = (currentPage - 1) * toursPerPage;
    const endIndex = startIndex + toursPerPage;
    const toursToRender = tours.slice(startIndex, endIndex);

    toursToRender.forEach(tour => {
        tourGrid.innerHTML += createTourCard(tour);
    });

    if (endIndex >= tours.length) {
        document.getElementById('loadMoreBtn').style.display = 'none';
    }
}

// Event listener for Load More button
document.getElementById('loadMoreBtn').addEventListener('click', () => {
    currentPage++;
    renderTours();
});

// Initial render
renderTours();


(function() {
    const blogContainer = document.getElementById('tourGrid');
    
    blogContainer.addEventListener('click', function(event) {
        const heartButton = event.target.closest('button');
        if (heartButton && heartButton.querySelector('img[alt="heart"]')) {
            const heartIcon = heartButton.querySelector('img');
            
            if (heartIcon.src.includes('heart-red.png')) {
                // If it's already red, change it back to the original
                heartIcon.src = 'assets/heart.png';
                heartButton.classList.remove('liked');
            } else {
                // If it's not red, change it to red
                heartIcon.src = 'assets/heart-red.png';
                heartButton.classList.add('liked');
            }
        }
    });
})()