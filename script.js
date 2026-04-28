document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('schedule-form');
    const listContainer = document.getElementById('appointments-list');

    // Número de WhatsApp da Barbearia (Admin) - Troque para o número real
    const telefoneBarbeiro = "5500000000000"; 

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

            // Link para o Barbeiro chamar o cliente no WhatsApp, se precisar
            const cleanPhone = item.whatsapp.replace(/\D/g, ''); // Remove traços e parênteses
            const whatsappMsg = `Olá ${item.client}, aqui é da barbearia! Confirmando seu agendamento de ${item.service} no dia ${item.date} às ${item.time}.`;
            const waLinkClient = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

            div.innerHTML = `
                <div class="info">
                    <h4>${item.client}</h4>
                    <p>${item.service} • <strong>${item.date} às ${item.time}</strong></p>
                    <p style="font-size: 0.75rem; margin-top: 5px; color: var(--gold);">
                        <i class="fab fa-whatsapp"></i> ${item.whatsapp}
                    </p>
                </div>
                <div class="actions">
                    <button class="btn-pdf" onclick="generatePDF(${index})" title="Baixar Comprovante PDF">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                    <a href="${waLinkClient}" target="_blank" title="Falar com Cliente">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <button class="btn-del" onclick="removeItem(${index})" title="Cancelar Agendamento">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            listContainer.appendChild(div);
        });
    };

    // FUNÇÃO: Gerar PDF do Agendamento
    window.generatePDF = (index) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const item = appointments[index];

        // Layout do PDF
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("THE BARBER", 105, 20, null, null, "center");
        
        doc.setFontSize(14);
        doc.text("COMPROVANTE DE AGENDAMENTO", 105, 30, null, null, "center");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        
        doc.text(`Cliente: ${item.client}`, 20, 50);
        doc.text(`WhatsApp: ${item.whatsapp}`, 20, 60);
        doc.text(`Serviço Solicitado: ${item.service}`, 20, 70);
        doc.text(`Data: ${item.date}`, 20, 80);
        doc.text(`Horário: ${item.time}`, 20, 90);

        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text("Apresente este comprovante no momento do atendimento.", 105, 110, null, null, "center");

        // Baixa o arquivo com o nome do cliente
        doc.save(`Comprovante_${item.client.replace(/\s+/g, '_')}.pdf`);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newApp = {
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            client: document.getElementById('client-name').value,
            whatsapp: document.getElementById('client-whatsapp').value
        };
        
        appointments.push(newApp);
        localStorage.setItem('barber_appointments', JSON.stringify(appointments));
        form.reset();
        render();

        // FUNÇÃO: Enviar Notificação Direta para o WhatsApp do Barbeiro
        const adminMsg = `*NOVO AGENDAMENTO!* ✂️\n\n*Cliente:* ${newApp.client}\n*Contato:* ${newApp.whatsapp}\n*Serviço:* ${newApp.service}\n*Data:* ${newApp.date}\n*Horário:* ${newApp.time}\n\n_Agendamento gerado via The Barber System_`;
        const adminLink = `https://wa.me/${telefoneBarbeiro}?text=${encodeURIComponent(adminMsg)}`;
        
        // Abre uma nova aba com a mensagem pronta para enviar ao barbeiro
        window.open(adminLink, '_blank');
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
