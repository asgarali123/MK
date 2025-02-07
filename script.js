// -----------------------------
// Firebase Initialization
// -----------------------------
async function importFirebase() {
    try {
      const { initializeApp } = await import(
        "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js"
      );
      const { getAnalytics } = await import(
        "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js"
      );
      const firebaseConfig = {
        apiKey: "AIzaSyAqF7j5-Z7Jk6tVDuPYEliAzsymMEO1X9c",
        authDomain: "mka-ad55d.firebaseapp.com",
        projectId: "mka-ad55d",
        storageBucket: "mka-ad55d.firebasestorage.app",
        messagingSenderId: "843306351718",
        appId: "1:843306351718:web:dab158f73134ae6108c1a7",
        measurementId: "G-7EWKR1D6Q2"
      };
      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);
      console.log("Firebase initialized:", app);
    } catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  }
  
  // -----------------------------
  // Helper Functions for Fractions
  // -----------------------------
  function chooseDimension(minVal, maxVal) {
    const a = parseFraction(minVal);
    const b = parseFraction(maxVal);
    if (a != null && b != null) {
      return a < b ? minVal : maxVal;
    } else if (a != null) {
      return minVal;
    } else if (b != null) {
      return maxVal;
    }
    return "0";
  }
  
  function parseFraction(str) {
    if (!str) return null;
    try {
      if (/^\d+(\.\d+)?$/.test(str)) {
        return parseFloat(str);
      }
      let total = 0;
      let parts = str.split(" ");
      if (parts.length === 1) {
        if (parts[0].includes("/")) {
          total += fractionToDecimal(parts[0]);
        } else {
          total += parseFloat(parts[0]);
        }
      } else if (parts.length === 2) {
        total += parseFloat(parts[0]);
        total += fractionToDecimal(parts[1]);
      }
      return total;
    } catch (e) {
      return null;
    }
  }
  
  function fractionToDecimal(fracStr) {
    const [num, den] = fracStr.split("/");
    return parseFloat(num) / parseFloat(den);
  }
  
  function toFractionString(num) {
    if (isNaN(num)) return "0";
    let sign = num < 0 ? -1 : 1;
    num = Math.abs(num);
    let intPart = Math.floor(num);
    let frac = num - intPart;
    if (frac < 0.00001) {
      return String(sign * intPart);
    }
    let numerator = Math.round(frac * 16);
    let denominator = 16;
    let gcdVal = gcd(numerator, denominator);
    numerator /= gcdVal;
    denominator /= gcdVal;
    if (numerator === denominator) {
      intPart += 1;
      return (sign * intPart).toString();
    }
    if (intPart !== 0) {
      return `${sign * intPart} ${numerator}/${denominator}`;
    } else {
      return `${sign * numerator}/${denominator}`;
    }
  }
  
  function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  }
  
  function fractionSubtract(aStr, bStr) {
    let a = parseFraction(aStr) || 0;
    let b = parseFraction(bStr) || 0;
    let diff = a - b;
    return toFractionString(diff);
  }
  
  function fractionDivide(aStr, divisor) {
    let a = parseFraction(aStr) || 0;
    if (!divisor || divisor === 0) divisor = 1;
    let result = a / divisor;
    return toFractionString(result);
  }
  
  function toNearest16th(fracStr) {
    let dec = parseFraction(fracStr) || 0;
    let x = dec * 16;
    let xRounded = Math.floor(x + 0.4999999);
    let finalDec = xRounded / 16;
    return toFractionString(finalDec);
  }
  
  // -----------------------------
  // Main Script (Executed after DOM loads)
  // -----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    // Navigation Links & Toast Notifications
    const navLinks = document.querySelectorAll(".nav-link");
    const showToast = (message) => {
      const toastBody = document.querySelector(".toast .toast-body");
      if (toastBody) {
        toastBody.textContent = message;
        const toastEl = document.querySelector(".toast");
        if (toastEl) {
          const toast = new bootstrap.Toast(toastEl);
          toast.show();
        }
      }
    };
  
    navLinks.forEach(link => {
      link.addEventListener("click", (event) => {
        if (link.classList.contains("disabled")) {
          showToast("This link is disabled.");
          event.preventDefault();
        } else {
          showToast(`Navigating to: ${link.textContent}`);
        }
      });
    });
  
    // Initialize Firebase
    importFirebase();
  
    // Simple Calculator
    const btnAdd = document.getElementById("btnAdd");
    const btnSubtract = document.getElementById("btnSubtract");
    const btnMultiply = document.getElementById("btnMultiply");
    const btnDivide = document.getElementById("btnDivide");
    const resultEl = document.getElementById("resultDisplay");
  
    if (btnAdd && btnSubtract && btnMultiply && btnDivide && resultEl) {
      function getValues() {
        const val1 = parseFloat(document.getElementById("val1").value) || 0;
        const val2 = parseFloat(document.getElementById("val2").value) || 0;
        return { val1, val2 };
      }
  
      btnAdd.addEventListener("click", () => {
        const { val1, val2 } = getValues();
        resultEl.textContent = "Result: " + (val1 + val2);
      });
  
      btnSubtract.addEventListener("click", () => {
        const { val1, val2 } = getValues();
        resultEl.textContent = "Result: " + (val1 - val2);
      });
  
      btnMultiply.addEventListener("click", () => {
        const { val1, val2 } = getValues();
        resultEl.textContent = "Result: " + (val1 * val2);
      });
  
      btnDivide.addEventListener("click", () => {
        const { val1, val2 } = getValues();
        if (val2 === 0) {
          resultEl.textContent = "Result: Error (divide by zero)";
        } else {
          resultEl.textContent = "Result: " + (val1 / val2);
        }
      });
    }
  
    // Table Toggle Button
    const toggleTableButton = document.getElementById("toggleTableButton");
    if (toggleTableButton) {
      toggleTableButton.addEventListener("click", () => {
        const tableContainer = document.getElementById("tableContainer");
        if (tableContainer) {
          if (tableContainer.style.display === "none") {
            tableContainer.style.display = "block";
            toggleTableButton.textContent = "Hide Windows with 36\" Width";
          } else {
            tableContainer.style.display = "none";
            toggleTableButton.textContent = "Show Windows with 36\" Width";
          }
        }
      });
    }
  
    // Fraction-Based Dimensions Calculator
    const calcDimensionsBtn = document.getElementById("calcDimensionsBtn");
    if (calcDimensionsBtn) {
      calcDimensionsBtn.addEventListener("click", () => {
        const minWidth = document.getElementById("minWidth").value.trim();
        const maxWidth = document.getElementById("maxWidth").value.trim();
        const minHeight = document.getElementById("minHeight").value.trim();
        const maxHeight = document.getElementById("maxHeight").value.trim();
        const numSections = parseInt(document.getElementById("numSections").value) || 1;
        const exactRadio = document.getElementById("exactRadio");
        const installRadio = document.getElementById("installRadio");
  
        let chosenWidth = chooseDimension(minWidth, maxWidth);
        let chosenHeight = chooseDimension(minHeight, maxHeight);
        let outerWidth = chosenWidth;
        let outerHeight = chosenHeight;
        if (installRadio && installRadio.checked) {
          outerWidth = fractionSubtract(outerWidth, "1/8");
          outerHeight = fractionSubtract(outerHeight, "1/8");
        }
        let innerWidth = fractionSubtract(outerWidth, "1 7/16");
        let innerHeight = fractionSubtract(outerHeight, "1 7/16");
        let po = chosenHeight;
        if (numSections > 1) {
          po = fractionSubtract(chosenHeight, "1 9/16");
        }
        let glassWidth = fractionSubtract(innerWidth, "2 13/16");
        let glassHeight = fractionSubtract(innerHeight, "2 13/16");
        if (numSections > 1) {
          innerWidth = fractionDivide(innerWidth, numSections);
        }
        outerWidth = toNearest16th(outerWidth);
        outerHeight = toNearest16th(outerHeight);
        innerWidth = toNearest16th(innerWidth);
        innerHeight = toNearest16th(innerHeight);
        po = toNearest16th(po);
        glassWidth = toNearest16th(glassWidth);
        glassHeight = toNearest16th(glassHeight);
  
        const output = [
          "Outer:",
          "  Width:  " + outerWidth,
          "  Height: " + outerHeight,
          "",
          "Inner:",
          "  Width:  " + innerWidth,
          "  Height: " + innerHeight,
          "",
          "PO:",
          "  " + po,
          "",
          "Glass:",
          "  Width:  " + glassWidth,
          "  Height: " + glassHeight
        ].join("\n");
  
        document.getElementById("dimensionsOutput").textContent = output;
      });
    }
  
    // -----------------------------
    // Die Table Pagination with Page Numbers as Links
    // -----------------------------
    const allRows = [
      ["A12", "#N/A"],
      ["A6", "#N/A"],
      ["A8", "#N/A"],
      ["C026", "#N/A"],
      ["F4", "#N/A"],
      ["HB016", "LIGHTEST DOOR JAMB"],
      ["HB043", "LOUVRE JAMB"],
      ["HB045", "OPERATING BAR"],
      ["HB050", "POCKET INTERLOCK"],
      ["HB051", "TRACK"],
      ["HB057", "TRACK"],
      ["HB061", "TRACK CLIP"],
      ["HB062", "TRACK SLOPE"],
      ["HB080", "OPEN BACK"],
      ["HB081", "TRESHHOLD"],
      ["HB082", "CLOSED BACK SINGLE FIN"],
      ["HB083", "RECTANGLE TUBE - 4\" x 1 3/4\""],
      ["HB085", "SHOPFRONT CLOSED BACK 2 FIN"],
      ["HB086", "SHOPFRONT OPEN BACK 1 FIN"],
      ["HB091", "TRESHHOLD"],
      ["HB094", "INTERLOCK (SEMI HOLLOW)"],
      ["HB095", "BEARING (SEMI HOLLOW)"],
      ["HB096", "HANDLE (SEMI HOLLOW)"],
      ["HB097", "TOP RAIL"],
      ["HB098", "WALL JAMB"],
      ["HB099", "WALL JAMB"],
      ["HB115", "DOOR PANEL"],
      ["HB116", "DOOR STILE TOP & BOTTOM"],
      ["HB117", "RAIL"],
      ["HB133", "WALL JAMB"],
      ["HB136", "TRACK"],
      ["HB148", "MULLION - T"],
      ["HB149", "Z FRAME"],
      ["HB150", "LOUVRE BLADE"],
      ["HB151", "LOUVRE JAMB"],
      ["HB193", "LIGHTER HB117 BOTTOM TRACK"],
      ["HB194", "LIGHTER SC63 HEADER"],
      ["HB195", "BOTTOM BEARING"],
      ["HB196", "HANDLE (SEMI HOLLOW)"],
      ["HB197", "INTERLOCK"],
      ["HB204", "HAND RAIL - ROUND"],
      ["HB208", "TRUNKING WITH COVER HB209 4 x 1.75"],
      ["HB209", "COVER TRUNKING HB208"],
      ["HB219", "TRIPLE TRACK HEADER"],
      ["HB228", "RECTANGLE - 1¾\" x 4\""],
      ["HB239", "THRESHOLD"],
      ["S841", "#N/A"],
      ["SA173", "JAMB"],
      ["SC002", "DOUBLE FIN-1x3"],
      ["SC006", "SINGLE FIN-1x3"],
      ["SC022", "POV JAMB"],
      ["SC038", "DOOR FRAME"],
      ["SC042", "F SECTION"],
      ["SC063", "DOUBLE HEADER"],
      ["SC077", "TOP RAIL"],
      ["SC078", "BOTTOM RAIL"],
      ["SC079", "DOUBLE ACTING DOOR STILE"],
      ["SC080", "GLAZING STRIP"],
      ["SC081", "PUSH BAR BRACKET"],
      ["SC082", "PUSH BAR BRACKET"],
      ["SC155", "FALSE MULLION"],
      ["SC171", "CHANNEL SLIDING SINGLE HEADER/1.7\" x 1.375\""],
      ["SC174", "JAMB ADAPTOR"],
      ["SC176", "SQUARE - TUBE -  1.75\" x1.75\" x .125\""],
      ["SC219", "CORNER"],
      ["SC229", "WINDOW SECTION"],
      ["SC250", "NO REBATE FRAME"],
      ["SC305", "MULLION"],
      ["SC324", "FLAT STRIP - 1 x 0.055"],
      ["SC347", "ASGAR ALI"],
      ["SC362", "SM 2 1/2\" FIXED LOUVRE"],
      ["SC363", "DOOR FRAME OUTER"],
      ["SC368", "CUPBOARD SECTION"],
      ["SC369", "CUPBOARD SECTION"],
      ["SC370", "CHANNEL - 5/8\" X 25/32\" X 5/64\""],
      ["SC371", "COVER"],
      ["SC372", "CUPBOARD SECTION"],
      ["SC388", "MULLION"],
      ["SC400", "PUSH/PULL HANDLE"],
      ["SC405", "MODIFICATION FOR SC219"],
      ["SC412", "FIXED CURTAIN WALL"],
      ["SC416", "COVER FOR CURTAIN WALL"],
      ["SC417", "COVER FOR CURTAIN WALL"],
      ["SC418", "MOULDING"],
      ["T20", "#N/A"]
    ];
  
    let itemsPerPage = 10;
    let currentPage = 1;
    const tableBody = document.getElementById("dieTable");
    const paginationContainer = document.getElementById("pagination");
    const itemsPerPageSelect = document.getElementById("itemsPerPage");
  
    if (tableBody && paginationContainer && itemsPerPageSelect) {
      function displayTable() {
        tableBody.innerHTML = "";
        let start = (currentPage - 1) * itemsPerPage;
        let end = start + itemsPerPage;
        let visibleRows = itemsPerPage === "all" ? allRows : allRows.slice(start, end);
        if (visibleRows.length === 0) {
          tableBody.innerHTML = "<tr><td colspan='2'>No data available</td></tr>";
        } else {
          visibleRows.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${row[0]}</td><td>${row[1]}</td>`;
            tableBody.appendChild(tr);
          });
        }
        updatePagination();
      }
  
      function changePage(step) {
        const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(allRows.length / itemsPerPage);
        if (currentPage + step > 0 && currentPage + step <= totalPages) {
          currentPage += step;
          displayTable();
        }
      }
  
      function updateTable() {
        itemsPerPage = itemsPerPageSelect.value === "all" ? "all" : parseInt(itemsPerPageSelect.value);
        currentPage = 1;
        displayTable();
      }
  
      function updatePagination() {
        const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(allRows.length / itemsPerPage);
        paginationContainer.style.display = totalPages === 1 ? "none" : "flex";
        const pageNumbersContainer = document.getElementById("pageNumbers");
        if (pageNumbersContainer) {
          pageNumbersContainer.innerHTML = "";
          for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement("a");
            link.href = "#";
            link.textContent = i;
            link.className = "page-number mx-1";
            if (i === currentPage) {
              link.classList.add("active");
            }
            link.addEventListener("click", (e) => {
              e.preventDefault();
              currentPage = i;
              displayTable();
            });
            pageNumbersContainer.appendChild(link);
          }
        }
      }
  
      itemsPerPageSelect.addEventListener("change", updateTable);
      window.changePage = changePage; // Expose to global scope for Previous/Next buttons
      displayTable();
    }
  });
  

  document.addEventListener("DOMContentLoaded", () => {
    // Fixed contacts (first five – remain in given order)
    const fixedContacts = [
      ["Jameel Asgarali", "+1-868-389-7418"],
      ["Sayeed Asgarali", "+1-868-389-7419"],
      ["Adam Asgarali", "+1-868-399-7939"],
      ["Irshaad Alli", "+1-868-496-5748"],
      ["Muzad", "+1-868-724-5120"]
    ];
  
    // Additional contacts (raw data; phone numbers without formatting)
    const additionalContactsRaw = [
      ["Afraz", "3814156"],
      ["Alisha", "7530333"],
      ["Jerome", "3454369"],
      ["Jervon", "4792046"],
      ["Karissa", "3647439"],
      ["Micah", "3990679"],
      ["Rishi", "7169046"],
      ["Sadika", "3786067"],
      ["Saara", "3567290"],
      ["Sham", "7863891"],
      ["Shaquiel", "7738695"],
      ["Zordia", "7195453"],
      ["Joshua", "2878096"],
      ["Laura", "2788584"],
      ["Adil", "6892770"]
    ];
  
    // Office numbers (raw data)
    const officeContactsRaw = [
      ["Office WhatsApp", "3897475"],
      ["Caroni Office", "2997399"]
    ];
  
    // Helper function: formats a 7-digit string into +1-868-xxx-xxxx
    function formatPhoneNumber(rawNumber) {
      const prefix = rawNumber.slice(0, 3);
      const lineNumber = rawNumber.slice(3);
      return `+1-868-${prefix}-${lineNumber}`;
    }
  
    // Process additional contacts: format numbers and sort alphabetically by name
    const additionalContacts = additionalContactsRaw
      .map(contact => [contact[0], formatPhoneNumber(contact[1])])
      .sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));
  
    // Process office contacts: format phone numbers
    const officeContacts = officeContactsRaw.map(contact => {
      return [contact[0], formatPhoneNumber(contact[1])];
    });
  
    // Populate the Contacts table (first fixed contacts, then additional contacts)
    const contactsTable = document.getElementById("contactsTable");
    if (contactsTable) {
      fixedContacts.forEach(contact => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${contact[0]}</td><td>${contact[1]}</td>`;
        contactsTable.appendChild(tr);
      });
      additionalContacts.forEach(contact => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${contact[0]}</td><td>${contact[1]}</td>`;
        contactsTable.appendChild(tr);
      });
    }
  
    // Populate the Office Numbers table
    const officeTable = document.getElementById("officeTable");
    if (officeTable) {
      officeContacts.forEach(contact => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${contact[0]}</td><td>${contact[1]}</td>`;
        officeTable.appendChild(tr);
      });
    }
  });