document.addEventListener('DOMContentLoaded', () => {
    // 10 пунктов со страховками, описанием, картинками и списками городов
    const insuranceData = [
        {
            id: 'osago',
            name: 'ASITUR',
            description: '913-939-044 Base en Vecindario, Telde y Play del Ingles',
            image: 'img/asitur.jpg',
            cities: ['Telde', 'Santa Lucia', 'Tejeda', 'Aguimes', 'Ingenio', 'Santa Brigida', 'Valsequillo', 'San Bartolome de Tirajana']
        },
        {
            id: 'kasko',
            name: 'Inter Partner(AXA/Mutua Tinerfena)',
            description: '902-197-316 Base en Vecindario, Telde y Play del Ingles',
            image: 'img/axa.jpg',
            cities: ['Telde', 'Santa Lucia', 'Aguimes', 'Ingenio', 'Valsequillo', 'San Bartolome de Tirajana']
        },
        {
            id: 'dms',
            name: 'Autoclub(Mutua Madrileña)',
            description: '915-555-555 Base en Vecindario, Arguineguin y Play del Ingles',
            image: 'img/mutua_madrid.jpg',
            cities: ['Santa Lucia', 'Aguimes', 'Ingenio', 'San Bartolome de Tirajana', 'Mogán hasta Puerto Rico']
        },
        {
            id: 'travel',
            name: 'Europ Assistance',
            description: '915-149-913 Base en Vecindario, Aguimes',
            image: 'img/europ.jpg',
            cities: ['Santa Lucia', 'Aguimes', 'Ingenio']
        },
        {
            id: 'russia_travel',
            name: 'Allianz',
            description: '902-436-434 Base en Vecindario, Juan Grande y Play del Ingles',
            image: 'img/allianz.jpg',
            cities: ['Santa Lucia', 'Aguimes', 'Ingenio', 'San Bartolome de Tirajana']
        },
        {
            id: 'property',
            name: 'Linea Directa',
            description: '919-180-048 Base solo c/Dragos 41',
            image: 'img/linea_directa.jpg',
            cities: ['Santa Lucia', 'Aguimes', 'Ingenio']
        },
        {
            id: 'accident',
            name: 'Arag',
            description: '933-001-050 Base en Vecindario y Play del Ingles',
            image: 'img/arag.jpg',
            cities: ['Santa Lucia', 'San Bartolome de Tirajana']
        },
        {
            id: 'mortgage',
            name: 'IMA Iberica',
            description: '913-434-900 Base en Vecindario e Ingenio. NOS LLAMAN PARA DARNOS EL SERVICIO POR TELEFONO',
            image: 'img/ima_iberica.jpg',
            cities: ['Santa Lucia', 'Aguimes', 'Ingenio']
        },
        {
            id: 'sport',
            name: 'Asistencia tecnica europea',
            description: 'Base solo c/Dragos 41.',
            image: 'img/europ.jpg',
            cities: ['Santa Lucia', 'Aguimes', 'Ingenio']
        },
        {
            id: 'pets',
            name: 'HPLY (Ok movility) ¡NUEVA!',
            description: '919-495-132 Base solo c/Dragos 41.',
            image: 'img/hlpy.jpg',
            cities: ['Telde', 'Santa Lucia', 'Tejeda', 'Aguimes', 'Ingenio', 'Santa Brigida', 'Valsequillo', 'San Bartolome de Tirajana']
        }
    ];

    const selectEl = document.getElementById('insurance-select');
    const citiesContainer = document.getElementById('cities-container');
    const citiesList = document.getElementById('cities-list');
    const descContainer = document.getElementById('insurance-description');

    const imageLink = document.getElementById('image-link');
    const insuranceImage = document.getElementById('insurance-image');

    // Элементы модального окна
    const modal = document.getElementById('image-modal');
    const modalClose = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalContent = document.getElementById('modal-content');

    // Заполнение выпадающего списка
    insuranceData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        selectEl.appendChild(option);
    });

    // Обработка выбора
    selectEl.addEventListener('change', (e) => {
        const selectedId = e.target.value;
        const selectedData = insuranceData.find(item => item.id === selectedId);

        if (selectedData) {
            citiesList.innerHTML = '';

            if (descContainer) {
                const phoneMatch = selectedData.description.match(/^([\d\-\s+()]{7,})\s+(.*)$/);
                if (phoneMatch) {
                    const phone = phoneMatch[1].trim();
                    const text = phoneMatch[2];
                    const cleanPhone = phone.replace(/[^\d+]/g, '');
                    descContainer.innerHTML = `<a href="tel:${cleanPhone}" class="phone-link">${phone}</a><br>${text}`;
                } else {
                    descContainer.textContent = selectedData.description;
                }
            }

            citiesContainer.classList.remove('hidden');

            if (imageLink && insuranceImage) {
                imageLink.classList.remove('hidden');
                insuranceImage.style.opacity = '0';

                insuranceImage.onload = () => {
                    insuranceImage.style.opacity = '1';
                };

                insuranceImage.src = selectedData.image;
                imageLink.href = selectedData.image;
            }

            selectedData.cities.forEach((city, index) => {
                const li = document.createElement('li');
                li.className = 'city-item';
                li.textContent = city;
                li.style.animationDelay = `${index * 0.08}s`;
                citiesList.appendChild(li);
            });

            setTimeout(() => {
                citiesContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);

        } else {
            citiesContainer.classList.add('hidden');
            if (imageLink) imageLink.classList.add('hidden');
        }
    });

    // Логика модального окна и зума
    imageLink.addEventListener('click', (e) => {
        e.preventDefault();
        const imageUrl = imageLink.getAttribute('href');
        if (imageUrl && imageUrl !== '#') {
            modalImage.src = imageUrl;
            modal.classList.remove('hidden');
            resetZoom();
        }
    });

    modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Переменные для зума и панорамирования
    let scale = 1;
    let initialDistance = 0;

    // Вспомогательная функция для сброса зума
    function resetZoom() {
        scale = 1;
        modalImage.style.transform = `scale(1)`;
    }

    // Обработка жестов раздвижения пальцев (Pinch-to-zoom)
    modalContent.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2 && !modal.classList.contains('hidden')) {
            e.preventDefault();
            initialDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
        }
    });

    modalContent.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && initialDistance > 0 && !modal.classList.contains('hidden')) {
            e.preventDefault();
            const currentDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );

            // Расчет нового масштаба
            const distanceDiff = currentDistance / initialDistance;
            let newScale = scale * distanceDiff;

            // Ограничиваем масштаб минимальным значением 1 (оригинал) и максимумом 5 (5x увеличение)
            newScale = Math.min(Math.max(1, newScale), 5);

            modalImage.style.transform = `scale(${newScale})`;
        }
    });

    modalContent.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
            initialDistance = 0;
            // Фиксируем масштаб после окончания жеста
            const transform = modalImage.style.transform;
            const match = transform.match(/scale\(([^)]+)\)/);
            if (match) {
                scale = parseFloat(match[1]);
            }
        }
    });
});
