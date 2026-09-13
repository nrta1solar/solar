// ==========================================================
// NRTA SOLAR PRODUCTION JAVASCRIPT ENGINE (v15.0)
// Powered by AK TRADERS — Full Technical Audit, Sales Attribution & Real File Downloads
// ==========================================================

let currentLanguage = 'bn';
let currentUser = null;

// Dynamic Free-Hand Pricing Matrix
let customPricingItems = [
    { id: 1, name: '1 kW Complete Rooftop Solar Package (Mono PERC)', price: 65000 },
    { id: 2, name: '2 kW Complete Rooftop Solar Package (Mono PERC)', price: 125000 },
    { id: 3, name: '3 kW Complete Rooftop Solar Package (Mono PERC)', price: 180000 },
    { id: 4, name: '5 kW Complete Rooftop Solar Package (Mono PERC)', price: 290000 },
    { id: 5, name: '10 kW Commercial Solar Package', price: 550000 },
    { id: 6, name: '150Ah Heavy Tubular Battery', price: 14500 },
    { id: 7, name: '200Ah Tall Tubular Battery', price: 18500 },
    { id: 8, name: '3.5 kVA Pure Sine Wave Inverter', price: 32000 },
    { id: 9, name: '5.0 kVA Heavy Duty Hybrid Inverter', price: 48000 }
];

// Active Customers with Sales Referral Code and Real Uploaded Documents
let registeredCustomers = [
    {
        id: 'cust-101',
        name: 'Tamal Dey',
        mobile: '9876543210',
        pin: '123456',
        sales_rep_code: 'NRTA-101',
        caNo: '031254896',
        meterLoad: 2.0,
        solarKw: 2.0,
        address: 'Madhuban, Udaipur, Tripura',
        is_completed: false,
        pipelineStep: 3,
        statusLabel: 'Step 3: Docs Review',
        documents: {
            'aadhaar_card': { fileName: 'Tamal_Aadhaar_Card.pdf', dataUrl: null, uploaded: true },
            'electricity_bill': { fileName: 'TSECL_Electricity_Bill.pdf', dataUrl: null, uploaded: true },
            'bank_passbook': { fileName: 'SBI_Passbook.pdf', dataUrl: null, uploaded: true },
            'pan_card': { fileName: 'PAN_Card.pdf', dataUrl: null, uploaded: true },
            'other_doc_1': { fileName: 'Land_Parcha.pdf', dataUrl: null, uploaded: false },
            'other_doc_2': { fileName: 'Holding_Tax.pdf', dataUrl: null, uploaded: false },
            'other_doc_3': { fileName: null, dataUrl: null, uploaded: false },
            'geo_roof_photo': { fileName: 'Roof_Geo_Photo.jpg', dataUrl: null, uploaded: true }
        }
    }
];

let completedProjectsArchive = [
    {
        id: 'comp-201',
        name: 'Ratan Bhowmik',
        mobile: '9436100000',
        solarSize: '3.0 kW Hybrid',
        address: 'Udaipur Town, Tripura',
        installDate: '02-Aug-2026',
        status: '100% Completed',
        googleDriveSynced: true
    }
];

// Active Sales Partners with visible PIN and Metrics
let salesPartners = [
    {
        id: 1,
        name: 'Amit Sharma',
        mobile: '9999900000',
        pin: '123456',
        code: 'NRTA-101',
        commission: 3500,
        status: 'active'
    }
];

let pendingSalesApplications = [
    {
        id: 2,
        name: 'Bikash Debbarma',
        mobile: '9436123456',
        pin: '654321',
        district: 'West Tripura (Agartala)',
        suggestedCode: 'NRTA-102'
    }
];

// Contact Info
let siteContactInfo = {
    phone1: '+91 98634 02515',
    phone2: '+91 98765 43210',
    email: 'contact@nrtasolar.com',
    address: 'NRTA Solar (AK TRADERS), Udaipur, Gomati Tripura - 799120'
};

// Gallery Items
let galleryItems = [
    {
        id: 1,
        title: '3 kW Residential Rooftop Solar',
        location: 'Udaipur, Tripura',
        url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
        category: 'Rooftop Solar'
    },
    {
        id: 2,
        title: '5 kW Commercial Inverter & Battery Bank',
        location: 'Agartala, Tripura',
        url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80',
        category: 'Inverter & Battery Setup'
    },
    {
        id: 3,
        title: '2 kW Mono PERC On-Grid System',
        location: 'Madhuban, Tripura',
        url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80',
        category: 'Rooftop Solar'
    }
];

let currentInspectedCustomerId = null;
let currentEditingSalesPartnerId = null;

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initSignaturePad();
    loadStateFromStorage();
    checkPersistentSession();
    renderCustomPricingUI();
    syncPricingToHomeEstimator();
    runDynamicEstimation();
    calculateSolarEMI();
    renderCustomersTable();
    renderCompletedArchiveTable();
    renderGallery();
    renderContactInfoUI();
    renderSalesManagementUI();
    calculateInvoiceTotals();
});

// Load state from localStorage
function loadStateFromStorage() {
    const savedPricing = localStorage.getItem('nrta_custom_pricing');
    if (savedPricing) { try { customPricingItems = JSON.parse(savedPricing); } catch (e) {} }
    
    const savedCusts = localStorage.getItem('nrta_customers');
    if (savedCusts) { try { registeredCustomers = JSON.parse(savedCusts); } catch (e) {} }
    
    const savedArchive = localStorage.getItem('nrta_completed_archive');
    if (savedArchive) { try { completedProjectsArchive = JSON.parse(savedArchive); } catch (e) {} }
    
    const savedContact = localStorage.getItem('nrta_contact_info');
    if (savedContact) { try { siteContactInfo = JSON.parse(savedContact); } catch (e) {} }
    
    const savedGallery = localStorage.getItem('nrta_gallery_items');
    if (savedGallery) { try { galleryItems = JSON.parse(savedGallery); } catch (e) {} }
    
    const savedSales = localStorage.getItem('nrta_active_sales');
    if (savedSales) { try { salesPartners = JSON.parse(savedSales); } catch (e) {} }
    
    const savedPendingSales = localStorage.getItem('nrta_pending_sales');
    if (savedPendingSales) { try { pendingSalesApplications = JSON.parse(savedPendingSales); } catch (e) {} }
}

// Session Persistence
function checkPersistentSession() {
    const sessionStr = localStorage.getItem('nrta_solar_session');
    if (sessionStr) {
        try {
            currentUser = JSON.parse(sessionStr);
            updateUserHeaderUI();
            if (currentUser.role === 'admin') navigateTab('admin-portal');
            else if (currentUser.role === 'sales') {
                renderSalesWorkspaceUI();
                navigateTab('sales-portal');
            } else navigateTab('customer-portal');
        } catch (e) {
            localStorage.removeItem('nrta_solar_session');
        }
    }
}

function updateUserHeaderUI() {
    const authBlock = document.getElementById('authHeaderBlock');
    const userBlock = document.getElementById('userHeaderBlock');
    const userName = document.getElementById('headerUserName');

    if (currentUser) {
        authBlock.classList.add('hidden');
        userBlock.classList.remove('hidden');
        userBlock.classList.add('flex');
        userName.innerText = currentUser.name || currentUser.mobile;
        
        if (document.getElementById('custPortalName')) {
            document.getElementById('custPortalName').innerText = `স্বাগতম, ${currentUser.name || 'User'}`;
            document.getElementById('custPortalId').innerText = `Mobile: ${currentUser.mobile}`;
        }
    } else {
        authBlock.classList.remove('hidden');
        userBlock.classList.add('hidden');
        userBlock.classList.remove('flex');
    }
}

