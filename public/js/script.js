// Form Validation
(() => {
  'use strict';

  // Fetch all forms that need validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

// Rating display
const ratings = document.querySelectorAll('.rating-display');
ratings.forEach(rating => {
  const value = parseInt(rating.dataset.rating);
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= value) {
      starsHtml += '<i class="fas fa-star text-warning"></i>';
    } else {
      starsHtml += '<i class="far fa-star text-warning"></i>';
    }
  }
  rating.innerHTML = starsHtml;
});

// Rating input display
const ratingInput = document.querySelector('input[type="range"]');
const ratingDisplay = document.getElementById('rating-display');
if (ratingInput && ratingDisplay) {
  const updateRatingDisplay = () => {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingInput.value) {
        starsHtml += '<i class="fas fa-star text-warning"></i>';
      } else {
        starsHtml += '<i class="far fa-star text-warning"></i>';
      }
    }
    ratingDisplay.innerHTML = starsHtml;
  };
  
  ratingInput.addEventListener('input', updateRatingDisplay);
  updateRatingDisplay(); // Initial display
}

// Delete confirmation
const deleteButtons = document.querySelectorAll('.delete-button');
deleteButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    if (!confirm('Are you sure you want to delete this?')) {
      e.preventDefault();
    }
  });
});

// Real-time Search
const searchInput = document.querySelector('.search-input');
const searchResultsContainer = document.querySelector('#search-results');
const allListingsContainer = document.querySelector('#all-listings');

if (searchInput && searchResultsContainer) {
    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();

        if (query === '') {
            // If the query is empty, show all listings and hide search results
            allListingsContainer.style.display = 'flex';
            searchResultsContainer.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`/listings/api/search?query=${encodeURIComponent(query)}`);
            const listings = await response.json();

            if (listings.length > 0) {
                // Display search results and hide all listings
                allListingsContainer.style.display = 'none';
                let resultsHtml = '';
                for (const listing of listings) {
                    resultsHtml += `
                        <div class="col">
                            <a href="/listings/${listing._id}" class="listing-link">
                                <div class="listing-card card">
                                    <img src="${listing.image}" class="card-img-top" alt="${listing.title}" />
                                    <div class="card-img-overlay"></div>
                                    <div class="card-body">
                                        <h3 class="card-title">${listing.title}</h3>
                                        <p class="card-price">₹${listing.price.toLocaleString()}/night</p>
                                        <p class="card-location"><i class="fas fa-map-marker-alt"></i> ${listing.location}, ${listing.country}</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    `;
                }
                searchResultsContainer.innerHTML = resultsHtml;
            } else {
                // Display "No results found" and keep all listings hidden
                allListingsContainer.style.display = 'none';
                searchResultsContainer.innerHTML = '<p>No results found.</p>';
            }
        } catch (error) {
            console.error('Error during search:', error);
            searchResultsContainer.innerHTML = '<p>An error occurred during the search.</p>';
        }
    });
}