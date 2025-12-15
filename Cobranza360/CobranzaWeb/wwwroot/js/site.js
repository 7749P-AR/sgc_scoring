// CobranzaApp360 - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeFilters();
    initializeStatusUpdates();
    initializeActionButtons();
    animateOnScroll();
});

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterTable();
    });
}

/**
 * Initialize filter dropdowns
 */
function initializeFilters() {
    const priorityFilter = document.getElementById('priorityFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (priorityFilter) {
        priorityFilter.addEventListener('change', filterTable);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', filterTable);
    }
}

/**
 * Filter table based on search and filter criteria
 */
function filterTable() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const priorityFilter = document.getElementById('priorityFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    const rows = document.querySelectorAll('.debtor-row');
    let visibleCount = 0;

    rows.forEach(row => {
        const name = row.querySelector('.name-text')?.textContent.toLowerCase() || '';
        const priority = row.dataset.priority || '';
        const status = row.dataset.status || '';

        const matchesSearch = name.includes(searchTerm);
        const matchesPriority = !priorityFilter || priority === priorityFilter;
        const matchesStatus = !statusFilter || status === statusFilter;

        if (matchesSearch && matchesPriority && matchesStatus) {
            row.style.display = '';
            visibleCount++;
            // Add fade-in animation
            row.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            row.style.display = 'none';
        }
    });

    // Show empty state if no results
    updateEmptyState(visibleCount);
}

/**
 * Update empty state message
 */
function updateEmptyState(visibleCount) {
    const tableBody = document.querySelector('.debtors-table tbody');
    if (!tableBody) return;

    let emptyRow = tableBody.querySelector('.empty-row');

    if (visibleCount === 0) {
        if (!emptyRow) {
            emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-row';
            emptyRow.innerHTML = `
                <td colspan="7" style="text-align: center; padding: 3rem;">
                    <div class="empty-state">
                        <div class="empty-icon">🔍</div>
                        <h3>No se encontraron resultados</h3>
                        <p>Intenta ajustar los filtros de búsqueda</p>
                    </div>
                </td>
            `;
            tableBody.appendChild(emptyRow);
        }
    } else {
        if (emptyRow) {
            emptyRow.remove();
        }
    }
}

/**
 * Initialize status update functionality
 */
function initializeStatusUpdates() {
    const statusSelects = document.querySelectorAll('.status-select');

    statusSelects.forEach(select => {
        select.addEventListener('change', function(e) {
            const debtorId = this.dataset.debtorId;
            const newStatus = this.value;
            const originalValue = this.querySelector('option[selected]')?.value || this.value;

            updateDebtorStatus(debtorId, newStatus, this, originalValue);
        });
    });
}

/**
 * Update debtor status via AJAX
 */
function updateDebtorStatus(debtorId, status, selectElement, originalValue) {
    // Show loading state
    selectElement.disabled = true;
    selectElement.style.opacity = '0.6';

    fetch('/Debtors/UpdateStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${debtorId}&status=${encodeURIComponent(status)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('✓ Estado actualizado correctamente', 'success');
            
            // Update the row's data attribute
            const row = selectElement.closest('.debtor-row');
            if (row) {
                row.dataset.status = status;
            }

            // Add success animation
            selectElement.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                selectElement.style.animation = '';
            }, 500);
        } else {
            showNotification('✗ Error al actualizar el estado', 'error');
            // Revert to original value
            selectElement.value = originalValue;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('✗ Error de conexión', 'error');
        // Revert to original value
        selectElement.value = originalValue;
    })
    .finally(() => {
        selectElement.disabled = false;
        selectElement.style.opacity = '1';
    });
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification-toast');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(38, 222, 129, 0.9)' : 'rgba(255, 71, 87, 0.9)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
        backdrop-filter: blur(10px);
    `;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Initialize action buttons
 */
function initializeActionButtons() {
    const contactButtons = document.querySelectorAll('.btn-contact');
    const infoButtons = document.querySelectorAll('.btn-info');

    contactButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('.debtor-row');
            const name = row.querySelector('.name-text')?.textContent || '';
            showNotification(`📞 Iniciando contacto con ${name}`, 'info');
        });
    });

    infoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('.debtor-row');
            const name = row.querySelector('.name-text')?.textContent || '';
            const amount = row.querySelector('.amount-value')?.textContent || '';
            const days = row.querySelector('.days-badge')?.textContent || '';
            const priority = row.querySelector('.priority-badge')?.textContent || '';

            showDebtorDetails(name, amount, days, priority);
        });
    });
}

/**
 * Show debtor details modal (simplified version)
 */
function showDebtorDetails(name, amount, days, priority) {
    const details = `
Deudor: ${name}
Monto: ${amount}
Retraso: ${days}
Prioridad: ${priority}
    `.trim();

    alert(details);
    // In a real application, you would show a proper modal here
}

/**
 * Animate elements on scroll
 */
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    const cards = document.querySelectorAll('.stat-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

/**
 * Add CSS animations dynamically
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add smooth scrolling
document.documentElement.style.scrollBehavior = 'smooth';

// Log initialization
console.log('🚀 CobranzaApp360 initialized successfully');