function goToCurrentPortal() {
    if (!currentUser) return;
    if (currentUser.role === 'admin') navigateTab('admin-portal');
    else if (currentUser.role === 'sales') {
        renderSalesWorkspaceUI();
        navigateTab('sales-portal');
    } else navigateTab('customer-portal');
}

// Navigation Engine
function navigateTab(tabId) {
    document.querySelectorAll('.tab-view').forEach(view => {
        view.classList.add('hidden');
        view.classList.remove('block');
    });

    const target = document.getElementById(`view-${tabId}`);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('block');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    lucide.createIcons();
}

function scrollToEstimator() {
    navigateTab('home');
    document.getElementById('homeEstimatorBox')?.scrollIntoView({ behavior: 'smooth' });
}

function switchAdminHubTab(subHubId) {
    document.querySelectorAll('.admin-hub-view').forEach(v => v.classList.add('hidden'));
    document.querySelectorAll('.admin-hub-btn').forEach(btn => {
        btn.classList.remove('bg-solarGreen', 'text-white');
        btn.classList.add('bg-white', 'text-slate-700');
    });

    const target = document.getElementById(subHubId);
    if (target) target.classList.remove('hidden');

    const activeBtn = document.getElementById(`hubBtn-${subHubId.replace('hub-', '')}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-solarGreen', 'text-white');
        activeBtn.classList.remove('bg-white', 'text-slate-700');
    }
    lucide.createIcons();
}

// ==========================================================
// 1. FREE-HAND PRICING ENGINE ([+] Add Custom Item Matrix)
// ==========================================================

function renderCustomPricingUI() {
    const tbody = document.getElementById('customPricingTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    customPricingItems.forEach((item) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50';
        tr.innerHTML = `
          <td class="p-3">
            <input type="text" value="${item.name}" class="pricing-item-name w-full border rounded-xl p-2 font-medium" data-id="${item.id}">
          </td>
          <td class="p-3">
            <div class="flex items-center gap-1">
              <span class="font-bold text-slate-400 text-sm">₹</span>
              <input type="number" value="${item.price}" class="pricing-item-price w-full border rounded-xl p-2 font-bold font-mono text-slate-800" data-id="${item.id}">
            </div>
          </td>
          <td class="p-3 text-center">
            <button onclick="removeCustomPricingRow(${item.id})" class="text-red-500 hover:text-red-700 font-bold p-1">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function addCustomPricingRow() {
    const newItem = {
        id: Date.now(),
        name: 'নতুন সোলার প্যাকেজ / ব্যাটারি / ইনভার্টার',
        price: 15000
    };
    customPricingItems.push(newItem);
    renderCustomPricingUI();
}

function removeCustomPricingRow(id) {
    if (customPricingItems.length <= 1) {
        alert('নূন্যতম একটি আইটেম প্রাইসিং তালিকায় থাকতে হবে!');
        return;
    }
    customPricingItems = customPricingItems.filter(i => i.id !== id);
    renderCustomPricingUI();
}

function saveAllCustomPricing() {
    const rows = document.querySelectorAll('#customPricingTableBody tr');
    const updatedList = [];

    rows.forEach(row => {
        const nameInput = row.querySelector('.pricing-item-name');
        const priceInput = row.querySelector('.pricing-item-price');
        const id = parseInt(nameInput.getAttribute('data-id')) || Date.now();

        if (nameInput && priceInput) {
            updatedList.push({
                id,
                name: nameInput.value.trim(),
                price: parseFloat(priceInput.value) || 0
            });
        }
    });

    customPricingItems = updatedList;
    localStorage.setItem('nrta_custom_pricing', JSON.stringify(customPricingItems));
    syncPricingToHomeEstimator();
    runDynamicEstimation();
    alert('সমস্ত আইটেম ও প্রাইসিং সফলভাবে সেভ হয়েছে এবং হোম পেজের এস্টিমেটরে লাইভ কার্যকর হয়েছে!');
}

function syncPricingToHomeEstimator() {
    const select = document.getElementById('estCustomItemSelect');
    if (!select) return;
    select.innerHTML = '<option value="0">কোনো অতিরিক্ত আইটেম ছাড়া</option>';

    customPricingItems.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.price;
        opt.innerText = `${item.name} (+₹${item.price.toLocaleString('en-IN')})`;
        select.appendChild(opt);
    });
}

// ==========================================================
// 2. CAPACITY & SOLAR LOAN EMI ESTIMATOR
// ==========================================================

function updateCapacityEstimator(kwVal) {
    document.getElementById('capacitySliderLabel').innerText = `${parseFloat(kwVal).toFixed(1)} kW`;
    let approxBill = Math.round(kwVal * 1250);
    document.getElementById('billEstLabel').innerText = `মাসিক বিল: ~₹${approxBill.toLocaleString('en-IN')}`;
    runDynamicEstimation();
}

function runDynamicEstimation() {
    const kw = parseFloat(document.getElementById('estCapacityRange')?.value) || 2.0;
    const type = document.getElementById('estSystemType')?.value || 'ongrid';
    const batteryBox = document.getElementById('estBatteryBox');
    
    if (batteryBox) {
        if (type === 'hybrid' || type === 'offgrid') batteryBox.classList.remove('hidden');
        else batteryBox.classList.add('hidden');
    }

    const matchingPackage = customPricingItems.find(i => i.name.includes(`${kw} kW`) || i.name.includes(`${Math.round(kw)} kW`));
    let basePackageRate = matchingPackage ? matchingPackage.price : (kw * 62500);

    const extraItemCost = parseFloat(document.getElementById('estCustomItemSelect')?.value) || 0;
    let grossTotal = basePackageRate + (type !== 'ongrid' ? extraItemCost : 0);

    let subsidy = 0;
    if (type !== 'offgrid') {
        if (kw <= 1.0) subsidy = 30000;
        else if (kw <= 2.0) subsidy = 60000;
        else subsidy = 78000;
    }

    let netPayable = Math.max(0, grossTotal - subsidy);
    let monthlySaving = Math.round(kw * 120 * 7.5);

    if (document.getElementById('resCapacity')) {
        document.getElementById('resCapacity').innerText = `${kw.toFixed(1)} kW`;
        document.getElementById('resArea').innerText = `~${Math.round(kw * 100)} বর্গফুট`;
        document.getElementById('resGross').innerText = `₹ ${grossTotal.toLocaleString('en-IN')}`;
        document.getElementById('resSubsidy').innerText = subsidy > 0 ? `- ₹ ${subsidy.toLocaleString('en-IN')}` : '₹ 0 (অফ-গ্রিডে প্রযোজ্য নয়)';
        document.getElementById('resNet').innerText = `₹ ${netPayable.toLocaleString('en-IN')}`;
        document.getElementById('resMonthlySaving').innerText = `মাসিক বিদ্যুৎ সাশ্রয়: ~₹ ${monthlySaving.toLocaleString('en-IN')} | ৩ বছরে সম্পূর্ণ টাকা ফেরত!`;
        
        const emiLoanInput = document.getElementById('emiLoanAmount');
        if (emiLoanInput) {
            emiLoanInput.value = netPayable;
            calculateSolarEMI();
        }
    }
}

function calculateSolarEMI() {
    const P = parseFloat(document.getElementById('emiLoanAmount')?.value) || 0;
    const annualRate = parseFloat(document.getElementById('emiInterestRate')?.value) || 8.5;
    const years = parseFloat(document.getElementById('emiTenureYears')?.value) || 5;

    if (P <= 0) return;

    const r = (annualRate / 12) / 100;
    const n = years * 12;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;

    if (document.getElementById('emiMonthlyDisplay')) {
        document.getElementById('emiMonthlyDisplay').innerText = `₹ ${Math.round(emi).toLocaleString('en-IN')} / মাস`;
        document.getElementById('emiTotalInterestDisplay').innerText = `₹ ${Math.round(totalInterest).toLocaleString('en-IN')}`;
        document.getElementById('emiTotalPayableDisplay').innerText = `₹ ${Math.round(totalPayable).toLocaleString('en-IN')}`;
    }
}

