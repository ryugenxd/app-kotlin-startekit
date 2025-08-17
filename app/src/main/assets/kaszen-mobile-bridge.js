// Kaszen Mobile Bridge for Laravel Exports and Authentication
// This script provides easy integration with Laravel backend exports and login persistence

window.KaszenMobile = {
    // Check if running in Kaszen Mobile app
    isKaszenApp: function() {
        return typeof window.LaravelExport !== 'undefined' && 
               typeof window.ReactInertia !== 'undefined' &&
               typeof window.KaszenAuth !== 'undefined';
    },

    // Report Export functions for Laravel backend
    reports: {
        // Export PDF report
        exportPDF: function(url, startDate, endDate, userId) {
            if (!window.KaszenMobile.isKaszenApp()) {
                console.log('Not in Kaszen app, using browser download');
                window.open(url, '_blank');
                return false;
            }

            try {
                console.log('Exporting PDF report via Android interface');
                window.LaravelExport.exportReportPDF(url, startDate || '', endDate || '', userId || '');
                return true;
            } catch (error) {
                console.error('Failed to export PDF report:', error);
                window.open(url, '_blank'); // Fallback
                return false;
            }
        },

        // Export Excel report
        exportExcel: function(url, startDate, endDate, userId) {
            if (!window.KaszenMobile.isKaszenApp()) {
                console.log('Not in Kaszen app, using browser download');
                window.open(url, '_blank');
                return false;
            }

            try {
                console.log('Exporting Excel report via Android interface');
                window.LaravelExport.exportReportExcel(url, startDate || '', endDate || '', userId || '');
                return true;
            } catch (error) {
                console.error('Failed to export Excel report:', error);
                window.open(url, '_blank'); // Fallback
                return false;
            }
        },

        // Export CSV report
        exportCSV: function(url, startDate, endDate, userId) {
            if (!window.KaszenMobile.isKaszenApp()) {
                console.log('Not in Kaszen app, using browser download');
                window.open(url, '_blank');
                return false;
            }

            try {
                console.log('Exporting CSV report via Android interface');
                window.LaravelExport.exportReportCSV(url, startDate || '', endDate || '', userId || '');
                return true;
            } catch (error) {
                console.error('Failed to export CSV report:', error);
                window.open(url, '_blank'); // Fallback
                return false;
            }
        },

        // Export Summary report
        exportSummary: function(url, startDate, endDate, userId) {
            if (!window.KaszenMobile.isKaszenApp()) {
                console.log('Not in Kaszen app, using browser download');
                window.open(url, '_blank');
                return false;
            }

            try {
                console.log('Exporting Summary report via Android interface');
                window.LaravelExport.exportReportSummary(url, startDate || '', endDate || '', userId || '');
                return true;
            } catch (error) {
                console.error('Failed to export Summary report:', error);
                window.open(url, '_blank'); // Fallback
                return false;
            }
        },

        // Generic export with auto-detection
        exportReport: function(type, url, startDate, endDate, userId) {
            switch (type.toLowerCase()) {
                case 'pdf':
                    return this.exportPDF(url, startDate, endDate, userId);
                case 'excel':
                case 'xlsx':
                    return this.exportExcel(url, startDate, endDate, userId);
                case 'csv':
                    return this.exportCSV(url, startDate, endDate, userId);
                case 'summary':
                    return this.exportSummary(url, startDate, endDate, userId);
                default:
                    console.warn('Unknown export type:', type);
                    return this.exportExcel(url, startDate, endDate, userId);
            }
        }
    },

    // Authentication functions
    auth: {
        // Call this when user successfully logs in
        onLoginSuccess: function(userInfo) {
            if (!window.KaszenMobile.isKaszenApp()) {
                console.log('Not in Kaszen app, skipping login persistence');
                return false;
            }

            try {
                const userInfoString = typeof userInfo === 'object' ? 
                    JSON.stringify(userInfo) : userInfo;
                
                window.KaszenAuth.onLoginSuccess(userInfoString, window.location.href);
                console.log('Login success notification sent to Android app');
                return true;
            } catch (error) {
                console.error('Failed to notify login success:', error);
                return false;
            }
        },

        // Call this when user logs out
        onLogout: function() {
            if (!window.KaszenMobile.isKaszenApp()) {
                console.log('Not in Kaszen app, skipping logout handling');
                return false;
            }

            try {
                window.KaszenAuth.onLogout(window.location.href);
                console.log('Logout notification sent to Android app');
                return true;
            } catch (error) {
                console.error('Failed to notify logout:', error);
                return false;
            }
        },

        // Check current login status
        checkStatus: function() {
            if (!window.KaszenMobile.isKaszenApp()) {
                return null;
            }

            try {
                const statusString = window.KaszenAuth.checkLoginStatus(window.location.href);
                return JSON.parse(statusString);
            } catch (error) {
                console.error('Failed to check login status:', error);
                return null;
            }
        },

        // Get session information
        getSessionInfo: function() {
            if (!window.KaszenMobile.isKaszenApp()) {
                return null;
            }

            try {
                const sessionString = window.KaszenAuth.getSessionInfo();
                return JSON.parse(sessionString);
            } catch (error) {
                console.error('Failed to get session info:', error);
                return null;
            }
        },

        // Enable/disable auto-login
        setAutoLogin: function(enabled) {
            if (!window.KaszenMobile.isKaszenApp()) {
                return false;
            }

            try {
                window.KaszenAuth.setAutoLogin(enabled);
                return true;
            } catch (error) {
                console.error('Failed to set auto-login:', error);
                return false;
            }
        },

        // Clear all saved sessions
        clearSessions: function() {
            if (!window.KaszenMobile.isKaszenApp()) {
                return false;
            }

            try {
                window.KaszenAuth.clearAllSessions();
                return true;
            } catch (error) {
                console.error('Failed to clear sessions:', error);
                return false;
            }
        },

        // Refresh current session
        refreshSession: function() {
            if (!window.KaszenMobile.isKaszenApp()) {
                return false;
            }

            try {
                return window.KaszenAuth.refreshSession(window.location.href);
            } catch (error) {
                console.error('Failed to refresh session:', error);
                return false;
            }
        }
    },

    // Export functions for Laravel backend (existing functionality)
    export: {
        // Generic export function
        download: function(config) {
            if (!window.KaszenMobile.isKaszenApp()) {
                console.warn('Kaszen Mobile app not detected, falling back to browser download');
                return false;
            }

            try {
                const exportConfig = {
                    url: config.url,
                    type: config.type || 'excel',
                    filename: config.filename || '',
                    title: config.title || 'Kaszen Export',
                    dateRange: config.dateRange || this.getCurrentDate(),
                    ...config
                };

                window.LaravelExport.exportData(JSON.stringify(exportConfig));
                return true;
            } catch (error) {
                console.error('Export failed:', error);
                return false;
            }
        },

        // Summary report export (matches ReportSummaryExport.php)
        summary: function(url, startDate, endDate) {
            if (!window.KaszenMobile.isKaszenApp()) {
                window.open(url, '_blank');
                return false;
            }

            try {
                window.LaravelExport.exportSummary(url, startDate || '', endDate || '');
                return true;
            } catch (error) {
                console.error('Summary export failed:', error);
                return false;
            }
        },

        // Category-based report export
        category: function(url, startDate, endDate) {
            if (!window.KaszenMobile.isKaszenApp()) {
                window.open(url, '_blank');
                return false;
            }

            try {
                window.LaravelExport.exportByCategory(url, startDate || '', endDate || '');
                return true;
            } catch (error) {
                console.error('Category export failed:', error);
                return false;
            }
        },

        // Monthly report export
        monthly: function(url, startDate, endDate) {
            if (!window.KaszenMobile.isKaszenApp()) {
                window.open(url, '_blank');
                return false;
            }

            try {
                window.LaravelExport.exportMonthly(url, startDate || '', endDate || '');
                return true;
            } catch (error) {
                console.error('Monthly export failed:', error);
                return false;
            }
        },

        // PDF export
        pdf: function(url, title, dateRange) {
            if (!window.KaszenMobile.isKaszenApp()) {
                window.open(url, '_blank');
                return false;
            }

            try {
                window.LaravelExport.exportPDF(url, title || 'Kaszen Report', dateRange || this.getCurrentDate());
                return true;
            } catch (error) {
                console.error('PDF export failed:', error);
                return false;
            }
        },

        // CSV export
        csv: function(url, title, dateRange) {
            if (!window.KaszenMobile.isKaszenApp()) {
                window.open(url, '_blank');
                return false;
            }

            try {
                window.LaravelExport.exportCSV(url, title || 'Kaszen Export', dateRange || this.getCurrentDate());
                return true;
            } catch (error) {
                console.error('CSV export failed:', error);
                return false;
            }
        },

        // Get current date for filename
        getCurrentDate: function() {
            const now = new Date();
            return now.getFullYear() + '-' + 
                   String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(now.getDate()).padStart(2, '0');
        }
    },

    // File upload functions (existing functionality)
    upload: {
        isSupported: function() {
            return window.KaszenMobile.isKaszenApp();
        }
    },

    // Device info
    device: {
        getInfo: function() {
            if (!window.KaszenMobile.isKaszenApp()) {
                return null;
            }
            
            try {
                return JSON.parse(window.ReactInertia.getDeviceInfo());
            } catch (error) {
                console.error('Failed to get device info:', error);
                return null;
            }
        },
        
        isAndroid: function() {
            return window.KaszenMobile.isKaszenApp();
        }
    },

    // Download path info
    storage: {
        getDownloadPath: function() {
            if (!window.KaszenMobile.isKaszenApp()) {
                return null;
            }
            
            try {
                return window.LaravelExport.getDownloadPath();
            } catch (error) {
                console.error('Failed to get download path:', error);
                return null;
            }
        }
    },

    // Capability check
    capabilities: {
        check: function() {
            if (!window.KaszenMobile.isKaszenApp()) {
                return {
                    supported: false,
                    platform: 'web'
                };
            }
            
            try {
                const exportCapabilities = JSON.parse(window.LaravelExport.checkExportSupport());
                const authStatus = window.KaszenMobile.auth.checkStatus();
                
                return {
                    ...exportCapabilities,
                    authentication: {
                        persistent_login: true,
                        auto_login: authStatus ? authStatus.autoLoginEnabled : false,
                        session_management: true
                    }
                };
            } catch (error) {
                console.error('Failed to check capabilities:', error);
                return {
                    supported: false,
                    error: error.message
                };
            }
        }
    }
};

