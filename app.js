document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------
    // 1. Initial QR Code Setup
    // -----------------------------------------------------
    const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: "https://antigravity.dev",
        image: "",
        margin: 10,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "H"
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 5,
            crossOrigin: "anonymous",
        },
        dotsOptions: {
            color: "#6366f1",
            type: "square"
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        cornersSquareOptions: {
            color: "#6366f1",
            type: "square"
        },
        cornersDotOptions: {
            color: "#6366f1",
            type: "square"
        }
    });

    // Render the initial QR Code
    qrCode.append(document.getElementById("qr-code"));

    // -----------------------------------------------------
    // 2. Elements Selection
    // -----------------------------------------------------
    const dataInput = document.getElementById('qr-data');
    const dotsColorInput = document.getElementById('dots-color');
    const bgColorInput = document.getElementById('bg-color');
    const dotsStyleCards = document.querySelectorAll('#dots-style-group .radio-card');
    const cornersStyleCards = document.querySelectorAll('#corners-style-group .radio-card');
    const logoInput = document.getElementById('logo-input');
    const dropArea = document.getElementById('drop-area');
    const fileNameDisplay = document.getElementById('file-name');
    const clearLogoBtn = document.getElementById('clear-logo');
    const downloadBtn = document.getElementById('download-btn');
    const formatSelect = document.getElementById('download-format');
    const themeToggle = document.getElementById('theme-toggle');

    // -----------------------------------------------------
    // 3. Update Function
    // -----------------------------------------------------
    function updateQRCode() {
        const data = dataInput.value || " ";
        const dotsColor = dotsColorInput.value;
        const bgColor = bgColorInput.value;
        
        // Get active styles
        const activeDotCard = document.querySelector('#dots-style-group .radio-card.active');
        const dotsStyle = activeDotCard ? activeDotCard.dataset.value : 'square';
        
        const activeCornerCard = document.querySelector('#corners-style-group .radio-card.active');
        const cornersStyle = activeCornerCard ? activeCornerCard.dataset.value : 'square';

        qrCode.update({
            data: data,
            dotsOptions: {
                color: dotsColor,
                type: dotsStyle
            },
            backgroundOptions: {
                color: bgColor,
            },
            cornersSquareOptions: {
                color: dotsColor,
                type: cornersStyle
            },
            cornersDotOptions: {
                color: dotsColor,
                type: cornersStyle === 'extra-rounded' ? 'dot' : cornersStyle // Fallback for inner dots
            }
        });
    }

    // -----------------------------------------------------
    // 4. Event Listeners for Live Preview
    // -----------------------------------------------------
    dataInput.addEventListener('input', updateQRCode);
    
    dotsColorInput.addEventListener('input', (e) => {
        e.target.nextElementSibling.textContent = e.target.value;
        updateQRCode();
    });

    bgColorInput.addEventListener('input', (e) => {
        e.target.nextElementSibling.textContent = e.target.value;
        updateQRCode();
    });

    // Handle Style Cards Selection
    function setupRadioCards(cards, callback) {
        cards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from siblings
                cards.forEach(c => c.classList.remove('active'));
                // Add to clicked
                card.classList.add('active');
                callback();
            });
        });
    }

    setupRadioCards(dotsStyleCards, updateQRCode);
    setupRadioCards(cornersStyleCards, updateQRCode);

    // -----------------------------------------------------
    // 5. Logo Upload Handling
    // -----------------------------------------------------
    dropArea.addEventListener('click', () => logoInput.click());

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleLogoFile(e.dataTransfer.files[0]);
        }
    });

    logoInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleLogoFile(e.target.files[0]);
        }
    });

    function handleLogoFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('សូមបញ្ចូលឯកសាររូបភាពប៉ុណ្ណោះ។ (Please upload an image file)');
            return;
        }

        fileNameDisplay.textContent = file.name;
        clearLogoBtn.style.display = 'block';

        const reader = new FileReader();
        reader.onload = (event) => {
            qrCode.update({
                image: event.target.result
            });
        };
        reader.readAsDataURL(file);
    }

    clearLogoBtn.addEventListener('click', () => {
        logoInput.value = '';
        fileNameDisplay.textContent = 'មិនទាន់មានរូបភាព';
        clearLogoBtn.style.display = 'none';
        qrCode.update({
            image: ""
        });
    });

    // -----------------------------------------------------
    // 6. Download Handling
    // -----------------------------------------------------
    downloadBtn.addEventListener('click', () => {
        const format = formatSelect.value;
        qrCode.download({ name: "my-qr-code", extension: format });
    });

    // -----------------------------------------------------
    // 7. Theme Toggle
    // -----------------------------------------------------
    let isDarkMode = false;
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = "<i class='bx bx-sun'></i>";
        } else {
            document.body.removeAttribute('data-theme');
            themeToggle.innerHTML = "<i class='bx bx-moon'></i>";
        }
    });
});
