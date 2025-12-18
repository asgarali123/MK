// ====== DATA: add your contacts here ======
const contacts = [
{
  role: "Electrician",
  name: "Andy",
  company: "",
  phone: "+1-868-340-6719",
  email: ""
},
{
  role: "Electrician",
  name: "Shaba",
  company: "",
  phone: "+1-868-292-2139",
  email: ""
},
{
  role: "Plumber",
  name: "Joshimar",
  company: "",
  phone: "+1-868-392-9510",
  email: ""
},
{
  role: "IT/Computer Services",
  name: "Adam",
  company: "",
  phone: "+1-868-399-7939",
  email: ""
},
{
  role: "Tiles",
  name: "Akeel",
  company: "",
  phone: "+1-868-688-9937",
  email: ""
},
{
  role: "Tiles",
  name: "Reenie",
  company: "",
  phone: "+1-868-731-2520",
  email: ""
},
{
  role: "Construction",
  name: "Anthony",
  company: "",
  phone: "+1-868-737-4166",
  email: ""
},
{
  role: "Automatic Doors",
  name: "Terrance",
  company: "",
  phone: "+1-868-769-9560",
  email: ""
}

];
// ==========================================

const grid = document.getElementById("cardsGrid");

function makeCard(c){
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="card-inner">
      <div class="face front">
        <div class="role">${escapeHtml(c.role || "")}</div>
        <div class="hint">Tap to flip</div>
      </div>

      <div class="face back">
        <div class="row">
          <div class="small">${escapeHtml(c.role || "")}</div>
          <div>
            <div class="name">${escapeHtml(c.company ? c.company : c.name)}</div>
            ${c.company ? `<div class="company">${escapeHtml(c.name)}</div>` : ``}
          </div>
        </div>

        <div class="contact">
          ${c.email ? `<a class="link" href="mailto:${encodeURIComponent(c.email)}" data-link>Email: ${escapeHtml(c.email)}</a>` : ``}
          ${c.phone ? `<a class="link" href="tel:${normalizePhone(c.phone)}" data-link>Call: ${escapeHtml(c.phone)}</a>` : ``}
        </div>
      </div>
    </div>
  `;

  // Flip on click (no hover)
  const inner = card.querySelector(".card-inner");
  inner.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

  // Don’t flip when tapping the links (call/mail)
  card.querySelectorAll("[data-link]").forEach(a=>{
    a.addEventListener("click", (ev)=>{
      ev.stopPropagation();
      // default behavior continues (opens dialer or email)
    });
  });

  return card;
}

function render(){
  grid.innerHTML = "";
  contacts.forEach(c => grid.appendChild(makeCard(c)));
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[s]));
}

function normalizePhone(p){
  // Remove spaces and common separators so tel: works cleanly
  return String(p).replace(/[\s()-]/g,"");
}

render();