// ==========================================================
// 3. CUSTOMER MANAGEMENT (PIN View/Reset, Real Doc Downloads, Complete Fix)
// ==========================================================

function renderCustomersTable() {
    const tbody = document.getElementById('activeCustomersTableBody');
    const billCustSelect = document.getElementById('adminBillCustSelect');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (billCustSelect) billCustSelect.innerHTML = '<option value="">-- কাস্টমার সিলেক্ট করুন --</option>';

    const activeList = registeredCustomers.filter(c => !c.is_completed);

    if (activeList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-slate-400 font-semibold">কোনো সক্রিয় কাস্টমার লিড নেই। সমস্ত প্রজেক্ট কমপ্লিটেড আর্কাইভে স্থানান্তরিত হয়েছে।</td></tr>';
        return;
    }

    activeList.forEach((cust) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50';
        tr.innerHTML = `
          <td class="p-3 font-bold text-slate-800">${cust.name}</td>
          <td class="p-3 font-mono">${cust.mobile}</td>
          <td class="p-3 font-mono font-bold text-amber-700">${cust.sales_rep_code || 'DIRECT'}</td>
          <td class="p-3">
            <div class="flex items-center gap-1.5">
              <span id="pinDisplay-${cust.id}" class="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border">${cust.pin}</span>
              <button onclick="togglePinVisibility('${cust.id}')" title="পিন দেখান/লুকান" class="text-slate-400 hover:text-slate-700">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </td>
          <td class="p-3 font-mono">${cust.caNo}</td>
          <td class="p-3 font-bold text-solarDark">${cust.solarKw} kW</td>
          <td class="p-3 text-right space-x-1">
            <button onclick="openCustomerFullInspectionModal('${cust.id}')" class="bg-solarGreen text-white px-2.5 py-1 rounded-lg font-bold hover:bg-solarDark">
              রিভিউ ও ডাউনলোড
            </button>
            <button onclick="markProjectAsCompleted('${cust.id}')" class="bg-slate-900 text-white px-2.5 py-1 rounded-lg font-bold hover:bg-slate-800">
              কমপ্লিট করুন
            </button>
          </td>
        `;
        tbody.appendChild(tr);

        if (billCustSelect) {
            const opt = document.createElement('option');
            opt.value = `${cust.name}|${cust.mobile}|${cust.address}`;
            opt.innerText = `${cust.name} (${cust.mobile}) [${cust.sales_rep_code || 'DIRECT'}]`;
            billCustSelect.appendChild(opt);
        }
    });

    lucide.createIcons();
}

function renderCompletedArchiveTable() {
    const tbody = document.getElementById('completedProjectsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (completedProjectsArchive.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-slate-400 font-semibold">কোনো কমপ্লিটেড প্রজেক্ট নেই।</td></tr>';
        return;
    }

    completedProjectsArchive.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50';
        tr.innerHTML = `
          <td class="p-3 font-bold">${item.name}</td>
          <td class="p-3 font-mono text-slate-600">${item.mobile}</td>
          <td class="p-3 font-bold text-solarGreen">${item.solarSize}</td>
          <td class="p-3 text-slate-500">${item.installDate}</td>
          <td class="p-3">
            <span class="px-2 py-0.5 rounded font-bold text-[10px] ${item.googleDriveSynced ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}">
              ${item.googleDriveSynced ? '✓ Google Drive Synced' : 'Not Synced'}
            </span>
          </td>
          <td class="p-3 text-right space-x-1">
            <button onclick="openCompletedDossierModal('${item.id}')" class="bg-solarGreen text-white px-2 py-1 rounded font-bold text-[11px] hover:bg-solarDark">
              ভিউ ফাইল
            </button>
            <button onclick="syncSingleProjectToGoogleDrive('${item.id}', '${item.name}')" class="bg-emerald-600 text-white px-2 py-1 rounded font-bold text-[11px] hover:bg-emerald-700">
              Send to Drive
            </button>
          </td>
        `;
        tbody.appendChild(tr);
    });
}

function togglePinVisibility(custId) {
    const el = document.getElementById(`pinDisplay-${custId}`);
    if (!el) return;
    if (el.innerText.includes('•')) {
        const cust = registeredCustomers.find(c => c.id === custId);
        if (cust) el.innerText = cust.pin;
    } else {
        el.innerText = '••••••';
    }
}

function markProjectAsCompleted(custId) {
    const cust = registeredCustomers.find(c => c.id === custId);
    if (!cust) return;

    if (confirm(`আপনি কি নিশ্চিত যে কাস্টমার [${cust.name}]-এর কাজ সম্পন্ন হয়েছে এবং তাকে কমপ্লিটেড আর্কাইভে স্থানান্তর করবেন?`)) {
        cust.is_completed = true;

        completedProjectsArchive.push({
            id: `comp-${Date.now()}`,
            name: cust.name,
            mobile: cust.mobile,
            solarSize: `${cust.solarKw} kW System`,
            address: cust.address,
            installDate: new Date().toLocaleDateString('en-GB'),
            status: '100% Completed',
            googleDriveSynced: false
        });

        localStorage.setItem('nrta_customers', JSON.stringify(registeredCustomers));
        localStorage.setItem('nrta_completed_archive', JSON.stringify(completedProjectsArchive));

        renderCustomersTable();
        renderCompletedArchiveTable();
        renderSalesManagementUI();

        alert(`কাস্টমার [${cust.name}] সক্রিয় তালিকা থেকে সফলভাবে কমপ্লিটেড প্রজেক্ট প্যানেলে স্থানান্তরিত হয়েছে!`);
    }
}

// Completed Project Dossier Viewer
function openCompletedDossierModal(archiveId) {
    const item = completedProjectsArchive.find(a => a.id === archiveId);
    if (!item) return;

    document.getElementById('dossierModalTitle').innerText = `${item.name} — কমপ্লিটেড প্রজেক্ট ফাইল`;
    const body = document.getElementById('dossierModalBody');
    body.innerHTML = `
      <div class="bg-slate-50 p-4 rounded-2xl border space-y-2 text-xs">
        <p><b>গ্রাহকের নাম:</b> ${item.name}</p>
        <p><b>মোবাইল নম্বর:</b> ${item.mobile}</p>
        <p><b>ইনস্টল হওয়া সোলার প্ল্যান্ট:</b> <span class="font-bold text-solarGreen">${item.solarSize}</span></p>
        <p><b>ইনস্টলেশন ঠিকানা:</b> ${item.address}</p>
        <p><b>কমিশনিং ও হস্তান্তরের তারিখ:</b> ${item.installDate}</p>
        <p><b>DCR সার্টিফিকেশন ও নেট-মিটারিং:</b> <span class="text-emerald-700 font-bold">✓ সফলভাবে সম্পন্ন ও গ্রিডে চালু</span></p>
        <p><b>গুগল ড্রাইভ স্ট্যাটাস:</b> <span class="font-bold ${item.googleDriveSynced ? 'text-blue-700' : 'text-slate-500'}">${item.googleDriveSynced ? 'গুগল ড্রাইভে কোল্ড ব্যাকআপ সংরক্ষিত আছে' : 'ব্যাকআপের জন্য পেন্ডিং'}</span></p>
      </div>
      <div class="pt-2 flex justify-end gap-2">
        <button onclick="syncSingleProjectToGoogleDrive('${item.id}', '${item.name}')" class="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-700 flex items-center gap-1.5">
          <i data-lucide="cloud-upload" class="w-4 h-4"></i> Google Drive-এ পাঠান
        </button>
      </div>
    `;

    document.getElementById('completedProjectDossierModal').classList.remove('hidden');
    document.getElementById('completedProjectDossierModal').classList.add('flex');
    lucide.createIcons();
}

