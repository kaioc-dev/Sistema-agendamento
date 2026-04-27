document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointment-form');
    const list = document.getElementById('appointments-list');

    // Carregar agendamentos do LocalStorage
    let appointments = JSON.parse(localStorage.getItem('cyberAppointments')) || [];

    function renderAppointments() {
        list.innerHTML = '';
        appointments.forEach((app, index) => {
            const div = document.createElement('div');
            div.className = 'appointment-item';
            
            // Criar link do WhatsApp
            const message = `Olá, sou ${app.name}. Gostaria de confirmar meu agendamento de ${app.service} no dia ${app.date} às ${app.time}.`;
            const waLink = `https://wa.me/5500000000000?text=${encodeURIComponent(message)}`;

            div.innerHTML = `
                <div>
                    <strong>${app.client}</strong> - ${app.service}<br>
                    <small><i class="far fa-clock"></i> ${app.date} às ${app.time}</small>
                </div>
                <div>
                    <a href="${waLink}" target="_blank" class="btn-whatsapp" title="Confirmar via WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <button onclick="deleteApp(${index})" style="background:none; border:none; color:#ff4444; margin-left:15px; cursor:pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            list.appendChild(div);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newApp = {
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            client: document.getElementById('client-name').value
        };

        appointments.push(newApp);
        localStorage.setItem('cyberAppointments', JSON.stringify(appointments));
        
        form.reset();
        renderAppointments();
        alert('Agendamento registrado com sucesso no sistema!');
    });

    window.deleteApp = (index) => {
        appointments.splice(index, 1);
        localStorage.setItem('cyberAppointments', JSON.stringify(appointments));
        renderAppointments();
    };

    renderAppointments();
});
