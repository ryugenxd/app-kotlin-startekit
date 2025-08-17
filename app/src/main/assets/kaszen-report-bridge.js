/**
 * Kaszen Report Export Bridge for React Inertia
 * Handles Laravel backend report exports in Android WebView
 */

(function() {
    'use strict';
    
    console.log('🚀 Kaszen Report Bridge initializing...');
    
    // Check if we're in Android WebView
    const isAndroidWebView = typeof Android !== 'undefined' || 
                           typeof LaravelExport !== 'undefined' || 
                           typeof KaszenAuth !== 'undefined';
    
    if (!isAndroidWebView) {
        console.log('Not in Android WebView, skipping report bridge');
        return;
    }
    
    console.log('✅ Android WebView detected, setting up report export bridge');
    
    // Override window.open for export URLs
    const originalWindowOpen = window.open;
    
    window.open = function(url, target, features) {
        console.log('🔗 Window.open intercepted:', url);
        
        // Check if this is a Laravel export URL
        if (isLaravelExportUrl(url)) {
            console.log('📊 Laravel export detected, routing to Android handler');
            handleLaravelExportUrl(url);
            return null; // Prevent default browser behavior
        }
        
        // For non-export URLs, use original function
        return originalWindowOpen.call(this, url, target, features);
    };
    
    // Check if URL is a Laravel export URL
    function isLaravelExportUrl(url) {
        const exportPaths = [
            '/reports/export/pdf',
            '/reports/export/excel', 
            '/reports/export/csv',
            '/reports/export/summary'
        ];
        
        return exportPaths.some(path => url.includes(path));
    }
    
    // Extract export parameters from URL
    function parseExportUrl(url) {
        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            
            // Determine export type from path
            let type = 'excel';
            if (url.includes('/pdf')) type = 'pdf';
            else if (url.includes('/csv')) type = 'csv';
            else if (url.includes('/summary')) type = 'summary';
            
            // Get date range for filename
            const startDate = params.get('start_date') || getCurrentDate();
            const endDate = params.get('end_date') || getCurrentDate();
            const dateRange = `${startDate}_to_${endDate}`;
            
            // Get user info for filename
            const userId = params.get('user_id');
            let userSuffix = '';
            if (userId) {
                userSuffix = `_user_${userId}`;
            }
            
            return {
                url: url,
                type: type,
                dateRange: dateRange,
                userSuffix: userSuffix,
                startDate: startDate,
                endDate: endDate,
                userId: userId,
                title: getExportTitle(type)
            };
        } catch (e) {
            console.error('❌ Error parsing export URL:', e);
            return {
                url: url,
                type: 'excel',
                dateRange: getCurrentDate(),
                title: 'Kaszen_Export'
            };
        }
    }
    
    // Get appropriate title for export type
    function getExportTitle(type) {
        switch (type) {
            case 'pdf': return 'Laporan_PDF';
            case 'csv': return 'Laporan_CSV';
            case 'summary': return 'Ringkasan_Laporan';
            case 'excel':
            default: return 'Laporan_Excel';
        }
    }
    
    // Handle Laravel export URL
    function handleLaravelExportUrl(url) {
        try {
            console.log('📋 Processing Laravel export:', url);
            
            const exportData = parseExportUrl(url);
            console.log('📊 Export data:', exportData);
            
            // Show loading indicator
            showExportLoadingIndicator(exportData.type);
            
            // Call appropriate Android interface based on export type
            if (typeof LaravelExport !== 'undefined') {
                console.log('📱 Calling LaravelExport.exportData');
                
                // Create export configuration
                const config = {
                    url: exportData.url,
                    type: exportData.type,
                    title: exportData.title,
                    dateRange: exportData.dateRange,
                    filename: generateFilename(exportData),
                    startDate: exportData.startDate,
                    endDate: exportData.endDate,
                    userId: exportData.userId
                };
                
                LaravelExport.exportData(JSON.stringify(config));
            } else {
                console.warn('⚠️ LaravelExport interface not available');
                fallbackDownload(url);
            }
            
        } catch (e) {
            console.error('❌ Error handling Laravel export:', e);
            showExportError(e.message);
        }
    }
    
    // Generate appropriate filename
    function generateFilename(exportData) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_');
        let filename = `${exportData.title}_${exportData.dateRange}${exportData.userSuffix}_${timestamp}`;
        
        switch (exportData.type) {
            case 'pdf': return `${filename}.pdf`;
            case 'csv': return `${filename}.csv`;
            case 'excel':
            case 'summary':
            default: return `${filename}.xlsx`;
        }
    }
    
    // Fallback download method
    function fallbackDownload(url) {
        console.log('🔄 Using fallback download method');
        try {
            // Create invisible iframe for download
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            
            // Remove iframe after delay
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 5000);
            
        } catch (e) {
            console.error('❌ Fallback download failed:', e);
        }
    }
    
    // Show loading indicator for export
    function showExportLoadingIndicator(type) {
        const typeNames = {
            'pdf': 'PDF',
            'excel': 'Excel', 
            'csv': 'CSV',
            'summary': 'Ringkasan'
        };
        
        const typeName = typeNames[type] || 'File';
        
        // Try to show toast or notification
        try {
            if (typeof KaszenAuth !== 'undefined' && KaszenAuth.showToast) {
                KaszenAuth.showToast(`📊 Memproses export ${typeName}...`);
            }
        } catch (e) {
            console.log(`📊 Starting ${typeName} export...`);
        }
    }
    
    // Show export error
    function showExportError(message) {
        try {
            if (typeof KaszenAuth !== 'undefined' && KaszenAuth.showToast) {
                KaszenAuth.showToast(`❌ Export gagal: ${message}`);
            }
        } catch (e) {
            console.error('❌ Export error:', message);
        }
    }
    
    // Get current date in YYYY-MM-DD format
    function getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }
    
    // Enhanced event listener for export buttons
    function setupExportButtonListeners() {
        console.log('🎯 Setting up export button listeners');
        
        // Listen for clicks on export elements
        document.addEventListener('click', function(event) {
            const target = event.target;
            
            // Check if clicked element or parent is export-related
            const exportElement = target.closest('[data-export-type]') || 
                                 target.closest('.export-btn') ||
                                 (target.textContent && target.textContent.includes('Export'));
            
            if (exportElement) {
                console.log('🖱️ Export button clicked:', exportElement);
                
                // Small delay to let React handle the click first
                setTimeout(() => {
                    // The window.open override will handle the actual export
                }, 100);
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupExportButtonListeners);
    } else {
        setupExportButtonListeners();
    }
    
    // Also setup when page changes (for SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('🔄 Page changed, reinitializing export listeners');
            setTimeout(setupExportButtonListeners, 500);
        }
    }).observe(document, { subtree: true, childList: true });
    
    console.log('✅ Kaszen Report Bridge initialized successfully');
    
    // Export functions to global scope for debugging
    window.KaszenReportBridge = {
        handleLaravelExportUrl,
        isLaravelExportUrl,
        parseExportUrl,
        generateFilename,
        version: '1.0.0'
    };
    
})();