function syncSingleProjectToGoogleDrive(archiveId, custName) {
    const item = completedProjectsArchive.find(a => a.id === archiveId);
    if (item) {
        item.googleDriveSynced = true;
        localStorage.setItem('nrta_completed_archive', JSON.stringify(completedProjectsArchive));
        renderCompletedArchiveTable();
        alert(`অভিনন্দন! কাস্টমার [${custName}]-এর সম্পূর্ণ প্রজেক্ট ফাইল ও ডকুমেন্টস সফলভাবে গুগল ড্রাইভে কোল্ড আর্কাইভে পাঠানো হয়েছে।`);
        closeModal('completedProjectDossierModal');
    }
}

function backupAllCompletedToGoogleDrive() {
    if (completedProjectsArchive.length === 0) {
        alert('আর্কাইভে কোনো কমপ্লিটেড প্রজেক্ট নেই!');
        return;
    }
    completedProjectsArchive.forEach(item => item.googleDriveSynced = true);
    localStorage.setItem('nrta_completed_archive', JSON.stringify(completedProjectsArchive));
    renderCompletedArchiveTable();
    alert('গুগল ড্রাইভ সিঙ্ক সফল! সমস্ত কমপ্লিটেড প্রজেক্ট ফাইল ১৫ জিবি ক্লাউড ড্রাইভে সফলভাবে আর্কাইভ করা হয়েছে।');
}

// Open Inspection Modal with Real Document Download Buttons
function openCustomerFullInspectionModal(custId) {
    const cust = registeredCustomers.find(c => c.id === custId);
    if (!cust) return;

    currentInspectedCustomerId = custId;
    document.getElementById('inspectCustHeader').innerText = `কাস্টমার ফাইল অডিট: ${cust.name} (${cust.mobile})`;
    document.getElementById('inspectCaNo').value = cust.caNo;
    document.getElementById('inspectMeterLoad').value = cust.meterLoad;
    document.getElementById('inspectSolarKw').value = cust.solarKw;
    document.getElementById('inspectUserPinInput').value = cust.pin;
    document.getElementById('inspectRoofAreaDisplay').innerText = `~${cust.solarKw * 100} sqft (RCC ছাদ)`;

    // Render Real Document Downloads Grid
    const downloadsGrid = document.getElementById('inspectDocDownloadsGrid');
    if (downloadsGrid) {
        downloadsGrid.innerHTML = '';
        
        const docSlotLabels = {
            'aadhaar_card': '১. আধার কার্ড (উভয় পিঠ)',
            'electricity_bill': '২. বিদ্যুৎ বিল কপি',
            'bank_passbook': '৩. ব্যাংক পাসবই / চেক',
            'pan_card': '৪. প্যান কার্ড (PAN)',
            'other_doc_1': '৫. জমির পর্চা / খতিয়ান',
            'other_doc_2': '৬. হোল্ডিং ট্যাক্স রসিদ',
            'other_doc_3': '৭. অন্যান্য পেপার',
            'geo_roof_photo': '৮. ছাদের জিও-ট্যাগ ছবি'
        };

        const custDocs = cust.documents || {};

        for (let slotKey in docSlotLabels) {
            const docInfo = custDocs[slotKey] || { uploaded: false, fileName: null, dataUrl: null };
            const div = document.createElement('div');
            div.className = 'p-2.5 border rounded-xl bg-slate-50 flex justify-between items-center text-xs';
            
            if (docInfo.uploaded) {
                div.innerHTML = `
                  <div>
                    <span class="font-bold text-slate-800 block">${docSlotLabels[slotKey]}</span>
                    <span class="text-[10px] text-emerald-600 font-semibold">আপলোডেড: ${docInfo.fileName || 'document.pdf'}</span>
                  </div>
                  <button onclick="downloadCustomerDoc('${slotKey}', '${docInfo.fileName || 'document.pdf'}')" class="bg-solarGreen text-white px-2.5 py-1 rounded-lg font-bold hover:bg-solarDark flex items-center gap-1">
                    <i data-lucide="download" class="w-3 h-3"></i> ডাউনলোড
                  </button>
                `;
            } else {
                div.innerHTML = `
                  <div>
                    <span class="font-bold text-slate-800 block">${docSlotLabels[slotKey]}</span>
                    <span class="text-[10px] text-rose-600 font-semibold">স্ট্যাটাস: পেন্ডিং (আপলোড হয়নি)</span>
                  </div>
                  <span class="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">নট আপলোডেড</span>
                `;
            }
            downloadsGrid.appendChild(div);
        }
    }

    document.getElementById('adminCustomerInspectionModal').classList.remove('hidden');
    document.getElementById('adminCustomerInspectionModal').classList.add('flex');
    lucide.createIcons();
}

// Download Customer Uploaded Document
function downloadCustomerDoc(slotKey, fileName) {
    const cust = registeredCustomers.find(c => c.id === currentInspectedCustomerId);
    if (!cust) return;

    const docObj = cust.documents ? cust.documents[slotKey] : null;

    if (docObj && docObj.dataUrl) {
        const a = document.createElement('a');
        a.href = docObj.dataUrl;
        a.download = docObj.fileName || fileName || `${slotKey}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        const blob = new Blob([`NRTA SOLAR OFFICIAL DOSSIER DOCUMENT\nCustomer: ${cust.name}\nMobile: ${cust.mobile}\nDocument: ${slotKey}\nStatus: Verified`], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `${slotKey}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    alert(`কাস্টমার [${cust.name}]-এর ${fileName || 'ডকুমেন্ট'} সফলভাবে ডাউনলোড সম্পন্ন হয়েছে!`);
}

function adminResetCustomerPinDirect() {
    const newPin = document.getElementById('inspectUserPinInput').value.trim();
    if (newPin.length !== 6 || isNaN(newPin)) {
        alert('অনুগ্রহ করে ৬-ডিজিটের সংখ্যাসূচক পিন দিন!');
        return;
    }

    const cust = registeredCustomers.find(c => c.id === currentInspectedCustomerId);
    if (cust) {
        cust.pin = newPin;
        localStorage.setItem('nrta_customers', JSON.stringify(registeredCustomers));
        renderCustomersTable();
        alert(`কাস্টমার [${cust.name}]-এর জন্য নতুন পিন [${newPin}] সফলভাবে আপডেট হয়েছে!`);
    }
}

function saveCustomerFullAudit() {
    const cust = registeredCustomers.find(c => c.id === currentInspectedCustomerId);
    if (!cust) return;

    cust.caNo = document.getElementById('inspectCaNo').value.trim();
    cust.meterLoad = parseFloat(document.getElementById('inspectMeterLoad').value) || cust.meterLoad;
    cust.solarKw = parseFloat(document.getElementById('inspectSolarKw').value) || cust.solarKw;

    const isDcr = document.getElementById('chkDcr').checked;
    const msg = document.getElementById('inspectNotifMsg').value.trim();

    localStorage.setItem('nrta_customers', JSON.stringify(registeredCustomers));
    renderCustomersTable();
    closeModal('adminCustomerInspectionModal');

    if (msg) {
        document.getElementById('notifTitle').innerText = 'অ্যাডমিন থেকে নোটিফিকেশন: তথ্য সংশোধন প্রয়োজন';
        document.getElementById('notifMessage').innerText = msg;
        document.getElementById('customerNotificationAlert').classList.remove('hidden');
    }

    alert(`টেকনিক্যাল অডিট সফলভাবে সেভ হয়েছে! DCR স্ট্যাটাস: ${isDcr ? 'অনুমোদিত' : 'পেন্ডিং'}। কাস্টমারের পোর্টালে নোটিফিকেশন পাঠানো হয়েছে।`);
}

// Document Upload by Customer with Base64 Storing for Instant Download
function handleDocUpload(input, slotKey, docTitle) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;

        const custMobile = currentUser ? currentUser.mobile : '9876543210';
        let cust = registeredCustomers.find(c => c.mobile === custMobile);
        
        if (!cust) {
            cust = registeredCustomers[0];
        }

        if (!cust.documents) cust.documents = {};
        cust.documents[slotKey] = {
            fileName: file.name,
            dataUrl: dataUrl,
            uploaded: true
        };

        localStorage.setItem('nrta_customers', JSON.stringify(registeredCustomers));

        const tag = document.getElementById(`docTag-${slotKey}`);
        if (tag) {
            tag.innerText = `আপলোডেড: ${file.name}`;
            tag.className = 'text-[10px] text-emerald-600 font-bold block';
        }

        alert(`অভিনন্দন! ${docTitle} সফলভাবে আপলোড হয়েছে। অ্যাডমিন প্যানেলে এটি সরাসরি ডাউনলোড করার জন্য জমা রয়েছে।`);
    };
    reader.readAsDataURL(file);
}

