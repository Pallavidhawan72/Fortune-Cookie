
        document.addEventListener('DOMContentLoaded', function() {
        let fortunes = {
            general: [
                "A faithful friend is a strong defense.",
                "The early bird gets the worm, but the second mouse gets the cheese.",
                "Patience is a virtue, especially in traffic.",
                "Don't worry about the future, or you'll miss the present.",
                "Your kindness will lead to unexpected opportunities."
            ],
            love: [
                "Love is not about possession, it's about appreciation.",
                "A new romance will blossom in your life.",
                "Shared laughter is the key to lasting happiness.",
                "Your heart will lead you to extraordinary places.",
                "An old flame may reignite with new passion."
            ],
            career: [
                "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                "A creative idea will bring you recognition at work.",
                "Your hard work will soon pay off handsomely.",
                "A new mentor will guide you to new heights.",
                "Challenges at work will lead to significant growth."
            ],
            finance: [
                "A penny saved is a penny earned, but a dollar invested is a dollar multiplied.",
                "An unexpected financial gain is on its way.",
                "Prudent decisions today will secure your financial future.",
                "A new investment opportunity will prove profitable.",
                "Your financial foresight will lead to great prosperity."
            ],
            health: [
                "Take care of your body. It's the only place you have to live.",
                "A healthier lifestyle will bring you more energy.",
                "Listen to your body, it knows what's best for you.",
                "New exercise routines will boost your vitality.",
                "A balanced diet will bring you inner peace and outer glow."
            ]
        };

        let currentCategory = 'general';
        let fortuneHistory = {
            general: [],
            love: [],
            career: [],
            finance: [],
            health: []
        };
        let currentFortuneText = ''; // Global variable to hold the current fortune text

        const fortuneCookieImg = document.getElementById('fortuneCookieImg');
        const crackButton = document.getElementById('crackButton');
        const resetButton = document.getElementById('resetButton');
        const fortunePaper = document.getElementById('fortunePaper');
        const fortuneText = document.getElementById('fortuneText');
        const socialShare = document.getElementById('socialShare');
        const categorySelector = document.querySelector('.category-selector');
        const historyList = document.getElementById('historyList'); // Get the history list element

        // Explicitly hide reset button on load
        resetButton.classList.add('hidden');

        function getFortune(category) {
            const availableFortunes = fortunes[category].filter(
                fortune => !fortuneHistory[category].includes(fortune)
            );

            if (availableFortunes.length === 0) {
                fortuneHistory[category] = []; // Reset history if all messages displayed
                return fortunes[category][Math.floor(Math.random() * fortunes[category].length)];
            } else {
                const randomIndex = Math.floor(Math.random() * availableFortunes.length);
                const selectedFortune = availableFortunes[randomIndex];
                fortuneHistory[category].push(selectedFortune);
                return selectedFortune;
            }
        }

        function saveFortune(fortuneText, category) {
            let storedHistory = JSON.parse(localStorage.getItem('fortuneHistory')) || { general: [], love: [], career: [], finance: [], health: [] };
            
            const fortune = {
                text: fortuneText,
                category: category,
                date: new Date().toISOString(),
                clapCount: 0 // Initialize clap count to 0
            };

            if (!storedHistory[category]) {
                storedHistory[category] = [];
            }

            storedHistory[category].unshift(fortune);
            // Keep history limited to 10 items per category for simplicity
            if (storedHistory[category].length > 10) {
                storedHistory[category].pop();
            }
            localStorage.setItem('fortuneHistory', JSON.stringify(storedHistory));
            updateHistoryDisplay();
        }

        function updateFortuneClapCountInHistory(fortuneText, category, newClapCount) {
            let storedHistory = JSON.parse(localStorage.getItem('fortuneHistory'));
            if (!storedHistory || !storedHistory[category]) return;

            const fortuneIndex = storedHistory[category].findIndex(f => f.text === fortuneText);
            if (fortuneIndex !== -1) {
                storedHistory[category][fortuneIndex].clapCount = newClapCount;
                localStorage.setItem('fortuneHistory', JSON.stringify(storedHistory));
            }
        }

        function updateHistoryDisplay() {
            historyList.innerHTML = ''; // Clear current history display
            let storedHistory = JSON.parse(localStorage.getItem('fortuneHistory')) || { general: [], love: [], career: [], finance: [], health: [] };
            
            // Iterate through categories and then fortunes within each category
            for (const category in storedHistory) {
                if (storedHistory.hasOwnProperty(category)) {
                    storedHistory[category].forEach(fortune => {
                        const historyItem = document.createElement('div');
                        historyItem.classList.add('history-item');
                        historyItem.dataset.fortuneText = fortune.text;
                        historyItem.dataset.fortuneCategory = fortune.category;
                        historyItem.dataset.clapCount = fortune.clapCount || 0; // Store clap count
                        
                        const date = new Date(fortune.date).toLocaleDateString();
                        historyItem.innerHTML = `
                            <div class="history-date">${date}</div>
                            <div class="history-fortune">${fortune.text}</div>
                            <!-- <div class="history-claps">Claps: ${fortune.clapCount || 0}</div> -->
                        `;
                        
                        historyItem.addEventListener('click', function() {
                            const historicalCategory = this.dataset.fortuneCategory;
                            const historicalFortuneText = this.dataset.fortuneText; // Get the fortune text from dataset
                            const historicalClapCount = parseInt(this.dataset.clapCount || 0); // Get clap count from dataset
                            console.log('History item clicked. historicalFortuneText:', historicalFortuneText); // DEBUG
                            currentCategory = historicalCategory; // Set current category directly
                            currentFortuneText = historicalFortuneText; // Set current fortune text

                            // Update active class for category buttons
                            categoryButtons.forEach(btn => {
                                if (btn.dataset.category === historicalCategory) {
                                    btn.classList.add('active');
                                } else {
                                    btn.classList.remove('active');
                                }
                            });
                            document.getElementById('categoryTitle').textContent = `Choose Your Fortune Category`;
                            
                            // Reconstruct fortunePaper content
                            fortunePaper.innerHTML = `<p class="fortune-text" id="fortuneText">${historicalFortuneText}</p>
                                                    <div class="fortune-rating">
                                                        <button class="clap-button" id="clapButtonFortunePaper">👏</button>
                                                        <span id="currentClapCountDisplay">${historicalClapCount}</span>
                                                    </div>
                                                    <div class="share-buttons">
                                                        <button class="share-btn instagram" id="shareInstagramBtnPaper">
                                                            <i class="fab fa-instagram"></i> Instagram
                                                        </button>
                                                        <button class="share-btn facebook" id="shareFacebookBtnPaper">
                                                            <i class="fab fa-facebook"></i> Facebook
                                                        </button>
                                                        <button class="share-btn whatsapp" id="shareWhatsappBtnPaper">
                                                            <i class="fab fa-whatsapp"></i> WhatsApp
                                                        </button>
                                                    </div>`;

                            // Re-get fortuneText element as it's been re-created
                            const updatedFortuneTextElement = fortunePaper.querySelector('#fortuneText');
                            console.log('updatedFortuneTextElement after innerHTML:', updatedFortuneTextElement); // DEBUG
                            if (updatedFortuneTextElement) {
                                updatedFortuneTextElement.textContent = historicalFortuneText; // Display the fortune text
                                console.log('updatedFortuneTextElement textContent set to:', updatedFortuneTextElement.textContent); // DEBUG
                            }
                            
                            fortunePaper.classList.add('show'); // Show fortune paper
                            fortuneCookieImg.classList.add('hidden'); // Hide cookie image
                            crackButton.classList.add('hidden'); // Hide crack button
                            resetButton.classList.remove('hidden'); // Show reset button
                            console.log('Fortune paper visibility:', fortunePaper.classList.contains('show'));
                        });
                        historyList.appendChild(historyItem);
                    });
                }
            }
        }

        function crackCookie() {
            fortuneCookieImg.classList.add('hidden');
            crackButton.classList.add('hidden');
            setTimeout(() => {
                currentFortuneText = getFortune(currentCategory); // Store the fortune text
                fortunePaper.innerHTML = `<p class="fortune-text" id="fortuneText">${currentFortuneText}</p>
                                        <div class="fortune-rating">
                                            <button class="clap-button" id="clapButtonCrack">👏</button>
                                            <span id="currentClapCountDisplay">0</span>
                                        </div>
                                        <div class="share-buttons">
                                            <button class="share-btn instagram" id="shareInstagramBtnCrack">
                                                <i class="fab fa-instagram"></i> Instagram
                                            </button>
                                            <button class="share-btn facebook" id="shareFacebookBtnCrack">
                                                <i class="fab fa-facebook"></i> Facebook
                                            </button>
                                            <button class="share-btn whatsapp" id="shareWhatsappBtnCrack">
                                                <i class="fab fa-whatsapp"></i> WhatsApp
                                            </button>
                                        </div>`;
                fortunePaper.classList.add('show');
                resetButton.classList.remove('hidden');
                saveFortune(currentFortuneText, currentCategory); // Save the fortune after display

            }, 500); // Allow time for cookie to disappear
        }

        function resetCookie() {
            fortunePaper.classList.remove('show');
            resetButton.classList.add('hidden');
            // Clear fortune history from localStorage
            localStorage.removeItem('fortuneHistory');
            updateHistoryDisplay(); // Update display to show empty history
            setTimeout(() => {
                fortuneCookieImg.classList.remove('hidden');
                crackButton.classList.remove('hidden');
                // Reset clap count on the current display. hideFortune handles this.
            }, 300); // Allow time for paper to disappear
        }

        function handleClap(event) {
            // Find the clap count element relative to the clicked clap button
            let clapCountElement = event.target.nextElementSibling; 
            if (!clapCountElement) { 
                clapCountElement = event.target.closest('.fortune-rating').querySelector('span'); 
            }

            if (clapCountElement) {
                let clapCount = parseInt(clapCountElement.textContent);
                clapCountElement.textContent = clapCount + 1;

                // Update clap count in history
                if (currentFortuneText && currentCategory) {
                    updateFortuneClapCountInHistory(currentFortuneText, currentCategory, clapCount + 1);
                }
            }
        }

        function shareFortune(platform) {
            const fortune = document.getElementById('fortuneText').textContent;
            let shareUrl = '';
            const encodedFortune = encodeURIComponent(fortune);

            switch (platform) {
                case 'instagram':
                    shareUrl = `https://www.instagram.com/share?text=${encodedFortune}%20%23FortuneCookie`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodedFortune}%20%23FortuneCookie`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodedFortune}%20%23FortuneCookie`;
                    break;
            }
            window.open(shareUrl, '_blank');
        }

        function hideFortune() {
            fortunePaper.classList.remove('show');
            resetButton.classList.add('hidden');
            fortuneCookieImg.classList.remove('hidden');
            crackButton.classList.remove('hidden');
            // Reset clap count on the currently displayed paper, if it exists
            const currentClapCountElement = document.getElementById('currentClapCountDisplay');
            if(currentClapCountElement) {
                currentClapCountElement.textContent = '0';
            }
            // Also reset currentFortuneText and currentCategory when hiding fortune
            currentFortuneText = '';
            // currentCategory = 'general'; // Or whatever default category
            // Update active category button to general
            categoryButtons.forEach(btn => {
                if (btn.dataset.category === currentCategory) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            document.getElementById('categoryTitle').textContent = `Choose Your Fortune Category`;
        }

        document.getElementById('crackButton').addEventListener('click', function() {
            crackCookie();
        });

        document.getElementById('resetButton').addEventListener('click', function() {
            resetCookie();
        });

        // Event listeners for social media buttons - these are handled by event delegation on document.body
        // The original initial share buttons on the page (before crack or history item) are handled here.
        const initialShareInstagramBtn = document.getElementById('shareInstagramBtn');
        if (initialShareInstagramBtn) {
            initialShareInstagramBtn.addEventListener('click', () => shareFortune('instagram'));
        }
        const initialShareFacebookBtn = document.getElementById('shareFacebookBtn');
        if (initialShareFacebookBtn) {
            initialShareFacebookBtn.addEventListener('click', () => shareFortune('facebook'));
        }
        const initialShareWhatsappBtn = document.getElementById('shareWhatsappBtn');
        if (initialShareWhatsappBtn) {
            initialShareWhatsappBtn.addEventListener('click', () => shareFortune('whatsapp'));
        }

        // Category selection
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const selectedCategory = this.dataset.category;
                currentCategory = selectedCategory;
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                document.getElementById('categoryTitle').textContent = `Choose Your Fortune Category`;
                // Clear any displayed fortune when category changes
                hideFortune();
            });
        });

        // Event delegation for dynamically created elements (clap and share buttons)
        document.body.addEventListener('click', function(event) {
            if (event.target.closest('.clap-button')) {
                handleClap(event);
            } else if (event.target.closest('.share-btn.instagram')) {
                shareFortune('instagram');
            } else if (event.target.closest('.share-btn.facebook')) {
                shareFortune('facebook');
            } else if (event.target.closest('.share-btn.whatsapp')) {
                shareFortune('whatsapp');
            }
        });

        // Initial category setting and history display on load
        document.querySelector('.category-btn[data-category="general"]').click();
        updateHistoryDisplay(); // Call to load history on page load
        });
    