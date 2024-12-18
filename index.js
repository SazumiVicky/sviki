const mobileMenuBtn = document.querySelector('.sviki-mobile-menu-btn');
const mobileMenu = document.querySelector('.sviki-mobile-menu');
const mobileMenuClose = document.querySelector('.sviki-mobile-menu-close');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        if (href === "#") return;
        
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            mobileMenu.classList.remove('active');
        }
    });
});

document.querySelectorAll('.sviki-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

const searchInput = document.querySelector('.sviki-search-input input');
const searchButton = document.querySelector('.sviki-btn-primary');
const destinationCards = document.querySelectorAll('.sviki-card');

function scrollToDestination(card) {
    const headerOffset = 70;
    const elementPosition = card.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });

    card.classList.add('highlight');
    setTimeout(() => {
        card.classList.remove('highlight');
    }, 2000);
}

function searchDestination() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const activeCategory = document.querySelector('.quick-link.active')?.dataset.category || 'all';

    destinationCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const category = card.dataset.category;
        const matchesSearch = searchTerm === '' || title.includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || category === activeCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

searchButton.addEventListener('click', searchDestination);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchDestination();
    }
});

document.querySelectorAll('.sviki-btn-book').forEach(button => {
    button.addEventListener('click', function() {
        const destination = this.closest('.sviki-card').querySelector('h3').textContent;
        console.log('Booking for:', destination);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.querySelector('.sviki-booking-form');
    if (bookingForm) {
        const bookingButton = bookingForm.querySelector('button[type="submit"]');
        let isBooked = false;

        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'popup-overlay';
        popupOverlay.innerHTML = `
            <div class="popup">
                <h3>Perhatian</h3>
                <p>Mohon lengkapi semua data pemesanan</p>
                <button class="popup-btn">OK</button>
            </div>
        `;
        document.body.appendChild(popupOverlay);

        const closePopup = () => {
            popupOverlay.classList.add('closing');
            setTimeout(() => {
                popupOverlay.classList.remove('closing');
                popupOverlay.classList.remove('active');
                popupOverlay.style.display = 'none';
            }, 300);
        };

        popupOverlay.querySelector('.popup-btn').addEventListener('click', closePopup);
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) closePopup();
        });

        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const destination = document.getElementById('destination').value;
            const visitDate = document.getElementById('visit-date').value;
            const visitTime = document.getElementById('visit-time').value;
            const visitors = document.getElementById('visitors').value;

            if (destination && visitDate && visitTime && visitors) {
                if (!isBooked) {
                    bookingButton.innerHTML = `
                        <i class="ri-check-line"></i> Batalkan Pesanan
                    `;
                    bookingButton.classList.add('booked');
                    isBooked = true;
                } else {
                    bookingButton.innerHTML = `
                        <i class="ri-calendar-check-line"></i> Pesan Sekarang
                    `;
                    bookingButton.classList.remove('booked');
                    isBooked = false;
                }
            } else {
                popupOverlay.style.display = 'flex';
                setTimeout(() => {
                    popupOverlay.classList.add('active');
                }, 10);
                
                if (!isBooked) {
                    bookingButton.innerHTML = `
                        <i class="ri-calendar-check-line"></i> Pesan Sekarang
                    `;
                    bookingButton.classList.remove('booked');
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const existingPopups = document.querySelectorAll('.popup-overlay');
    existingPopups.forEach(popup => popup.remove());

    const warningPopup = document.createElement('div');
    warningPopup.className = 'popup-overlay';
    warningPopup.innerHTML = `
        <div class="popup">
            <h3>Perhatian</h3>
            <p>Mohon lengkapi semua data pemesanan</p>
            <button class="popup-btn">OK</button>
        </div>
    `;
    document.body.appendChild(warningPopup);

    const confirmationPopup = document.createElement('div');
    confirmationPopup.className = 'popup-overlay';
    confirmationPopup.innerHTML = `
        <div class="popup">
            <h3>Konfirmasi Pembatalan</h3>
            <p>Apakah Anda yakin ingin membatalkan pemesanan ini?</p>
            <div class="popup-buttons">
                <button class="popup-btn popup-btn-cancel">Tidak</button>
                <button class="popup-btn popup-btn-confirm">Ya, Batalkan</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmationPopup);

    const showWarningPopup = () => {
        if (warningPopup.style.display === 'flex') return;
        warningPopup.style.display = 'flex';
        setTimeout(() => {
            warningPopup.classList.add('active');
        }, 10);
    };

    const closeWarningPopup = () => {
        warningPopup.classList.add('closing');
        setTimeout(() => {
            warningPopup.classList.remove('closing');
            warningPopup.classList.remove('active');
            warningPopup.style.display = 'none';
        }, 300);
    };

    const closeConfirmationPopup = () => {
        confirmationPopup.classList.add('closing');
        setTimeout(() => {
            confirmationPopup.classList.remove('closing');
            confirmationPopup.classList.remove('active');
            confirmationPopup.style.display = 'none';
        }, 300);
    };

    warningPopup.querySelector('.popup-btn').addEventListener('click', closeWarningPopup);
    warningPopup.addEventListener('click', (e) => {
        if (e.target === warningPopup) closeWarningPopup();
    });

    const bookingButtons = document.querySelectorAll('.sviki-btn-book');
    bookingButtons.forEach(button => {
        button.isBooked = false;

        button.addEventListener('click', function(e) {
            e.preventDefault();
            const form = this.closest('form');
            const allInputs = form ? Array.from(form.querySelectorAll('input, select')).every(input => input.value.trim() !== '') : true;

            if (!allInputs) {
                showWarningPopup();
                return;
            }

            if (!this.isBooked) {
                this.innerHTML = `
                    <i class="ri-check-line"></i> Berhasil Booking
                `;
                this.classList.add('booked');
                this.isBooked = true;
            } else {
                confirmationPopup.style.display = 'flex';
                confirmationPopup.currentButton = this;
                setTimeout(() => {
                    confirmationPopup.classList.add('active');
                }, 10);
            }
        });
    });

    confirmationPopup.querySelector('.popup-btn-cancel').addEventListener('click', closeConfirmationPopup);

    confirmationPopup.querySelector('.popup-btn-confirm').addEventListener('click', () => {
        if (confirmationPopup.currentButton) {
            confirmationPopup.currentButton.innerHTML = `
                <i class="ri-calendar-check-line"></i> Booking Sekarang
            `;
            confirmationPopup.currentButton.classList.remove('booked');
            confirmationPopup.currentButton.isBooked = false;
        }
        closeConfirmationPopup();
    });

    confirmationPopup.addEventListener('click', (e) => {
        if (e.target === confirmationPopup) {
            closeConfirmationPopup();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.sviki-search-input input');
    const searchButton = document.querySelector('.sviki-btn-primary');
    const destinationCards = document.querySelectorAll('.sviki-card');
    
    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'search-suggestions';
    document.querySelector('.sviki-search-input').appendChild(suggestionBox);

    const destinations = Array.from(destinationCards).map(card => ({
        name: card.querySelector('h3').textContent.trim(),
        element: card
    }));

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length > 0) {
            const filteredDestinations = destinations.filter(dest => 
                dest.name.toLowerCase().includes(searchTerm)
            );
            showSuggestions(filteredDestinations);
            filterDestinationCards(filteredDestinations);
        } else {
            suggestionBox.style.display = 'none';
            destinationCards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }
    });

    function filterDestinationCards(filteredDestinations) {
        destinationCards.forEach(card => {
            const cardTitle = card.querySelector('h3').textContent.trim();
            const shouldShow = filteredDestinations.some(dest => dest.name === cardTitle);
            
            if (shouldShow) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 200);
            }
        });
    }

    function showSuggestions(suggestions) {
        if (suggestions.length > 0) {
            const html = suggestions.map(dest => `
                <div class="suggestion-item">
                    <i class="ri-map-pin-line"></i>
                    <div class="suggestion-content">
                        <div class="suggestion-name">${dest.name}</div>
                        <div class="suggestion-location">${dest.location}</div>
                    </div>
                </div>
            `).join('');
            
            suggestionBox.innerHTML = html;
            suggestionBox.classList.add('show');
            suggestionBox.style.display = 'block';
        } else {
            suggestionBox.classList.remove('show');
            suggestionBox.style.display = 'none';
        }
    }

    suggestionBox.addEventListener('click', function(e) {
        const item = e.target.closest('.suggestion-item');
        if (item) {
            const selectedName = item.querySelector('div > div').textContent;
            searchInput.value = selectedName;
            suggestionBox.style.display = 'none';

            const selectedDestination = destinations.find(dest => dest.name === selectedName);
            if (selectedDestination) {
                filterDestinationCards([selectedDestination]);
                scrollToDestination(selectedDestination.element);
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.sviki-search-input')) {
            suggestionBox.style.display = 'none';
        }
    });

    searchInput.addEventListener('search', function() {
        if (this.value === '') {
            destinationCards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }
    });
});

let lastScroll = 0;
const header = document.querySelector('.sviki-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('hide');
        header.classList.remove('scrolled');
        return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('hide');
        header.classList.remove('show');
    } else {
        header.classList.remove('hide');
        header.classList.add('show');
        header.classList.add('scrolled');
    }
    
    lastScroll = currentScroll;
});

document.addEventListener('mousemove', (e) => {
    if (e.clientY <= 60) {
        header.classList.remove('hide');
        header.classList.add('show');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const categoryLinks = document.querySelectorAll('.quick-link');
    const destinationCards = document.querySelectorAll('.sviki-card');
    
    function filterDestinations(category) {
        destinationCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            filterDestinations(category);
        });
    });
});

document.querySelector('.sviki-btn-primary').addEventListener('click', function() {
    const destinationSection = document.getElementById('destinasi');
    if (destinationSection) {
        const headerOffset = 70;
        const elementPosition = destinationSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        const searchTerm = document.querySelector('.sviki-search-input input').value.trim().toLowerCase();
        if (searchTerm) {
            searchDestination();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const destinationInput = document.getElementById('destination');
    const visitorsInput = document.getElementById('visitors');
    const pricePerPersonEl = document.querySelector('.price-per-person');
    const totalVisitorsEl = document.querySelector('.total-visitors');
    const totalPriceEl = document.querySelector('.total-price');
    const suggestionsDiv = document.querySelector('.destination-suggestions');

    const destinationPrices = {
        'Pantai Kuta': {
            price: 150000,
            location: 'Bali, Indonesia'
        },
        'Borobudur': {
            price: 350000,
            location: 'Yogyakarta, Indonesia'
        },
        'Gunung Bromo': {
            price: 275000,
            location: 'Jawa Timur, Indonesia'
        }
    };

    function formatCurrency(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    }

    function updateCalculator() {
        const selectedDestination = destinationInput.value.split(',')[0].trim();
        const visitors = parseInt(visitorsInput.value) || 1;
        const pricePerPerson = destinationPrices[selectedDestination]?.price || 0;
        const totalPrice = pricePerPerson * visitors;

        pricePerPersonEl.textContent = formatCurrency(pricePerPerson);
        totalVisitorsEl.textContent = `${visitors} Orang`;
        totalPriceEl.textContent = formatCurrency(totalPrice);
    }

    destinationInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        if (searchTerm.length > 0) {
            const filteredDestinations = Object.entries(destinationPrices)
                .filter(([name, data]) => 
                    name.toLowerCase().includes(searchTerm) || 
                    data.location.toLowerCase().includes(searchTerm)
                )
                .map(([name, data]) => ({
                    name: name,
                    location: data.location
                }));
            showSuggestions(filteredDestinations);
        } else {
            suggestionsDiv.style.display = 'none';
        }
        updateCalculator();
    });

    suggestionsDiv.addEventListener('click', function(e) {
        const item = e.target.closest('.suggestion-item');
        if (item) {
            const name = item.querySelector('.suggestion-name').textContent;
            const location = item.querySelector('.suggestion-location').textContent;
            destinationInput.value = `${name}, ${location}`;
            suggestionsDiv.style.display = 'none';
            updateCalculator();
        }
    });

    visitorsInput.addEventListener('input', function() {
        const value = parseInt(this.value, 10);
        if (isNaN(value)) {
            this.value = 1;
        } else if (value < 1) {
            this.value = 1;
        } else if (value > 100) {
            this.value = 100;
        }
        updateCalculator();
    });

    visitorsInput.value = 1;
    updateCalculator();
});

function showSuggestions(suggestions) {
    const suggestionsDiv = document.querySelector('.destination-suggestions');
    if (suggestions.length > 0) {
        const html = suggestions.map(dest => `
            <div class="suggestion-item">
                <i class="ri-map-pin-line"></i>
                <div class="suggestion-content">
                    <div class="suggestion-name">${dest.name}</div>
                    <div class="suggestion-location">${dest.location}</div>
                </div>
            </div>
        `).join('');
        
        suggestionsDiv.innerHTML = html;
        suggestionsDiv.style.display = 'block';
    } else {
        suggestionsDiv.style.display = 'none';
    }
}