// Auto-detect authentication events and enhance functionality
document.addEventListener('DOMContentLoaded', function() {
    if (!window.KaszenMobile.isKaszenApp()) {
        return;
    }

    console.log('Kaszen Mobile detected, enhancing Laravel functionality with auth support');

    // Auto-detect login forms and add success handlers
    function enhanceAuthenticationForms() {
        // Look for login forms
        const loginForms = document.querySelectorAll('form[action*="login"], form[action*="auth"], .login-form, #login-form');
        
        loginForms.forEach(form => {
            if (form.hasAttribute('data-kaszen-enhanced')) return;
            form.setAttribute('data-kaszen-enhanced', 'true');
            
            form.addEventListener('submit', function(e) {
                console.log('Login form submission detected');
                
                // Monitor for successful login (you may need to adjust this based on your Laravel app)
                setTimeout(() => {
                    // Check if we're redirected away from login page
                    if (!window.location.href.includes('login') && !window.location.href.includes('auth')) {
                        // Assume login was successful
                        const userInfo = {
                            timestamp: new Date().toISOString(),
                            url: window.location.href
                        };
                        
                        // Try to extract user info from page if available
                        const userElement = document.querySelector('[data-user]');
                        if (userElement) {
                            try {
                                const userData = JSON.parse(userElement.dataset.user);
                                Object.assign(userInfo, userData);
                            } catch (e) {
                                console.log('Could not parse user data from page');
                            }
                        }
                        
                        window.KaszenMobile.auth.onLoginSuccess(userInfo);
                    }
                }, 2000);
            });
        });
        
        // Look for logout buttons/links
        const logoutElements = document.querySelectorAll('a[href*="logout"], button[onclick*="logout"], .logout-btn, [data-logout]');
        
        logoutElements.forEach(element => {
            if (element.hasAttribute('data-kaszen-enhanced')) return;
            element.setAttribute('data-kaszen-enhanced', 'true');
            
            element.addEventListener('click', function(e) {
                console.log('Logout action detected');
                setTimeout(() => {
                    window.KaszenMobile.auth.onLogout();
                }, 1000);
            });
        });
    }

    // Look for common export button patterns (existing functionality)
    const exportSelectors = [
        '[href*="export"]',
        '[href*="download"]', 
        'button[onclick*="export"]',
        '.export-btn',
        '.download-btn',
        '[data-export]'
    ];

    exportSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // Add mobile-optimized export handling
            element.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const dataExport = this.getAttribute('data-export');
                const onclick = this.getAttribute('onclick');

                // Check if this looks like a Laravel export
                if (href && (href.includes('export') || href.includes('download'))) {
                    e.preventDefault();
                    
                    // Determine export type from URL or context
                    let exportType = 'excel';
                    if (href.includes('csv')) exportType = 'csv';
                    else if (href.includes('pdf')) exportType = 'pdf';
                    
                    // Try to get title from button text or data attributes
                    const title = this.textContent.trim() || 
                                 this.getAttribute('title') || 
                                 this.getAttribute('data-title') || 
                                 'Kaszen Export';

                    window.KaszenMobile.export.download({
                        url: href,
                        type: exportType,
                        title: title
                    });
                }
            });
        });
    });

    // Run enhancement on page load and mutations
    enhanceAuthenticationForms();
    
    // Watch for dynamic content (React/Inertia updates)
    const observer = new MutationObserver(function(mutations) {
        let shouldEnhance = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldEnhance = true;
            }
        });
        if (shouldEnhance) {
            setTimeout(() => {
                enhanceAuthenticationForms();
            }, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Log capabilities for debugging
    console.log('Kaszen Mobile Capabilities:', window.KaszenMobile.capabilities.check());
    
    // Check and log current auth status
    const authStatus = window.KaszenMobile.auth.checkStatus();
    if (authStatus) {
        console.log('Current Auth Status:', authStatus);
    }
});

// Polyfill for Inertia.js integration
if (window.Inertia) {
    // Hook into Inertia navigation to maintain mobile optimizations
    window.Inertia.on('navigate', function() {
        console.log('Inertia navigation detected in Kaszen Mobile');
        
        // Re-check auth status after navigation
        setTimeout(() => {
            const authStatus = window.KaszenMobile.auth.checkStatus();
            console.log('Auth status after navigation:', authStatus);
        }, 1000);
    });
}

console.log('Kaszen Mobile Bridge with Authentication loaded successfully');
