document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('schedule-form');
    const listContainer = document.getElementById('appointments-list');

    let appointments = JSON.parse(localStorage.getItem('barber_appointments')) || [];

    const render = () => {
        if (appointments.length === 0) {
            listContainer.innerHTML = '<p class="empty-msg">Nenhum cliente agendado no momento.</p>';
            return;
        }

        listContainer.innerHTML = '';
        appointments.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'appointment-item';

            const whatsappMsg = `Olá, aqui é da barbearia! Confirmando agendamento para ${item.client}: ${item.service} no dia ${item.date} às ${item.time}.`;
            const waLink = `https://wa.me/5500000000000?text=${encodeURIComponent(whatsappMsg)}`;

            div.innerHTML = `
                <div class="info">
                    <h4>${item.client}</h4>
                    <p>${item.service} • <strong>${item.date} às ${item.time}</strong></p>
                </div>
                <div class="actions">
                    <a href="${waLink}" target="_blank"><i class="fab fa-whatsapp"></i></a>
                    <button onclick="removeItem(${index})"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            listContainer.appendChild(div);
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newApp = {
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            client: document.getElementById('client-name').value
        };
        appointments.push(newApp);
        localStorage.setItem('barber_appointments', JSON.stringify(appointments));
        form.reset();
        render();
    });

    window.removeItem = (index) => {
        if (confirm('Deseja cancelar este agendamento?')) {
            appointments.splice(index, 1);
            localStorage.setItem('barber_appointments', JSON.stringify(appointments));
            render();
        }
    };
    render();
});