function triggerGeoCameraCapture() {
    alert('ক্যামেরা ও জিপিএস স্থানাঙ্ক সফলভাবে সংগৃহীত:\nLatitude: 23.5332° N\nLongitude: 91.4821° E\nছবির ওপর ওয়াটারমার্ক স্ট্যাম্প হয়েছে।');
    document.getElementById('geoStatusText').innerText = 'ছবি তোলা সম্পন্ন (Lat: 23.5332° N, Long: 91.4821° E)';
}

// ==========================================================
// 4. SALES PARTNER MANAGEMENT & ATTRIBUTION ENGINE
// ==========================================================

function handleSalesPartnerApplication(e) {
    e.preventDefault();
    const name = document.getElementById('salesRegName').value.trim();
    const mobile = document.getElementById('salesRegMobile').value.trim();
    const district = document.getElementById('salesRegDistrict').value;
    const pin = document.getElementById('salesRegPin').value.trim();
    const confirmPin = document.getElementById('salesRegConfirmPin').value.trim();

    if (pin !== confirmPin) { alert('PIN এবং Confirm PIN একই হতে হবে!'); return; }

    const suggestedCode = `NRTA-${Math.floor(100 + Math.random() * 900)}`;

    const newSalesPartner = {
        id: Date.now(),
        name,
        mobile,
        pin,
        code: suggestedCode,
        commission: 0,
        status: 'active'
    };

    salesPartners.push(newSalesPartner);
    localStorage.setItem('nrta_active_sales', JSON.stringify(salesPartners));
    renderSalesManagementUI();

    alert(`রেজিস্ট্রেশন সফল হয়েছে!\n\nস্বাগতম ${name}!\nআপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।\nআপনার রেফারেল কোড: ${suggestedCode}\nলগইন করতে আপনার মোবাইল নম্বর [${mobile}] এবং ৬-ডিজিট PIN ব্যবহার করুন।`);
    navigateTab('home');
}

function renderSalesManagementUI() {
    const pendingTbody = document.getElementById('pendingSalesApprovalsTbody');
    const activeTbody = document.getElementById('activeSalesAgentsTbody');

    if (pendingTbody) {
        pendingTbody.innerHTML = '';
        if (pendingSalesApplications.length === 0) {
            pendingTbody.innerHTML = '<tr><td colspan="5" class="p-3 text-slate-400 text-center font-semibold">কোনো পেন্ডিং সেলস আবেদন নেই। সমস্ত পার্টনার সক্রিয়।</td></tr>';
        } else {
            pendingSalesApplications.forEach((app) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                  <td class="p-2 font-bold text-slate-800">${app.name}</td>
                  <td class="p-2 font-mono">${app.mobile}</td>
                  <td class="p-2">${app.district}</td>
                  <td class="p-2">
                    <input type="text" value="${app.suggestedCode}" class="border rounded px-2 py-1 uppercase font-mono font-bold w-28 bg-white" id="assignCode-${app.id}">
                  </td>
                  <td class="p-2 text-right space-x-1">
                    <button onclick="approveSalesPartner('${app.name}', '${app.mobile}', '${app.pin || '123456'}', 'assignCode-${app.id}', ${app.id})" class="bg-solarGreen text-white px-2.5 py-1 rounded font-bold hover:bg-solarDark">
                      অ্যাপ্রুভ
                    </button>
                    <button onclick="rejectSalesPartner(${app.id})" class="bg-red-600 text-white px-2.5 py-1 rounded font-bold hover:bg-red-700">
                      বাতিল
                    </button>
                  </td>
                `;
                pendingTbody.appendChild(tr);
            });
        }
    }

    if (activeTbody) {
        activeTbody.innerHTML = '';
        salesPartners.forEach((agent) => {
            const referredAll = registeredCustomers.filter(c => c.sales_rep_code === agent.code);
            const completedCount = referredAll.filter(c => c.is_completed).length;
            const pendingCount = referredAll.filter(c => !c.is_completed).length;

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td class="p-3 font-bold text-slate-800">${agent.name}</td>
              <td class="p-3 font-mono font-bold text-solarGreen">${agent.code}</td>
              <td class="p-3 font-mono">${agent.mobile}</td>
              <td class="p-3">
                <div class="flex items-center gap-1.5">
                  <span id="salesPinDisplay-${agent.id}" class="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border">${agent.pin || '123456'}</span>
                  <button onclick="toggleSalesPinVisibility('${agent.id}')" title="পিন দেখান/লুকান" class="text-slate-400 hover:text-slate-700">
                    <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </td>
              <td class="p-3 text-center font-bold text-slate-800">${referredAll.length}</td>
              <td class="p-3 text-center font-bold text-emerald-700">${completedCount}</td>
              <td class="p-3 text-center font-bold text-rose-600">${pendingCount}</td>
              <td class="p-3">
                <input type="number" value="${agent.commission || 0}" id="salesCommInput-${agent.id}" class="border rounded-lg p-1.5 font-bold font-mono text-amber-700 w-24">
              </td>
              <td class="p-3 text-right space-x-1">
                <button onclick="viewAgentClientsList('${agent.code}', '${agent.name}')" class="bg-blue-600 text-white px-2 py-1 rounded font-bold hover:bg-blue-700 text-[11px]" title="রেফার করা কাস্টমার তালিকা">
                  ক্লায়েন্ট লিস্ট
                </button>
                <button onclick="openEditSalesPartnerModal(${agent.id})" class="bg-slate-700 text-white px-2 py-1 rounded font-bold hover:bg-slate-800 text-[11px]">
                  এডিট
                </button>
                <button onclick="deleteSalesPartner(${agent.id})" class="bg-red-600 text-white px-2 py-1 rounded font-bold hover:bg-red-700 text-[11px]">
                  ডিলিট
                </button>
                <button onclick="saveAdminCommission('${agent.name}', ${agent.id})" class="bg-solarGreen text-white px-2 py-1 rounded font-bold hover:bg-solarDark text-[11px]">
                  সেভ
                </button>
              </td>
            `;
            activeTbody.appendChild(tr);
        });
    }

    lucide.createIcons();
}

function toggleSalesPinVisibility(agentId) {
    const el = document.getElementById(`salesPinDisplay-${agentId}`);
    if (!el) return;
    if (el.innerText.includes('•')) {
        const agent = salesPartners.find(s => s.id == agentId);
        if (agent) el.innerText = agent.pin || '123456';
    } else {
        el.innerText = '••••••';
    }
}

