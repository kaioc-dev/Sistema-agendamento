document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('schedule-form');
    const listContainer = document.getElementById('appointments-list');

    // Carregar do LocalStorage
    let appointments = JSON.parse(localStorage.getItem('pureSchedule_data')) || [];

    const render = () => {
        if (appointments.length === 0) {
            listContainer.innerHTML = '<p class="empty-msg">Nenhum agendamento pendente.</p>';
            return;
        }

        listContainer.innerHTML = '';
        appointments.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'appointment-item';

            const whatsappMsg = `Olá, sou ${item.client}. Gostaria de confirmar meu agendamento de ${item.service} para o dia ${item.date} às ${item.time}.`;
            const waLink = `https://wa.me/5500000000000?text=${encodeURIComponent(whatsappMsg)}`;

            div.innerHTML = `
                <div class="info">
                    <h4>${item.client}</h4>
                    <p>${item.service} • <strong>${item.date} às ${item.time}</strong></p>
                </div>
                <div class="actions">
                    <a href="${waLink}" target="_blank" title="Confirmar WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    <button onclick="removeItem(${index})" title="Excluir"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            listContainer.appendChild(div);
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newAppointment = {
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            client: document.getElementById('client-name').value
        };

        appointments.push(newAppointment);
        localStorage.setItem('pureSchedule_data', JSON.stringify(appointments));
        form.reset();
        render();
    });

    window.removeItem = (index) => {
        if (confirm('Deseja remover este agendamento?')) {
            appointments.splice(index, 1);
            localStorage.setItem('pureSchedule_data', JSON.stringify(appointments));
            render();
        }
    };

    render();
});
