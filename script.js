document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Rent estimate form submission
    const estimateForm = document.getElementById('estimate-btn');
    const propertyAddress = document.getElementById('property-address');
    const estimateResults = document.getElementById('estimate-results');
    
    estimateForm.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (propertyAddress.value.trim() === '') {
            alert('Please enter a property address');
            return;
        }
        
        // Show loading state
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Hide loading state
            this.innerHTML = 'Get Estimate';
            
            // Show results section
            estimateResults.classList.remove('hidden');
            
            // Scroll to results
            estimateResults.scrollIntoView({ behavior: 'smooth' });
            
            // Generate comparable listings
            generateComparableListings();
            
            // Initialize market trends chart
            initMarketTrendsChart();
        }, 1500);
    });

    // Refresh data button
    const refreshBtn = document.getElementById('refresh-btn');
    const lastUpdated = document.getElementById('last-updated');
    
    refreshBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Show loading state
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Hide loading state
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            
            // Update last updated time
            const now = new Date();
            lastUpdated.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Generate new comparable listings
            generateComparableListings();
            
            // Update chart with new data
            updateMarketTrendsChart();
        }, 1000);
    });

    // Generate random comparable listings
    function generateComparableListings() {
        const compsList = document.getElementById('comparable-listings');
        compsList.innerHTML = '';
        
        const propertyTypes = ['Apartment', 'Condo', 'Townhouse', 'House'];
        const streets = ['Main St', 'Elm St', 'Oak Ave', 'Maple Rd', 'Pine Blvd', 'Cedar Ln'];
        const cities = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'];
        
        // Generate 5 random comparable listings
        for (let i = 0; i < 5; i++) {
            const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
            const streetNum = Math.floor(Math.random() * 200) + 100;
            const street = streets[Math.floor(Math.random() * streets.length)];
            const city = cities[Math.floor(Math.random() * cities.length)];
            const price = Math.floor(Math.random() * 1000) + 1500;
            
            const compItem = document.createElement('div');
            compItem.className = 'comp-item';
            compItem.innerHTML = `
                <div class="comp-address">
                    <strong>${type}</strong> • ${streetNum} ${street}, ${city}
                </div>
                <div class="comp-price">$${price}/mo</div>
            `;
            
            compsList.appendChild(compItem);
        }
    }

    // Initialize market trends chart
    function initMarketTrendsChart() {
        const ctx = document.getElementById('market-trends-chart').getContext('2d');
        
        // Generate random data for the chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const data = [];
        let lastValue = 2000;
        
        for (let i = 0; i < months.length; i++) {
            const change = (Math.random() * 100) - 30; // Random change between -30 and +70
            lastValue += change;
            data.push(Math.round(lastValue));
        }
        
        window.marketTrendsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Average Rent Price',
                    data: data,
                    borderColor: '#4a6bff',
                    backgroundColor: 'rgba(74, 107, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4a6bff',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `$${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return `$${value}`;
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Update market trends chart with new data
    function updateMarketTrendsChart() {
        if (!window.marketTrendsChart) return;
        
        // Generate new random data
        const newData = [];
        let lastValue = 2000;
        
        for (let i = 0; i < 7; i++) {
            const change = (Math.random() * 100) - 30;
            lastValue += change;
            newData.push(Math.round(lastValue));
        }
        
        // Update chart data
        window.marketTrendsChart.data.datasets[0].data = newData;
        window.marketTrendsChart.update();
        
        // Update trend summary
        const trendEl = document.querySelector('.trend-summary');
        const firstValue = newData[0];
        const lastValueNew = newData[newData.length - 1];
        const percentChange = ((lastValueNew - firstValue) / firstValue * 100).toFixed(1);
        
        if (percentChange > 0) {
            trendEl.innerHTML = `<i class="fas fa-arrow-up trend-up"></i> Rental prices in your area have increased by ${Math.abs(percentChange)}% over the last ${newData.length - 1} months.`;
        } else if (percentChange < 0) {
            trendEl.innerHTML = `<i class="fas fa-arrow-down trend-down"></i> Rental prices in your area have decreased by ${Math.abs(percentChange)}% over the last ${newData.length - 1} months.`;
        } else {
            trendEl.innerHTML = `<i class="fas fa-equals"></i> Rental prices in your area have remained stable over the last ${newData.length - 1} months.`;
        }
        
        // Update estimate amount based on trend
        const estimateAmount = document.getElementById('estimate-amount');
        const currentEstimate = parseInt(estimateAmount.textContent.replace(/,/g, ''));
        const newEstimate = Math.round(currentEstimate * (1 + percentChange / 100));
        estimateAmount.textContent = newEstimate.toLocaleString();
    }

    // Form submissions
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
});