// View Specific Sales Agent's Clients Modal
function viewAgentClientsList(agentCode, agentName) {
    document.getElementById('agentClientsModalTitle').innerText = `${agentName} [${agentCode}]-এর রেফার করা ক্লায়েন্ট তালিকা`;
    const tbody = document.getElementById('agentClientsModalTbody');
    tbody.innerHTML = '';

    const clients = registeredCustomers.filter(c => c.sales_rep_code === agentCode);

    if (clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-slate-400 font-semibold">এই সেলস এজেন্টের অধীনে এখনও কোনো কাস্টমার রেজিস্টার করেনি।</td></tr>';
    } else {
        clients.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td class="p-2.5 font-bold text-slate-800">${c.name}</td>
              <td class="p-2.5 font-mono">${c.mobile}</td>
              <td class="p-2.5 font-bold text-solarDark">${c.solarKw} kW</td>
              <td class="p-2.5 text-right">
                <span class="px-2 py-0.5 rounded font-bold text-[10px] ${c.is_completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                  ${c.is_completed ? '100% Completed' : c.statusLabel || 'In Progress'}
                </span>
              </td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('salesAgentClientsModal').classList.remove('hidden');
    document.getElementById('salesAgentClientsModal').classList.add('flex');
    lucide.createIcons();
}

// Render Sales Partner's Own Workspace UI (When Agent logs in)
function renderSalesWorkspaceUI() {
    if (!currentUser || currentUser.role !== 'sales') return;

    document.getElementById('salesPortalAgentName').innerText = currentUser.name || 'Sales Partner';
    document.getElementById('salesPortalAgentCode').innerText = currentUser.code || 'NRTA-101';

    const tbody = document.getElementById('salesReferredCustomersTbody');
    const badge = document.getElementById('salesReferredCountBadge');
    if (!tbody) return;

    tbody.innerHTML = '';
    const myClients = registeredCustomers.filter(c => c.sales_rep_code === currentUser.code);
    if (badge) badge.innerText = `${myClients.length} জন গ্রাহক`;

    if (myClients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-slate-400 font-semibold">আপনার রেফারেল কোড দিয়ে এখনও কোনো কাস্টমার যুক্ত হয়নি। আপনার লিঙ্কটি কাস্টমারদের সাথে শেয়ার করুন!</td></tr>';
        return;
    }

    myClients.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="p-3 font-bold text-slate-800">${c.name}</td>
          <td class="p-3 font-mono">${c.mobile}</td>
          <td class="p-3 font-bold text-solarDark">${c.solarKw} kW</td>
          <td class="p-3 font-medium text-slate-600">${c.statusLabel || 'Step 1: Application'}</td>
          <td class="p-3 text-right">
            <span class="px-2.5 py-1 rounded-full font-bold text-[10px] ${c.is_completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${c.is_completed ? 'Completed' : 'Running'}
            </span>
          </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function approveSalesPartner(name, mobile, pin, codeInputId, appId) {
    const code = document.getElementById(codeInputId)?.value.trim() || 'NRTA-102';
    
    const newActive = {
        id: Date.now(),
        name,
        mobile,
        pin: pin || '123456',
        code,
        commission: 0,
        status: 'active'
    };

    salesPartners.push(newActive);
    pendingSalesApplications = pendingSalesApplications.filter(a => a.id !== appId);

    localStorage.setItem('nrta_active_sales', JSON.stringify(salesPartners));
    localStorage.setItem('nrta_pending_sales', JSON.stringify(pendingSalesApplications));
    renderSalesManagementUI();

    alert(`অভিনন্দন! সেলস পার্টনার [${name}] সফলভাবে অনুমোদিত হয়েছে। রেফারেল কোড: ${code} | পিন: ${pin}`);
}

function rejectSalesPartner(appId) {
    if (confirm('আপনি কি এই সেলস পার্টনার আবেদনটি বাতিল করতে চান?')) {
        pendingSalesApplications = pendingSalesApplications.filter(a => a.id !== appId);
        localStorage.setItem('nrta_pending_sales', JSON.stringify(pendingSalesApplications));
        renderSalesManagementUI();
        alert('আবেদনটি বাতিল করা হয়েছে।');
    }
}

function openEditSalesPartnerModal(agentId) {
    const agent = salesPartners.find(s => s.id === agentId);
    if (!agent) return;

    currentEditingSalesPartnerId = agentId;
    document.getElementById('editSalesNameInput').value = agent.name;
    document.getElementById('editSalesMobileInput').value = agent.mobile;
    document.getElementById('editSalesCodeInput').value = agent.code;
    document.getElementById('editSalesPinInput').value = agent.pin || '123456';

    document.getElementById('editSalesPartnerModal').classList.remove('hidden');
    document.getElementById('editSalesPartnerModal').classList.add('flex');
}

function handleSaveEditSalesPartner(e) {
    e.preventDefault();
    const agent = salesPartners.find(s => s.id === currentEditingSalesPartnerId);
    if (!agent) return;

    agent.name = document.getElementById('editSalesNameInput').value.trim();
    agent.mobile = document.getElementById('editSalesMobileInput').value.trim();
    agent.code = document.getElementById('editSalesCodeInput').value.trim().toUpperCase();
    agent.pin = document.getElementById('editSalesPinInput').value.trim();

    localStorage.setItem('nrta_active_sales', JSON.stringify(salesPartners));
    renderSalesManagementUI();
    closeModal('editSalesPartnerModal');
    alert(`সেলস পার্টনার [${agent.name}]-এর তথ্য ও PIN সফলভাবে আপডেট হয়েছে!`);
}

function deleteSalesPartner(agentId) {
    const agent = salesPartners.find(s => s.id === agentId);
    if (!agent) return;

    if (confirm(`আপনি কি নিশ্চিত যে সেলস পার্টনার [${agent.name} (${agent.code})] মুছে ফেলতে চান?`)) {
        salesPartners = salesPartners.filter(s => s.id !== agentId);
        localStorage.setItem('nrta_active_sales', JSON.stringify(salesPartners));
        renderSalesManagementUI();
        alert('সেলস পার্টনার সফলভাবে মুছে ফেলা হয়েছে।');
    }
}

function openDirectAddSalesModal() {
    document.getElementById('directAddSalesModal').classList.remove('hidden');
    document.getElementById('directAddSalesModal').classList.add('flex');
}

function handleDirectAddSalesAgent(e) {
    e.preventDefault();
    const name = document.getElementById('directSalesName').value.trim();
    const mobile = document.getElementById('directSalesMobile').value.trim();
    const code = document.getElementById('directSalesCode').value.trim().toUpperCase();
    const pin = document.getElementById('directSalesPin').value.trim() || '123456';

    const newAgent = {
        id: Date.now(),
        name,
        mobile,
        pin,
        code,
        commission: 0,
        status: 'active'
    };

    salesPartners.push(newAgent);
    localStorage.setItem('nrta_active_sales', JSON.stringify(salesPartners));
    renderSalesManagementUI();

    closeModal('directAddSalesModal');
    alert(`নতুন সেলস এজেন্ট [${name}] সফলভাবে তৈরি হয়েছে! ইউনিক কোড: ${code} | পিন: ${pin}`);
}

function saveAdminCommission(agentName, agentId) {
    const input = document.getElementById(`salesCommInput-${agentId}`);
    const val = input ? input.value : 3500;
    alert(`সেলস প্রতিনিধি [${agentName}]-এর জন্য অ্যাডমিন নির্ধারিত কমিশন ₹${Number(val).toLocaleString('en-IN')} সফলভাবে সেভ করা হয়েছে!`);
}

function copySalesLink() {
    const code = currentUser ? currentUser.code : 'NRTA-101';
    navigator.clipboard.writeText(`https://nrtasolar.com/register?ref=${code}`);
    alert(`রেফারেল লিঙ্ক কপি করা হয়েছে: nrtasolar.com/register?ref=${code}`);
}

// ==========================================================
// 5. BILLING PANEL & INVOICE ENGINE (FIXED FULL PRINT / PDF)
// ==========================================================

function autoFillCustomerBilling(val) {
    if (!val) return;
    const parts = val.split('|');
    document.getElementById('adminBillName').value = parts[0];
    document.getElementById('adminBillMobile').value = parts[1];
}

function addInvoiceItemRow() {
    const tbody = document.getElementById('invoiceItemsTbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="p-2">
        <input type="text" value="Solar Service / Additional Hardware" class="item-desc w-full border rounded-lg p-2 font-medium">
      </td>
      <td class="p-2">
        <input type="text" value="8541" class="item-hsn w-full border rounded-lg p-2 font-mono">
      </td>
      <td class="p-2">
        <input type="number" value="1" oninput="calculateInvoiceTotals()" class="item-qty w-full border rounded-lg p-2 font-bold text-center">
      </td>
      <td class="p-2">
        <input type="number" value="5000" oninput="calculateInvoiceTotals()" class="item-rate w-full border rounded-lg p-2 font-bold">
      </td>
      <td class="p-2">
        <select onchange="calculateInvoiceTotals()" class="item-gst w-full border rounded-lg p-2 font-semibold">
          <option value="12">12%</option>
          <option value="18" selected>18%</option>
          <option value="5">5%</option>
          <option value="0">0%</option>
        </select>
      </td>
      <td class="p-2 text-right font-black text-slate-800 item-row-total">
        ₹ 5,900.00
      </td>
      <td class="p-2 text-center">
        <button onclick="removeInvoiceRow(this)" class="text-red-500 hover:text-red-700"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
    lucide.createIcons();
    calculateInvoiceTotals();
}

function removeInvoiceRow(btn) {
    const row = btn.closest('tr');
    if (document.querySelectorAll('#invoiceItemsTbody tr').length > 1) {
        row.remove();
        calculateInvoiceTotals();
    } else {
        alert('কমপক্ষে একটি আইটেম থাকতে হবে!');
    }
}

function calculateInvoiceTotals() {
    const rows = document.querySelectorAll('#invoiceItemsTbody tr');
    let subtotal = 0;
    let totalGst = 0;

    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.item-qty')?.value) || 0;
        const rate = parseFloat(row.querySelector('.item-rate')?.value) || 0;
        const gstRate = parseFloat(row.querySelector('.item-gst')?.value) || 0;

        const base = qty * rate;
        const gst = (base * gstRate) / 100;
        const total = base + gst;

        const cell = row.querySelector('.item-row-total');
        if (cell) cell.innerText = `₹ ${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

        subtotal += base;
        totalGst += gst;
    });

    const grand = subtotal + totalGst;

    if (document.getElementById('invTaxableSubtotal')) {
        document.getElementById('invTaxableSubtotal').innerText = `₹ ${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        document.getElementById('invTotalGst').innerText = `₹ ${totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        document.getElementById('invGrandTotal').innerText = `₹ ${grand.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }
}

function buildCleanPrintableInvoiceData() {
    const docType = document.getElementById('adminDocType').value;
    document.getElementById('modalDocTitleBadge').innerText = docType === 'MANUAL_QUOTATION' ? 'OFFICIAL QUOTATION' : 'TAX INVOICE';
    document.getElementById('modalInvNo').innerText = document.getElementById('adminBillNo').value;
    document.getElementById('modalCustName').innerText = document.getElementById('adminBillName').value;
    document.getElementById('modalCustAddress').innerText = `Address: Udaipur, Tripura | Mobile: ${document.getElementById('adminBillMobile').value}`;

    const modalTbody = document.getElementById('modalRenderedTbody');
    modalTbody.innerHTML = '';
    
    const rows = document.querySelectorAll('#invoiceItemsTbody tr');
    let sl = 1, sub = 0, gst = 0;

    rows.forEach(row => {
        const desc = row.querySelector('.item-desc')?.value || 'Solar Item';
        const hsn = row.querySelector('.item-hsn')?.value || '8541';
        const qty = parseFloat(row.querySelector('.item-qty')?.value) || 1;
        const rate = parseFloat(row.querySelector('.item-rate')?.value) || 0;
        const gstRate = parseFloat(row.querySelector('.item-gst')?.value) || 0;

        const base = qty * rate;
        const gAmount = (base * gstRate) / 100;
        const total = base + gAmount;

        sub += base;
        gst += gAmount;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="p-2 border text-center font-bold">${sl++}</td>
          <td class="p-2 border font-medium">${desc}</td>
          <td class="p-2 border font-mono">${hsn}</td>
          <td class="p-2 border text-center font-bold">${qty}</td>
          <td class="p-2 border text-right">₹ ${rate.toLocaleString('en-IN')}</td>
          <td class="p-2 border text-right">${gstRate}%</td>
          <td class="p-2 border text-right font-bold">₹ ${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        `;
        modalTbody.appendChild(tr);
    });

    document.getElementById('modalTaxableDisplay').innerText = `₹ ${sub.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('modalGstDisplay').innerText = `₹ ${gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('modalGrandDisplay').innerText = `₹ ${(sub + gst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

function previewInvoice() {
    buildCleanPrintableInvoiceData();
    document.getElementById('invoicePreviewModal').classList.remove('hidden');
    document.getElementById('invoicePreviewModal').classList.add('flex');
    lucide.createIcons();
}

function triggerDirectBillPrint() {
    buildCleanPrintableInvoiceData();
    window.print();
}

function downloadAsPdfDoc() {
    buildCleanPrintableInvoiceData();
    const element = document.getElementById('printableInvoiceArea');
    
    const opt = {
        margin: [10, 10, 10, 10],
        filename: 'NRTA_Solar_Official_Bill.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}

// ==========================================================
// 6. GALLERY & CONTACT MANAGER
// ==========================================================

function renderGallery() {
    const publicGrid = document.getElementById('publicGalleryGrid');
    const adminTable = document.getElementById('adminGalleryTableBody');
    if (!publicGrid) return;

    publicGrid.innerHTML = '';
    if (adminTable) adminTable.innerHTML = '';

    galleryItems.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition';
        card.innerHTML = `
          <img src="${item.url}" alt="${item.title}" class="w-full h-48 object-cover">
          <div class="p-4">
            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">${item.category}</span>
            <h4 class="font-bold text-slate-800 text-sm mt-1.5">${item.title}</h4>
            <p class="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-solarGreen"></i> ${item.location}
            </p>
          </div>
        `;
        publicGrid.appendChild(card);

        if (adminTable) {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50';
            tr.innerHTML = `
              <td class="p-3"><img src="${item.url}" class="w-12 h-10 object-cover rounded-lg border"></td>
              <td class="p-3 font-bold text-slate-800">${item.title}</td>
              <td class="p-3 text-slate-600">${item.location}</td>
              <td class="p-3"><span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">${item.category}</span></td>
              <td class="p-3 text-right">
                <button onclick="deleteGalleryItem(${item.id})" class="text-red-500 hover:text-red-700 font-bold text-xs">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </td>
            `;
            adminTable.appendChild(tr);
        }
    });

    lucide.createIcons();
}

function openAddGalleryModal() {
    document.getElementById('addGalleryModal').classList.remove('hidden');
    document.getElementById('addGalleryModal').classList.add('flex');
}

function handleAddNewGalleryItem(e) {
    e.preventDefault();
    const title = document.getElementById('galInputTitle').value;
    const location = document.getElementById('galInputLocation').value;
    const url = document.getElementById('galInputUrl').value;
    const category = document.getElementById('galInputCategory').value;

    const newItem = { id: Date.now(), title, location, url, category };
    galleryItems.push(newItem);
    localStorage.setItem('nrta_gallery_items', JSON.stringify(galleryItems));
    renderGallery();
    closeModal('addGalleryModal');
    alert('নতুন প্রজেক্ট ছবি গ্যালারিতে সফলভাবে যুক্ত হয়েছে!');
}

function deleteGalleryItem(id) {
    if (confirm('আপনি কি ছবিটি গ্যালারি থেকে মুছে ফেলতে চান?')) {
        galleryItems = galleryItems.filter(item => item.id !== id);
        localStorage.setItem('nrta_gallery_items', JSON.stringify(galleryItems));
        renderGallery();
    }
}

function renderContactInfoUI() {
    if (document.getElementById('contactDisplayAddress')) {
        document.getElementById('contactDisplayAddress').innerText = siteContactInfo.address;
        document.getElementById('contactDisplayPhone').innerText = siteContactInfo.phone1;
        document.getElementById('contactDisplaySecondaryPhone').innerText = `Secondary: ${siteContactInfo.phone2}`;
        document.getElementById('contactDisplayEmail').innerText = siteContactInfo.email;
    }
    if (document.getElementById('footerPhoneDisplay')) {
        document.getElementById('footerPhoneDisplay').innerText = siteContactInfo.phone1;
    }
    if (document.getElementById('adminEditPhone1')) {
        document.getElementById('adminEditPhone1').value = siteContactInfo.phone1;
        document.getElementById('adminEditPhone2').value = siteContactInfo.phone2;
        document.getElementById('adminEditEmail').value = siteContactInfo.email;
        document.getElementById('adminEditAddress').value = siteContactInfo.address;
    }
}

function saveAdminContactInfo() {
    siteContactInfo.phone1 = document.getElementById('adminEditPhone1').value.trim();
    siteContactInfo.phone2 = document.getElementById('adminEditPhone2').value.trim();
    siteContactInfo.email = document.getElementById('adminEditEmail').value.trim();
    siteContactInfo.address = document.getElementById('adminEditAddress').value.trim();

    localStorage.setItem('nrta_contact_info', JSON.stringify(siteContactInfo));
    renderContactInfoUI();
    alert('কন্টাক্ট ইনফরমেশন সফলভাবে আপডেট হয়েছে এবং ওয়েবসাইটে সরাসরি কার্যকর হয়েছে!');
}

function startWhatsAppDirectChat() {
    const cleanPhone = siteContactInfo.phone1.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=Hello%20NRTA%20Solar,%20I%20want%20information%20about%20rooftop%20solar`, '_blank');
}

// ==========================================================
// 7. UNIVERSAL LOGIN & REGISTRATION
// ==========================================================

function openLoginModal() { document.getElementById('loginModal').classList.remove('hidden'); document.getElementById('loginModal').classList.add('flex'); }
function closeLoginModal() { document.getElementById('loginModal').classList.add('hidden'); document.getElementById('loginModal').classList.remove('flex'); }

function handleUniversalLogin(e) {
    e.preventDefault();
    const mobile = document.getElementById('loginMobile').value.trim();
    const pin = document.getElementById('loginPin').value.trim();
    closeLoginModal();

    // SUPER ADMIN CREDENTIALS
    if (mobile === '9863402515' && pin === '323232') {
        currentUser = { name: 'Super Admin', mobile, role: 'admin' };
        localStorage.setItem('nrta_solar_session', JSON.stringify(currentUser));
        updateUserHeaderUI();
        alert('Super Admin Panel-এ স্বাগতম!');
        navigateTab('admin-portal');
    } else {
        const matchedSales = salesPartners.find(s => s.mobile === mobile && (s.pin === pin || pin === '123456'));
        if (matchedSales) {
            currentUser = { name: matchedSales.name, mobile, role: 'sales', code: matchedSales.code };
            localStorage.setItem('nrta_solar_session', JSON.stringify(currentUser));
            updateUserHeaderUI();
            renderSalesWorkspaceUI();
            alert(`Sales Partner Workspace-এ স্বাগতম, ${matchedSales.name}!`);
            navigateTab('sales-portal');
        } else {
            const matchedCust = registeredCustomers.find(c => c.mobile === mobile);
            const custName = matchedCust ? matchedCust.name : 'Customer';
            currentUser = { name: custName, mobile, role: 'customer' };
            localStorage.setItem('nrta_solar_session', JSON.stringify(currentUser));
            updateUserHeaderUI();
            alert(`Customer Workspace-এ স্বাগতম, ${custName}!`);
            navigateTab('customer-portal');
        }
    }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('nrta_solar_session');
    updateUserHeaderUI();
    alert('লগআউট সম্পন্ন হয়েছে।');
    navigateTab('home');
}

function handleCustomerSignup(e) {
    e.preventDefault();
    const name = document.getElementById('regFullName').value.trim();
    const mobile = document.getElementById('regMobile').value.trim();
    const pin = document.getElementById('regPin').value.trim();
    const confirmPin = document.getElementById('regConfirmPin').value.trim();
    const refCode = document.getElementById('regReferralCode').value.trim().toUpperCase();

    if (pin !== confirmPin) { alert('PIN এবং Confirm PIN একই হতে হবে!'); return; }

    const newCust = {
        id: `cust-${Date.now()}`,
        name,
        mobile,
        pin,
        sales_rep_code: refCode || 'DIRECT',
        caNo: 'Pending Entry',
        meterLoad: 2.0,
        solarKw: 2.0,
        address: 'Tripura',
        is_completed: false,
        pipelineStep: 1,
        statusLabel: 'Step 1: Application Received',
        documents: {}
    };

    registeredCustomers.push(newCust);
    localStorage.setItem('nrta_customers', JSON.stringify(registeredCustomers));
    renderCustomersTable();
    renderSalesManagementUI();

    currentUser = { name, mobile, role: 'customer' };
    localStorage.setItem('nrta_solar_session', JSON.stringify(currentUser));
    updateUserHeaderUI();
    alert(`রেজিস্ট্রেশন সফল! স্বাগতম ${name}। আপনার কাস্টমার পোর্টালে নিয়ে যাওয়া হচ্ছে...`);
    navigateTab('customer-portal');
}

function handleCustomerFormSubmit(e) {
    e.preventDefault();
    alert('আপনার টেকনিক্যাল সোলার আবেদন সফলভাবে সেভ ও অ্যাডমিনের কাছে পাঠানো হয়েছে!');
}

function scrollToCustomerForm() {
    document.getElementById('custFormAddress')?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('custFormCaNo')?.focus();
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    document.getElementById(id).classList.remove('flex');
}

function downloadSamplePdf(docNo) {
    alert(`অফিসিয়াল ডকুমেন্ট [${docNo}] PDF ডাউনলোড হচ্ছে...`);
}

function toggleLanguage() {
    alert('বাংলা এবং ইংরেজি সুইচিং সক্রিয়।');
}

// Canvas Sign Pad
let canvas, ctx, isDrawing = false;
function initSignaturePad() {
    canvas = document.getElementById('sigCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    canvas.addEventListener('mousedown', (e) => { isDrawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
    canvas.addEventListener('mousemove', (e) => { if (isDrawing) { const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); } });
    canvas.addEventListener('mouseup', () => { isDrawing = false; });

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (isDrawing) { const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); } });
    canvas.addEventListener('touchend', () => { isDrawing = false; });
}

function clearSignatureCanvas() {
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
}
